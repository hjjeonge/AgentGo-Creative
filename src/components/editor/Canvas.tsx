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
}

export const Canvas = forwardRef<CanvasHandle, Props>(
  ({ onGenerate }, ref) => {
    const navigate = useNavigate();
    const [activeTool, setActiveTool] = useState<string>("mouse");
    const containerRef = useRef<HTMLDivElement>(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

    const [backgroundImage, setBackgroundImageState] = useState<string | null>(null);
    const [lines, setLines] = useState<DrawLine[]>([]);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [texts, setTexts] = useState<TextObject[]>([]);
    const [currentLine, setCurrentLine] = useState<DrawLine | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [shapeType, setShapeType] = useState("square");


    const [penStrokeWidth, setPenStrokeWidth] = useState(2);
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

    // 단일 선택 시 selectedIds 초기화
    const selectSingleId = (id: string | null) => {
      setSelectedId(id);
      setSelectedIds([]);
    };

    // Delete / Undo / Redo 키 핸들러
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
    }, [selectedId, selectedIds, editingTextId]);

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
        setBackgroundImageState(url);
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
        text: "텍스트를 입력하세요",
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

    const handleToolChange = (tool: string) => {
      if (tool === "text") {
        handleAddText();
        return;
      }
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

    const handlePenStrokeWidth = (value: number) => {
      setPenStrokeWidth(value);
    };

    const handlePenStrokeColor = (value: string) => {
      setPenStrokeColor(value);
    };

    // 이미지 로드 시 비율에 맞게 Stage 크기 계산
    useEffect(() => {
      if (!backgroundImage) {
        setStageSize({ width: 0, height: 0 });
        return;
      }
      const img = new window.Image();
      img.onload = () => {
        const container = containerRef.current;
        const maxWidth = container ? Math.floor(container.clientWidth * 0.95) : 900;
        const maxHeight = container ? Math.floor(container.clientHeight * 0.95) : 650;
        const scale = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight, 1);
        setStageSize({
          width: Math.round(img.naturalWidth * scale),
          height: Math.round(img.naturalHeight * scale),
        });
      };
      img.src = backgroundImage;
    }, [backgroundImage]);

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

        {/* Konva 캔버스 컨테이너 */}
        <div ref={containerRef} className="flex-1 w-full flex items-center justify-center overflow-hidden">
          {stageSize.width > 0 && stageSize.height > 0 ? (
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
          ) : (
            <div className="flex flex-col items-center gap-[8px] text-[#94A3B8] select-none">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
              <span className="text-[14px]">사이드바에서 이미지를 업로드해주세요</span>
            </div>
          )}
        </div>

        <Prompt onGenerate={onGenerate} />
      </section>
    );
  },
);

Canvas.displayName = "Canvas";