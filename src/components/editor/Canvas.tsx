import type React from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  EditorCanvas,
  type DrawLine,
  type Shape,
  type TextObject,
} from "./EditorCanvas";
import { loadGoogleFont } from "../../utils/fontLoader";
import { Toolbar } from "./Toolbar";
import { Prompt } from "./Prompt";
import type { CanvasHandle, CanvasSnapshot } from "../../types/editor";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const rectsOverlap = (r1: Rect, r2: Rect) =>
  r1.x < r2.x + r2.width &&
  r1.x + r1.width > r2.x &&
  r1.y < r2.y + r2.height &&
  r1.y + r1.height > r2.y;

// 점이 폴리곤(flat [x1,y1,x2,y2,...]) 안에 있는지 ray-casting 알고리즘으로 판별
const isPointInPolygon = (px: number, py: number, polygon: number[]) => {
  let inside = false;
  const n = polygon.length / 2;
  let j = n - 1;
  for (let i = 0; i < n; i++) {
    const xi = polygon[i * 2], yi = polygon[i * 2 + 1];
    const xj = polygon[j * 2], yj = polygon[j * 2 + 1];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
    j = i;
  }
  return inside;
};

interface Props {
  onGenerate?: (prompt: string) => void;
  breadcrumbLabel?: string | null;
  breadcrumbPath?: string | null;
}

const DEFAULT_PLACEHOLDER_TEXT = "텍스트를 입력하세요";

