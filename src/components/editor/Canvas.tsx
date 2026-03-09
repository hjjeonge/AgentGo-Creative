import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorCanvas } from './EditorCanvas';
import { loadGoogleFont } from '../../utils/fontLoader';
import { Toolbar } from './Toolbar';
import { Prompt } from './Prompt';
import type {
  CanvasHandle,
  CanvasSnapshot,
  DrawLine,
  Rect,
  Shape,
  TextObject,
} from '../../types/editor';

interface Props {
  onGenerate?: (prompt: string) => void;
  breadcrumbLabel?: string | null;
  breadcrumbPath?: string | null;
  onSelectedTextObjectChange?: (textObject?: TextObject) => void;
}

const DEFAULT_PLACEHOLDER_TEXT = '텍스트를 입력하세요';
const UPLOADED_IMAGE_SHAPE_PREFIX = 'shape_uploaded_image_';

export const Canvas = forwardRef<CanvasHandle, Props>(
  (
    { onGenerate, breadcrumbLabel, breadcrumbPath, onSelectedTextObjectChange },
    ref,
  ) => {
    const navigate = useNavigate();
    const [activeTool, setActiveTool] = useState<string>('mouse');
    const containerRef = useRef<HTMLDivElement>(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

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

      container.addEventListener('mousemove', handlePointerMove);
      return () =>
        container.removeEventListener('mousemove', handlePointerMove);
    }, []);

    const [backgroundImage, setBackgroundImageState] = useState<string | null>(
      null,
    );
    const [lines, setLines] = useState<DrawLine[]>([]);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [texts, setTexts] = useState<TextObject[]>([]);
    const [currentLine, setCurrentLine] = useState<DrawLine | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [shapeType, setShapeType] = useState('square');

    const [penStrokeWidth, setPenStrokeWidth] = useState(2);
    const [brushPreview, setBrushPreview] = useState({
      x: 0,
      y: 0,
      size: 2,
      visible: false,
    });
    const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const previewTimeoutRef = useRef<number | null>(null);
    const [penStrokeColor, setPenStrokeColor] = useState('#E7000B');

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [selectionRect, setSelectionRect] = useState<Rect | null>(null);
    const selectionStartRef = useRef<{ x: number; y: number } | null>(null);
    const [shapeSelectMode, setShapeSelectMode] = useState<'rect' | 'lasso'>(
      'rect',
    );
    const [lassoPath, setLassoPath] = useState<number[]>([]);
    const [isLassoing, setIsLassoing] = useState(false);
    const objectRefs = useRef<Record<string, any>>({});
    const trRef = useRef<any>(null);

    const addUploadedImageShape = (url: string) => {
      const image = new window.Image();
      image.onload = () => {
        const naturalWidth = Math.max(1, image.naturalWidth || image.width);
        const naturalHeight = Math.max(1, image.naturalHeight || image.height);
        const canvasWidth = stageSize.width > 0 ? stageSize.width : 480;
        const canvasHeight = stageSize.height > 0 ? stageSize.height : 600;
        const targetWidth = Math.max(1, Math.round(canvasWidth * 0.5));
        const targetHeight = Math.max(
          1,
          Math.round((targetWidth * naturalHeight) / naturalWidth),
        );
        const targetX = Math.max(
          0,
          Math.round((canvasWidth - targetWidth) / 2),
        );
        const targetY = Math.max(
          0,
          Math.round((canvasHeight - targetHeight) / 2),
        );
        const imageShapeId = `${UPLOADED_IMAGE_SHAPE_PREFIX}${Date.now()}_${Math.floor(Math.random() * 10000)}`;

        setShapes((prev) => {
          const next = [...prev];
          next.push({
            id: imageShapeId,
            type: 'uploaded_image',
            x: targetX,
            y: targetY,
            width: targetWidth,
            height: targetHeight,
            fill: 'transparent',
            imageUrl: url,
            sourceWidth: naturalWidth,
            sourceHeight: naturalHeight,
            cropX: 0,
            cropY: 0,
            cropWidth: naturalWidth,
            cropHeight: naturalHeight,
          });
          return next;
        });
        setSelectedId(imageShapeId);
        setSelectedIds([]);
        setActiveTool('mouse');
      };
      image.src = url;
    };

    // 단일 선택 후 selectedIds 초기화
    const selectSingleId = (id: string | null) => {
      setSelectedId(id);
      setSelectedIds([]);
    };

    const handleSelectObject = (id: string | null) => {
      selectSingleId(id);
      setEditingTextId(null);
      setActiveTool('mouse');
    };

    // Delete / Undo / Redo 핸들러
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl+Z: Undo
        if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
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
        if (
          (e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
          (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)
        ) {
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
        if ((e.key === '[' || e.key === ']') && !editingTextId) {
          e.preventDefault();
          const delta = e.shiftKey ? 5 : 1;
          const next =
            e.key === ']' ? penStrokeWidth + delta : penStrokeWidth - delta;
          const clamped = Math.max(1, Math.min(200, next));
          setPenStrokeWidth(clamped);
          showBrushPreview(clamped);
          return;
        }

        // Delete/Backspace: 선택 객체 삭제
        if ((e.key === 'Delete' || e.key === 'Backspace') && !editingTextId) {
          const toDelete =
            selectedIds.length > 0
              ? selectedIds
              : selectedId
                ? [selectedId]
                : [];
          if (toDelete.length === 0) return;
          pushUndo();
          setTexts((prev) => prev.filter((t) => !toDelete.includes(t.id)));
          setShapes((prev) => {
            const next = prev.filter((shape) => !toDelete.includes(shape.id));
            const hasUploadedImage = next.some(
              (shape) => shape.type === 'uploaded_image',
            );
            if (!hasUploadedImage) {
              backgroundImageRef.current = null;
              setBackgroundImageState(null);
            }
            return next;
          });
          setSelectedId(null);
          setSelectedIds([]);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, selectedIds, editingTextId, penStrokeWidth]);

    // Refs for snapshot (always up-to-date)
    const linesRef = useRef(lines);
    const shapesRef = useRef(shapes);
    const textsRef = useRef(texts);
    const backgroundImageRef = useRef(backgroundImage);

    useEffect(() => {
      linesRef.current = lines;
    }, [lines]);
    useEffect(() => {
      shapesRef.current = shapes;
    }, [shapes]);
    useEffect(() => {
      textsRef.current = texts;
    }, [texts]);
    useEffect(() => {
      backgroundImageRef.current = backgroundImage;
    }, [backgroundImage]);

    // Undo / Redo 스택
    type HistoryState = {
      lines: DrawLine[];
      shapes: Shape[];
      texts: TextObject[];
      backgroundImage: string | null;
    };
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
        if (url) {
          pushUndo();
          addUploadedImageShape(url);
        } else {
          setShapes((prev) =>
            prev.filter((shape) => shape.type !== 'uploaded_image'),
          );
        }
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
        if (
          snapshot.backgroundImage &&
          !snapshot.shapes.some((shape) => shape.type === 'uploaded_image')
        ) {
          addUploadedImageShape(snapshot.backgroundImage);
        }
        setSelectedId(null);
        setSelectedIds([]);
        setEditingTextId(null);
      },
      hasImage: () =>
        backgroundImageRef.current !== null ||
        shapesRef.current.some((shape) => shape.type === 'uploaded_image'),
      addText: () => {
        handleAddText();
      },
      updateTextObject: (id: string, updates: Partial<TextObject>) => {
        handleUpdateTextObject(id, updates);
      },
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
            const nodes = selectedIds
              .map((id) => objectRefs.current[id])
              .filter(Boolean);
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
      const defaultFont = 'Noto Sans KR';
      loadGoogleFont(defaultFont);

      const newText: TextObject = {
        id: `text_${texts.length}`,
        text: DEFAULT_PLACEHOLDER_TEXT,
        x: 150,
        y: 150,
        width: 200,
        fontSize: 24,
        fill: '#000000',
        fontFamily: defaultFont,
        fontStyle: 'normal',
        textDecoration: '',
        align: 'left',
        verticalAlign: 'top',
        letterSpacing: 0,
        lineHeight: 1.2,
        scaleX: 1,
        listFormat: 'none',
        stroke: '#000000',
        strokeWidth: 0,
        strokeEnabled: false,
        shadowColor: 'none',
        shadowBlur: 0,
        shadowOpacity: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowDirection: 0,
        shadowDistance: 0,
        shadowEnabled: false,
        verticalWriting: false,
        backgroundColor: '#FFFF00',
        backgroundEnabled: false,
      };
      setTexts((prev) => [...prev, newText]);
      setSelectedId(newText.id);
      setActiveTool('mouse');
    };

    const removeUneditedPlaceholderTexts = (candidateIds: string[]) => {
      const targetIds = candidateIds.filter((id) => id.startsWith('text_'));
      if (targetIds.length === 0) return;

      const removableIds = targetIds.filter((id) => {
        const textObj = textsRef.current.find((item) => item.id === id);
        return !!textObj && textObj.text.trim() === DEFAULT_PLACEHOLDER_TEXT;
      });

      if (removableIds.length === 0) return;

      pushUndo();
      setTexts((prev) =>
        prev.filter((item) => !removableIds.includes(item.id)),
      );
    };

    const handleToolChange = (tool: string) => {
      if (tool === 'text') {
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

    const handleUpdateTextObject = (
      id: string,
      updates: Partial<TextObject>,
    ) => {
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
      if (activeTool === 'shape') {
        const pos = e.target.getStage().getRelativePointerPosition();
        setSelectedId(null);
        setSelectedIds([]);
        setEditingTextId(null);
        if (shapeSelectMode === 'rect') {
          selectionStartRef.current = { x: pos.x, y: pos.y };
          setSelectionRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
        } else {
          setLassoPath([pos.x, pos.y]);
          setIsLassoing(true);
        }
        return;
      }

      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedId(null);
        setSelectedIds([]);
        setEditingTextId(null);
      }

      if (activeTool !== 'pen' && activeTool !== 'eraser') {
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
      if (activeTool === 'shape') {
        const pos = e.target.getStage().getRelativePointerPosition();
        if (shapeSelectMode === 'rect' && selectionStartRef.current) {
          const start = selectionStartRef.current;
          setSelectionRect({
            x: Math.min(pos.x, start.x),
            y: Math.min(pos.y, start.y),
            width: Math.abs(pos.x - start.x),
            height: Math.abs(pos.y - start.y),
          });
          return;
        }
        if (shapeSelectMode === 'lasso' && isLassoing) {
          setLassoPath((prev) => [...prev, pos.x, pos.y]);
          return;
        }
      }

      if (!isDrawing || (activeTool !== 'pen' && activeTool !== 'eraser'))
        return;

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

    const handleMouseUp = (e: any) => {
      if (activeTool === 'shape') {
        const cropByRect = (rect: Rect) => {
          const uploadedShapes = shapesRef.current.filter(
            (shape) => shape.type === 'uploaded_image',
          );
          if (uploadedShapes.length === 0) return false;

          const intersections = uploadedShapes
            .map((shape) => {
              const ix = Math.max(rect.x, shape.x);
              const iy = Math.max(rect.y, shape.y);
              const ix2 = Math.min(rect.x + rect.width, shape.x + shape.width);
              const iy2 = Math.min(
                rect.y + rect.height,
                shape.y + shape.height,
              );
              const iWidth = Math.max(0, ix2 - ix);
              const iHeight = Math.max(0, iy2 - iy);
              return {
                shape,
                ix,
                iy,
                iWidth,
                iHeight,
                area: iWidth * iHeight,
              };
            })
            .filter((candidate) => candidate.area > 4);
          if (intersections.length === 0) return false;

          const selectedCandidate = selectedId
            ? intersections.find(
                (candidate) => candidate.shape.id === selectedId,
              )
            : undefined;
          const target =
            selectedCandidate ?? intersections[intersections.length - 1];
          if (!target) return false;

          const applyCrop = (sourceWidth: number, sourceHeight: number) => {
            const safeSourceWidth = Math.max(1, sourceWidth);
            const safeSourceHeight = Math.max(1, sourceHeight);
            const currentCropX = target.shape.cropX ?? 0;
            const currentCropY = target.shape.cropY ?? 0;
            const currentCropWidth = Math.max(
              1,
              target.shape.cropWidth ?? safeSourceWidth,
            );
            const currentCropHeight = Math.max(
              1,
              target.shape.cropHeight ?? safeSourceHeight,
            );
            const scaleX = currentCropWidth / Math.max(1, target.shape.width);
            const scaleY = currentCropHeight / Math.max(1, target.shape.height);

            const nextCropX =
              currentCropX + (target.ix - target.shape.x) * scaleX;
            const nextCropY =
              currentCropY + (target.iy - target.shape.y) * scaleY;
            const nextCropWidth = target.iWidth * scaleX;
            const nextCropHeight = target.iHeight * scaleY;

            pushUndo();
            setShapes((prev) =>
              prev.map((shape) =>
                shape.id === target.shape.id
                  ? {
                      ...shape,
                      x: target.ix,
                      y: target.iy,
                      width: target.iWidth,
                      height: target.iHeight,
                      sourceWidth: safeSourceWidth,
                      sourceHeight: safeSourceHeight,
                      cropX: nextCropX,
                      cropY: nextCropY,
                      cropWidth: nextCropWidth,
                      cropHeight: nextCropHeight,
                    }
                  : shape,
              ),
            );
            setSelectedId(target.shape.id);
            setSelectedIds([]);
            setActiveTool('mouse');
          };

          if (
            (target.shape.sourceWidth ?? 0) <= 0 ||
            (target.shape.sourceHeight ?? 0) <= 0
          ) {
            const url = target.shape.imageUrl;
            if (url) {
              const image = new window.Image();
              image.onload = () =>
                applyCrop(
                  Math.max(1, image.naturalWidth || image.width),
                  Math.max(1, image.naturalHeight || image.height),
                );
              image.src = url;
              return true;
            }
          }

          applyCrop(
            Math.max(1, target.shape.sourceWidth ?? target.shape.width),
            Math.max(1, target.shape.sourceHeight ?? target.shape.height),
          );
          return true;
        };

        if (shapeSelectMode === 'rect' && selectionStartRef.current) {
          const start = selectionStartRef.current;
          const pos = e?.target?.getStage()?.getRelativePointerPosition?.() as {
            x: number;
            y: number;
          } | null;
          const finalRect = pos
            ? {
                x: Math.min(pos.x, start.x),
                y: Math.min(pos.y, start.y),
                width: Math.abs(pos.x - start.x),
                height: Math.abs(pos.y - start.y),
              }
            : selectionRect;
          selectionStartRef.current = null;
          if (finalRect && finalRect.width > 2 && finalRect.height > 2) {
            cropByRect(finalRect);
          }
          setSelectionRect(null);
          return;
        }

        if (shapeSelectMode === 'lasso' && isLassoing) {
          setIsLassoing(false);
          if (lassoPath.length >= 6) {
            let minX = Number.POSITIVE_INFINITY;
            let minY = Number.POSITIVE_INFINITY;
            let maxX = Number.NEGATIVE_INFINITY;
            let maxY = Number.NEGATIVE_INFINITY;

            for (let i = 0; i < lassoPath.length; i += 2) {
              const x = lassoPath[i];
              const y = lassoPath[i + 1];
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }

            const width = Math.max(1, maxX - minX);
            const height = Math.max(1, maxY - minY);
            if (width > 2 && height > 2) {
              const maskRect = { x: minX, y: minY, width, height };
              const uploadedShapes = shapesRef.current.filter(
                (shape) => shape.type === 'uploaded_image',
              );
              const intersections = uploadedShapes
                .map((shape) => {
                  const ix = Math.max(maskRect.x, shape.x);
                  const iy = Math.max(maskRect.y, shape.y);
                  const ix2 = Math.min(
                    maskRect.x + maskRect.width,
                    shape.x + shape.width,
                  );
                  const iy2 = Math.min(
                    maskRect.y + maskRect.height,
                    shape.y + shape.height,
                  );
                  const iWidth = Math.max(0, ix2 - ix);
                  const iHeight = Math.max(0, iy2 - iy);
                  return {
                    shape,
                    area: iWidth * iHeight,
                  };
                })
                .filter((candidate) => candidate.area > 4);

              const selectedCandidate = selectedId
                ? intersections.find(
                    (candidate) => candidate.shape.id === selectedId,
                  )
                : undefined;
              const target =
                selectedCandidate ?? intersections[intersections.length - 1];

              if (target) {
                const safeWidth = Math.max(1, target.shape.width);
                const safeHeight = Math.max(1, target.shape.height);
                const localMaskPath: number[] = [];
                for (let i = 0; i < lassoPath.length; i += 2) {
                  const stageX = lassoPath[i];
                  const stageY = lassoPath[i + 1];
                  const localX = stageX - target.shape.x;
                  const localY = stageY - target.shape.y;
                  localMaskPath.push(localX / safeWidth, localY / safeHeight);
                }

                pushUndo();
                setShapes((prev) =>
                  prev.map((shape) =>
                    shape.id === target.shape.id
                      ? { ...shape, maskPath: localMaskPath }
                      : shape,
                  ),
                );
                setSelectedId(target.shape.id);
                setSelectedIds([]);
                setActiveTool('mouse');
              }
            }
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
      const getDefaultSize = (type: string) => {
        if (type === 'square' || type === 'round_square' || type === 'circle') {
          return { width: 120, height: 120 };
        }
        if (type === 'semicircle') {
          return { width: 140, height: 80 };
        }
        if (type === 'arrow' || type === 'arrow_fill') {
          return { width: 170, height: 90 };
        }
        return { width: 160, height: 100 };
      };

      const size = getDefaultSize(shapeType);
      pushUndo();
      const newShape: Shape = {
        id: `shape_${shapes.length}`,
        type: shapeType,
        x: 100,
        y: 100,
        width: size.width,
        height: size.height,
        fill: '#EF4444',
      };
      setShapes((prev) => [...prev, newShape]);
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

    const handleDragEnd = (e: any) => {
      const node = e.target;
      const id = node.id?.();
      if (!id) return;
      const nextX = node.x();
      const nextY = node.y();

      setShapes((prev) => {
        let changed = false;
        const next = prev.map((shape) => {
          if (shape.id !== id) return shape;
          changed = true;
          return { ...shape, x: nextX, y: nextY };
        });
        if (changed) pushUndo();
        return next;
      });
    };

    const isTextSelected = selectedId?.startsWith('text_') && !editingTextId;
    const selectedTextObject = isTextSelected
      ? texts.find((t) => t.id === selectedId)
      : undefined;

    useEffect(() => {
      onSelectedTextObjectChange?.(selectedTextObject);
    }, [onSelectedTextObjectChange, selectedTextObject]);

    return (
      <section className="h-full flex-1 min-w-0 bg-[#E2E8F0] relative flex flex-col items-center overflow-auto">
        {/* 브레드크럼 */}
        <div className="flex items-center gap-[6px] text-[13px] mt-[10px]">
          <button
            onClick={() => navigate('/')}
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
        />

        {/* Konva canvas container */}
        <div
          ref={containerRef}
          className="relative w-full h-[600px] mt-[20px] mb-[16px] shrink-0 flex items-center justify-center overflow-hidden rounded-[12px] border border-[#CBD5E1] bg-white"
        >
          {brushPreview.visible && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: brushPreview.x - brushPreview.size / 2,
                top: brushPreview.y - brushPreview.size / 2,
                width: brushPreview.size,
                height: brushPreview.size,
                borderRadius: '50%',
                border: '1.5px solid rgba(21,93,252,0.9)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.8)',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            />
          )}

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
              setSelectedId={handleSelectObject}
              objectRefs={objectRefs}
              trRef={trRef}
              handleTransformEnd={handleTransformEnd}
              handleDragEnd={handleDragEnd}
              editingTextId={editingTextId}
              setEditingTextId={setEditingTextId}
              handleUpdateTextObject={handleUpdateTextObject}
              backgroundImageUrl={null}
              selectionRect={selectionRect}
              lassoPath={lassoPath}
              selectedIds={selectedIds}
            />
          ) : (
            <div className="flex flex-col items-center gap-[8px] text-[#94A3B8] select-none">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span className="text-[14px]">
                사이드바에서 이미지를 업로드해 주세요
              </span>
            </div>
          )}
        </div>

        <Prompt onGenerate={onGenerate} />
      </section>
    );
  },
);

Canvas.displayName = 'Canvas';
