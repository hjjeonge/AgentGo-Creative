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
import { useCanvasState } from '../../hooks/editor/useCanvasState';
import { useCrop } from '../../hooks/editor/useCrop';
import { useDrawing } from '../../hooks/editor/useDrawing';
import { useSelection } from '../../hooks/editor/useSelection';
import { useUndoRedo } from '../../hooks/editor/useUndoRedo';
import type {
  CanvasHandle,
  CanvasSnapshot,
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
    const {
      stageSize,
      setStageSize,
      setBackgroundImageState,
      lines,
      setLines,
      shapes,
      setShapes,
      texts,
      setTexts,
      currentLine,
      setCurrentLine,
      isDrawing,
      setIsDrawing,
      shapeType,
      setShapeType,
      penStrokeWidth,
      setPenStrokeWidth,
      penStrokeColor,
      setPenStrokeColor,
      brushPreview,
      setBrushPreview,
      selectedId,
      setSelectedId,
      selectedIds,
      setSelectedIds,
      editingTextId,
      setEditingTextId,
      selectionRect,
      setSelectionRect,
      shapeSelectMode,
      setShapeSelectMode,
      lassoPath,
      setLassoPath,
      isLassoing,
      setIsLassoing,
      linesRef,
      shapesRef,
      textsRef,
      backgroundImageRef,
      lastPointerRef,
      previewTimeoutRef,
      selectionStartRef,
      objectRefs,
      trRef,
    } = useCanvasState();

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

    const { pushUndo, undo, redo } = useUndoRedo({
      linesRef,
      shapesRef,
      textsRef,
      backgroundImageRef,
      setLines,
      setShapes,
      setTexts,
      setBackgroundImageState,
      setSelectedId,
      setSelectedIds,
      setEditingTextId,
    });

    const { handleSelectObject, handleTransformEnd, handleDragEnd } =
      useSelection({
        selectedId,
        selectedIds,
        editingTextId,
        shapes,
        texts,
        objectRefs,
        trRef,
        pushUndo,
        setSelectedId,
        setSelectedIds,
        setEditingTextId,
        setActiveTool,
        setShapes,
        setTexts,
      });

    const { cropByRect, cropByLasso } = useCrop({
      shapesRef,
      selectedId,
      setShapes,
      setSelectedId,
      setSelectedIds,
      setActiveTool,
      pushUndo,
    });

    const {
      showBrushPreview,
      handleMouseDownDrawing,
      handleMouseMoveDrawing,
      handleMouseUpDrawing,
    } = useDrawing({
      activeTool,
      isDrawing,
      currentLine,
      penStrokeWidth,
      penStrokeColor,
      setIsDrawing,
      setCurrentLine,
      setLines,
      setBrushPreview,
      lastPointerRef,
      previewTimeoutRef,
      pushUndo,
    });

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

    // Delete / Undo / Redo 핸들러
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl+Z: Undo
        if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
          e.preventDefault();
          undo();
          return;
        }
        // Ctrl+Y or Ctrl+Shift+Z: Redo
        if (
          (e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
          (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)
        ) {
          e.preventDefault();
          redo();
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

      handleMouseDownDrawing(e);
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

      handleMouseMoveDrawing(e);
    };

    const handleMouseUp = (e: any) => {
      if (activeTool === 'shape') {
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
          cropByLasso(lassoPath);
          setLassoPath([]);
          return;
        }
      }

      handleMouseUpDrawing();
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