export const Canvas = forwardRef<CanvasHandle, Props>(
  ({ onGenerate, breadcrumbLabel, breadcrumbPath }, ref) => {
    const navigate = useNavigate();
    const [activeTool, setActiveTool] = useState<string>("mouse");
    const containerRef = useRef<HTMLDivElement>(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
    type ViewMode = "fit" | "custom";
    const [viewMode, setViewMode] = useState<ViewMode>("fit");
    const [viewScale, setViewScale] = useState(1);
    const [imageNaturalSize, setImageNaturalSize] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handlePointerMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        lastPointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      };

      container.addEventListener("mousemove", handlePointerMove);
      return () => container.removeEventListener("mousemove", handlePointerMove);
    }, []);

    const [backgroundImage, setBackgroundImageState] = useState<string | null>(null);
    const [lines, setLines] = useState<DrawLine[]>([]);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [texts, setTexts] = useState<TextObject[]>([]);
    const [currentLine, setCurrentLine] = useState<DrawLine | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [shapeType, setShapeType] = useState("square");


    const [penStrokeWidth, setPenStrokeWidth] = useState(2);
    const [brushPreview, setBrushPreview] = useState({ x: 0, y: 0, size: 2, visible: false });
    const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const previewTimeoutRef = useRef<number | null>(null);
    const [penStrokeColor, setPenStrokeColor] = useState("#E7000B");

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [selectionRect, setSelectionRect] = useState<Rect | null>(null);
    const selectionStartRef = useRef<{ x: number; y: number } | null>(null);
    const [shapeSelectMode, setShapeSelectMode] = useState<"rect" | "lasso">("rect");
    const [lassoPath, setLassoPath] = useState<number[]>([]);
    const [isLassoing, setIsLassoing] = useState(false);
    const objectRefs = useRef<Record<string, any>>({});
    const trRef = useRef<any>(null);

    // 단일 선택 후 selectedIds 초기화
    const selectSingleId = (id: string | null) => {
      setSelectedId(id);
      setSelectedIds([]);
    };

    // Delete / Undo / Redo 핸들러
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl+Z: Undo
        if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
          e.preventDefault();
          const prev = undoStack.current.pop();
          if (!prev) return;
          redoStack.current.push({
            lines: linesRef.current,
            shapes: shapesRef.current,
            texts: textsRef.current,
            backgroundImage: backgroundImageRef.current,
          });
          applyHistory(prev);
          return;
        }
        // Ctrl+Y or Ctrl+Shift+Z: Redo
        if ((e.key === "y" && (e.ctrlKey || e.metaKey)) || (e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey)) {
          e.preventDefault();
          const next = redoStack.current.pop();
          if (!next) return;
          undoStack.current.push({
            lines: linesRef.current,
            shapes: shapesRef.current,
            texts: textsRef.current,
            backgroundImage: backgroundImageRef.current,
          });
          applyHistory(next);
          return;
        }
        // Brush size ([ / ])
        if ((e.key === "[" || e.key === "]") && !editingTextId) {
          e.preventDefault();
          const delta = e.shiftKey ? 5 : 1;
          const next = e.key === "]" ? penStrokeWidth + delta : penStrokeWidth - delta;
          const clamped = Math.max(1, Math.min(200, next));
          setPenStrokeWidth(clamped);
          showBrushPreview(clamped);
          return;
        }

        // Delete/Backspace: 선택 객체 삭제
        if ((e.key === "Delete" || e.key === "Backspace") && !editingTextId) {
          const toDelete = selectedIds.length > 0 ? selectedIds : selectedId ? [selectedId] : [];
          if (toDelete.length === 0) return;
          pushUndo();
          toDelete.forEach((id) => {
            if (id.startsWith("text_")) {
              setTexts((prev) => prev.filter((t) => t.id !== id));
            } else if (id.startsWith("shape_")) {
              setShapes((prev) => prev.filter((s) => s.id !== id));
            }
          });
          setSelectedId(null);
          setSelectedIds([]);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedId, selectedIds, editingTextId, penStrokeWidth]);

    // Refs for snapshot (always up-to-date)
    const linesRef = useRef(lines);
    const shapesRef = useRef(shapes);
    const textsRef = useRef(texts);
    const backgroundImageRef = useRef(backgroundImage);

    useEffect(() => { linesRef.current = lines; }, [lines]);
    useEffect(() => { shapesRef.current = shapes; }, [shapes]);
    useEffect(() => { textsRef.current = texts; }, [texts]);
    useEffect(() => { backgroundImageRef.current = backgroundImage; }, [backgroundImage]);

    // Undo / Redo 스택
    type HistoryState = { lines: DrawLine[]; shapes: Shape[]; texts: TextObject[]; backgroundImage: string | null };
    const undoStack = useRef<HistoryState[]>([]);
    const redoStack = useRef<HistoryState[]>([]);

    const pushUndo = () => {
      undoStack.current.push({
        lines: linesRef.current,
        shapes: shapesRef.current,
        texts: textsRef.current,
        backgroundImage: backgroundImageRef.current,
      });
      redoStack.current = [];
    };

    const applyHistory = (state: HistoryState) => {
      setLines(state.lines);
      setShapes(state.shapes);
      setTexts(state.texts);
      setBackgroundImageState(state.backgroundImage);
      setSelectedId(null);
      setSelectedIds([]);
      setEditingTextId(null);
    };

    useImperativeHandle(ref, () => ({
      setBackgroundImage: (url: string | null) => {
        backgroundImageRef.current = url;
        setBackgroundImageState(url);
        setViewMode("fit");
      },
      getSnapshot: (): CanvasSnapshot => ({
        lines: linesRef.current,
        shapes: shapesRef.current,
        texts: textsRef.current,
        backgroundImage: backgroundImageRef.current,
      }),
      restoreSnapshot: (snapshot: CanvasSnapshot) => {
        setLines(snapshot.lines);
        setShapes(snapshot.shapes);
        setTexts(snapshot.texts);
        setBackgroundImageState(snapshot.backgroundImage);
        setViewMode("fit");
        setSelectedId(null);
        setSelectedIds([]);
        setEditingTextId(null);
      },
      hasImage: () => backgroundImageRef.current !== null,
      clearCanvas: () => {
        setLines([]);
        setShapes([]);
        setTexts([]);
        setBackgroundImageState(null);
        setImageNaturalSize(null);
        setViewMode("fit");
        setViewScale(1);
        setSelectedId(null);
        setSelectedIds([]);
        setEditingTextId(null);
      },
    }));

    useEffect(() => {
      if (trRef.current) {
        if (!editingTextId) {
          if (selectedIds.length > 1) {
            const nodes = selectedIds.map((id) => objectRefs.current[id]).filter(Boolean);
            trRef.current.nodes(nodes);
          } else if (selectedId) {
            const node = objectRefs.current[selectedId];
            if (node) trRef.current.nodes([node]);
          } else {
            trRef.current.nodes([]);
          }
        } else {
          trRef.current.nodes([]);
        }
        trRef.current.getLayer()?.batchDraw();
      }
    }, [selectedId, selectedIds, shapes, texts, editingTextId]);

    const handleAddText = () => {
      pushUndo();
      const defaultFont = "Noto Sans KR";
      loadGoogleFont(defaultFont);

      const newText: TextObject = {
        id: `text_${texts.length}`,
        text: DEFAULT_PLACEHOLDER_TEXT,
        x: 150,
        y: 150,
        width: 200,
        fontSize: 24,
        fill: "#000000",
        fontFamily: defaultFont,
        fontStyle: "normal",
        textDecoration: "",
        align: "left",
        verticalAlign: "top",
        letterSpacing: 0,
        lineHeight: 1.2,
        scaleX: 1,
        listFormat: "none",
        stroke: "#000000",
        strokeWidth: 0,
        strokeEnabled: false,
        shadowColor: "none",
        shadowBlur: 0,
        shadowOpacity: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowDirection: 0,
        shadowDistance: 0,
        shadowEnabled: false,
        verticalWriting: false,
        backgroundColor: "#FFFF00",
        backgroundEnabled: false,
      };
      setTexts((prev) => [...prev, newText]);
      setSelectedId(newText.id);
      setActiveTool("mouse");
    };

    const removeUneditedPlaceholderTexts = (candidateIds: string[]) => {
      const targetIds = candidateIds.filter((id) => id.startsWith("text_"));
      if (targetIds.length === 0) return;

      const removableIds = targetIds.filter((id) => {
        const textObj = textsRef.current.find((item) => item.id === id);
        return !!textObj && textObj.text.trim() === DEFAULT_PLACEHOLDER_TEXT;
      });

      if (removableIds.length === 0) return;

      pushUndo();
      setTexts((prev) => prev.filter((item) => !removableIds.includes(item.id)));
    };

    const handleToolChange = (tool: string) => {
      if (tool === "text") {
        handleAddText();
        return;
      }

      removeUneditedPlaceholderTexts([
        ...(selectedId ? [selectedId] : []),
        ...selectedIds,
      ]);

      setActiveTool(tool);
      setSelectedId(null);
      setSelectedIds([]);
      setEditingTextId(null);
      selectionStartRef.current = null;
      setSelectionRect(null);
      setLassoPath([]);
      setIsLassoing(false);
    };

    const handleUpdateTextObject = (id: string, updates: Partial<TextObject>) => {
      setTexts((prev) =>
        prev.map((text) => (text.id === id ? { ...text, ...updates } : text)),
      );
    };

    const showBrushPreview = (size: number) => {
      if (previewTimeoutRef.current) {
        window.clearTimeout(previewTimeoutRef.current);
      }
      const { x, y } = lastPointerRef.current;
      setBrushPreview({ x, y, size, visible: true });
      previewTimeoutRef.current = window.setTimeout(() => {
        setBrushPreview((prev) => ({ ...prev, visible: false }));
      }, 800);
    };

    useEffect(() => {
      return () => {
        if (previewTimeoutRef.current) {
          window.clearTimeout(previewTimeoutRef.current);
        }
      };
    }, []);

    const handlePenStrokeWidth = (value: number) => {
      setPenStrokeWidth(value);
    };
    const handlePenStrokeColor = (value: string) => {
      setPenStrokeColor(value);
    };

    const fitScale = (() => {
      if (!imageNaturalSize || stageSize.width <= 0 || stageSize.height <= 0) return 1;
      const sx = stageSize.width / imageNaturalSize.width;
      const sy = stageSize.height / imageNaturalSize.height;
      return Math.min(1, Math.min(sx, sy));
    })();

    const fillScale = (() => {
      if (!imageNaturalSize || stageSize.width <= 0 || stageSize.height <= 0) return 1;
      const sx = stageSize.width / imageNaturalSize.width;
      const sy = stageSize.height / imageNaturalSize.height;
      return Math.max(sx, sy);
    })();

    useEffect(() => {
      if (!backgroundImage) {
        setImageNaturalSize(null);
        setViewMode("fit");
        setViewScale(1);
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        setImageNaturalSize({
          width: Math.max(1, img.naturalWidth || img.width),
          height: Math.max(1, img.naturalHeight || img.height),
        });
      };
      img.src = backgroundImage;
    }, [backgroundImage]);

    useEffect(() => {
      if (!backgroundImage) return;
      if (viewMode === "fit") {
        setViewScale(fitScale);
      } else if (viewMode === "actual") {
        setViewScale(1);
      } else if (viewMode === "fill") {
        setViewScale(fillScale);
      }
    }, [backgroundImage, viewMode, fitScale, fillScale]);

    const handleSetFit = () => {
      setViewMode("fit");
      setViewScale(fitScale);
    };

    const handleSetActual = () => {
      setViewMode("actual");
      setViewScale(1);
    };

    const handleSetFill = () => {
      setViewMode("fill");
      setViewScale(fillScale);
    };

    const handleCanvasWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      if (!backgroundImage) return;
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;
      const minScale = Math.min(fitScale, 1);
      const nextScale = Math.max(minScale, Math.min(6, viewScale * zoomFactor));
      setViewMode("custom");
      setViewScale(nextScale);
    };

    // Canvas should fill the available area regardless of image size.
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateSize = () => {
        setStageSize({
          width: Math.max(0, Math.floor(container.clientWidth)),
          height: Math.max(0, Math.floor(container.clientHeight)),
        });
      };

      updateSize();
      const observer = new ResizeObserver(updateSize);
      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    const handleMouseDown = (e: any) => {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedId(null);
        setSelectedIds([]);
        setEditingTextId(null);

        if (activeTool === "shape") {
          const pos = e.target.getStage().getRelativePointerPosition();
          if (shapeSelectMode === "rect") {
            selectionStartRef.current = { x: pos.x, y: pos.y };
            setSelectionRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
          } else {
            setLassoPath([pos.x, pos.y]);
            setIsLassoing(true);
          }
          return;
        }
      }

      if (activeTool !== "pen" && activeTool !== "eraser") {
        return;
      }

      setIsDrawing(true);
      const pos = e.target.getStage().getRelativePointerPosition();
      setCurrentLine({
        points: [pos.x, pos.y],
        tool: activeTool,
        strokeWidth: penStrokeWidth,
        stroke: penStrokeColor,
      });
    };

    const handleMouseMove = (e: any) => {
      if (activeTool === "shape") {
        const pos = e.target.getStage().getRelativePointerPosition();
        if (shapeSelectMode === "rect" && selectionStartRef.current) {
          const start = selectionStartRef.current;
          setSelectionRect({
            x: Math.min(pos.x, start.x),
            y: Math.min(pos.y, start.y),
            width: Math.abs(pos.x - start.x),
            height: Math.abs(pos.y - start.y),
          });
          return;
        }
        if (shapeSelectMode === "lasso" && isLassoing) {
          setLassoPath((prev) => [...prev, pos.x, pos.y]);
          return;
        }
      }

      if (!isDrawing || (activeTool !== "pen" && activeTool !== "eraser")) return;

      const stage = e.target.getStage();
      const point = stage.getRelativePointerPosition();

      setCurrentLine((prev) =>
        prev
          ? {
              ...prev,
              points: [...prev.points, point.x, point.y],
            }
          : null,
      );
    };

    const finishSelection = (ids: string[]) => {
      if (ids.length === 1) {
        setSelectedId(ids[0]);
        setSelectedIds([]);
      } else if (ids.length > 1) {
        setSelectedId(null);
        setSelectedIds(ids);
      }
    };

    const handleMouseUp = () => {
      if (activeTool === "shape") {
        if (shapeSelectMode === "rect" && selectionStartRef.current) {
          selectionStartRef.current = null;
          if (selectionRect && selectionRect.width > 2 && selectionRect.height > 2) {
            const ids: string[] = [];
            shapes.forEach((shape) => {
              if (rectsOverlap(selectionRect, { x: shape.x, y: shape.y, width: shape.width, height: shape.height })) {
                ids.push(shape.id);
              }
            });
            texts.forEach((text) => {
              const node = objectRefs.current[text.id];
              if (node) {
                const rect = node.getClientRect();
                if (rectsOverlap(selectionRect, rect)) ids.push(text.id);
              }
            });
            finishSelection(ids);
          }
          setSelectionRect(null);
          return;
        }

        if (shapeSelectMode === "lasso" && isLassoing) {
          setIsLassoing(false);
          if (lassoPath.length >= 6) {
            const ids: string[] = [];
            shapes.forEach((shape) => {
              const cx = shape.x + shape.width / 2;
              const cy = shape.y + shape.height / 2;
              if (isPointInPolygon(cx, cy, lassoPath)) ids.push(shape.id);
            });
            texts.forEach((text) => {
              const node = objectRefs.current[text.id];
              if (node) {
                const rect = node.getClientRect();
                const cx = rect.x + rect.width / 2;
                const cy = rect.y + rect.height / 2;
                if (isPointInPolygon(cx, cy, lassoPath)) ids.push(text.id);
              }
            });
            finishSelection(ids);
          }
          setLassoPath([]);
          return;
        }
      }

      if (!currentLine) return;

      pushUndo();
      setLines((prev) => [...prev, currentLine]);
      setCurrentLine(null);
      setIsDrawing(false);
    };

    const handleAddShape = (shapeType: string) => {
      setShapeType(shapeType);
      if (shapeType === "square") {
        pushUndo();
        const newSquare: Shape = {
          id: `shape_${shapes.length}`,
          type: "square",
          x: 100,
          y: 100,
          width: 50,
          height: 50,
          fill: "red",
        };
        setShapes((prev) => [...prev, newSquare]);
      }
    };

    const handleTransformEnd = (e: any) => {
      pushUndo();
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const id = node.id();

      node.scaleX(1);
      node.scaleY(1);

      setTexts((prev) =>
        prev.map((text) => {
          if (text.id !== id) return text;
          const baseScaleX = text.scaleX ?? 1;
          const effectiveScaleX = scaleX / baseScaleX;
          return {
            ...text,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, (text.width ?? node.width()) * effectiveScaleX),
            fontSize: Math.max(5, text.fontSize * scaleY),
          };
        }),
      );

      setShapes((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                x: node.x(),
                y: node.y(),
                width: Math.max(5, s.width * scaleX),
                height: Math.max(5, s.height * scaleY),
              }
            : s,
        ),
      );
    };

    const isTextSelected = selectedId?.startsWith("text_") && !editingTextId;
    const selectedTextObject = isTextSelected
      ? texts.find((t) => t.id === selectedId)
      : undefined;

    return (
      <section className="h-full flex-1 min-w-0 bg-[#E2E8F0] relative flex flex-col items-center">
        {/* 브레드크럼 */}
        <div className="absolute top-[12px] left-[16px] z-[10] flex items-center gap-[6px] text-[13px]">
          <button
            onClick={() => navigate("/")}
            className="text-[#64748B] hover:text-[#155DFC]"
          >
            홈
          </button>
          {breadcrumbLabel && breadcrumbPath ? (
            <>
              <span className="text-[#94A3B8]">&gt;</span>
              <button
                onClick={() => navigate(breadcrumbPath)}
                className="text-[#64748B] hover:text-[#155DFC]"
              >
                {breadcrumbLabel}
              </button>
            </>
          ) : null}
          <span className="text-[#94A3B8]">&gt;</span>
          <span className="text-[#0F172B] font-medium">이미지 에디터</span>
        </div>

        {/* 툴바 */}
        <Toolbar
          activeTool={activeTool}
          onToolChange={handleToolChange}
          penStrokeWidth={penStrokeWidth}
          handlePenStrokeWidth={handlePenStrokeWidth}
          penStrokeColor={penStrokeColor}
          handlePenStrokeColor={handlePenStrokeColor}
          shapeType={shapeType}
          setShapeType={handleAddShape}
          shapeSelectMode={shapeSelectMode}
          setShapeSelectMode={setShapeSelectMode}
          isTextEditorVisible={!!isTextSelected}
          selectedTextObject={selectedTextObject}
          handleUpdateTextObject={handleUpdateTextObject}
        />

        {/* Konva canvas container */}
        <div
          ref={containerRef}
          onWheel={handleCanvasWheel}
          className="relative flex-1 w-full flex items-center justify-center overflow-hidden"
        >
          {backgroundImage && (
            <div className="absolute right-[16px] top-[12px] z-[12] flex items-center gap-[6px] rounded-[8px] border border-[#CBD5E1] bg-white/95 p-[4px] shadow-sm">
              <button
                type="button"
                onClick={handleSetFit}
                className={`rounded-[6px] px-[10px] py-[4px] text-[12px] ${viewMode === "fit" ? "bg-[#1447E6] text-white" : "text-[#334155] hover:bg-[#F1F5F9]"}`}
              >
                Fit
              </button>
              <button
                type="button"
                onClick={handleSetActual}
                className={`rounded-[6px] px-[10px] py-[4px] text-[12px] ${viewMode === "actual" ? "bg-[#1447E6] text-white" : "text-[#334155] hover:bg-[#F1F5F9]"}`}
              >
                100%
              </button>
              <button
                type="button"
                onClick={handleSetFill}
                className={`rounded-[6px] px-[10px] py-[4px] text-[12px] ${viewMode === "fill" ? "bg-[#1447E6] text-white" : "text-[#334155] hover:bg-[#F1F5F9]"}`}
              >
                Fill
              </button>
              <span className="ml-[4px] text-[12px] text-[#64748B]">{Math.round(viewScale * 100)}%</span>
            </div>
          )}

          {brushPreview.visible && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: brushPreview.x - brushPreview.size / 2,
                top: brushPreview.y - brushPreview.size / 2,
                width: brushPreview.size,
                height: brushPreview.size,
                borderRadius: "50%",
                border: "1.5px solid rgba(21,93,252,0.9)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.8)",
                pointerEvents: "none",
                zIndex: 5,
              }}
            />
          )}

          {stageSize.width > 0 && stageSize.height > 0 ? (
            <div
              style={{
                transform: `scale(${viewScale})`,
                transformOrigin: "center center",
                transition: "transform 120ms ease-out",
              }}
            >
              <EditorCanvas
                stageSize={stageSize}
                activeTool={activeTool}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseUp={handleMouseUp}
                lines={lines}
                currentLine={currentLine}
                shapes={shapes}
                texts={texts}
                setSelectedId={selectSingleId}
                objectRefs={objectRefs}
                trRef={trRef}
                handleTransformEnd={handleTransformEnd}
                editingTextId={editingTextId}
                setEditingTextId={setEditingTextId}
                handleUpdateTextObject={handleUpdateTextObject}
                backgroundImageUrl={backgroundImage}
                selectionRect={selectionRect}
                lassoPath={lassoPath}
                selectedIds={selectedIds}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-[8px] text-[#94A3B8] select-none">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
              <span className="text-[14px]">사이드바에서 이미지를 업로드해 주세요</span>
            </div>
          )}
        </div>

        <Prompt onGenerate={onGenerate} />
      </section>
    );
  },
);

Canvas.displayName = "Canvas";















