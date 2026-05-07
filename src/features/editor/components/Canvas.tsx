import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { loadGoogleFont } from '@/commons/utils/fontLoader';
import { useCanvasState } from '@/features/editor/hooks/useCanvasState';
import { useCrop } from '@/features/editor/hooks/useCrop';
import { useDrawing } from '@/features/editor/hooks/useDrawing';
import { useSelection } from '@/features/editor/hooks/useSelection';
import { useUndoRedo } from '@/features/editor/hooks/useUndoRedo';
import type {
  CanvasElement,
  CanvasHandle,
  CanvasSnapshot,
  PromptGeneratePayload,
  TextObject,
} from '@/features/editor/types';

import { EditorCanvas } from './EditorCanvas';
import { Prompt } from './Prompt';
import { Toolbar } from './Toolbar';

interface Props {
  onGenerate?: (payload: PromptGeneratePayload) => Promise<void>;
  breadcrumbLabel?: string | null;
  breadcrumbPath?: string | null;
  onSelectedTextObjectChange?: (textObject?: TextObject) => void;
  isGenerating?: boolean;
}

const DEFAULT_PLACEHOLDER_TEXT = '텍스트를 입력하세요';
const UPLOADED_IMAGE_SHAPE_PREFIX = 'shape_uploaded_image_';
const DEFAULT_CANVAS_HEIGHT = 600;

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return (
    target.isContentEditable ||
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select'
  );
};

export const Canvas = forwardRef<CanvasHandle, Props>(
  (
    {
      onGenerate,
      breadcrumbLabel,
      breadcrumbPath,
      onSelectedTextObjectChange,
      isGenerating = false,
    },
    ref,
  ) => {
    const navigate = useNavigate();
    const [activeTool, setActiveTool] = useState<string>('mouse');
    const stageContainerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<any>(null);
    const {
      stageSize,
      setStageSize,
      backgroundImage,
      setBackgroundImageState,
      elements,
      setElements,
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
      elementsRef,
      backgroundImageRef,
      lastPointerRef,
      previewTimeoutRef,
      selectionStartRef,
      objectRefs,
      trRef,
    } = useCanvasState();

    const handleStageReady = useCallback((stage: any | null) => {
      stageRef.current = stage;
    }, []);

    const baseImageElement = useMemo(
      () => elements.find((element) => element.kind === 'image') ?? null,
      [elements],
    );
    const hasBaseImage =
      backgroundImage !== null ||
      elements.some((element) => element.kind === 'image');

    useEffect(() => {
      const container = stageContainerRef.current;
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
    }, [hasBaseImage, stageSize.height, stageSize.width]);

    const { pushUndo, undo, redo } = useUndoRedo({
      elementsRef,
      backgroundImageRef,
      setElements,
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
        elements,
        baseImageId: baseImageElement?.id ?? null,
        objectRefs,
        trRef,
        pushUndo,
        setSelectedId,
        setSelectedIds,
        setEditingTextId,
        setActiveTool,
        setElements,
        setStageSize,
      });

    const { cropByRect, cropByLasso } = useCrop({
      elementsRef,
      selectedId,
      setElements,
      setSelectedId,
      setSelectedIds,
      setActiveTool,
      pushUndo,
    });

    const updateElements = useCallback(
      (updater: (prev: CanvasElement[]) => CanvasElement[]) => {
        setElements((prev) => updater(prev));
      },
      [setElements],
    );

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
      setElements,
      setBrushPreview,
      lastPointerRef,
      previewTimeoutRef,
      pushUndo,
    });

    // Delete / Undo / Redo 핸들러
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isEditableTarget(e.target)) {
          return;
        }

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
        if (
          (e.key === 'Delete' || e.key === 'Backspace') &&
          !editingTextId &&
          activeTool === 'mouse'
        ) {
          const toDelete =
            selectedIds.length > 0
              ? selectedIds
              : selectedId
                ? [selectedId]
                : [];
          if (toDelete.length === 0) return;
          pushUndo();
          updateElements((prev) => {
            const next = prev.filter(
              (element) => !toDelete.includes(element.id),
            );
            const hasUploadedImage = next.some(
              (element) => element.kind === 'image',
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
    }, [
      activeTool,
      editingTextId,
      penStrokeWidth,
      redo,
      selectedId,
      selectedIds,
      showBrushPreview,
      undo,
      updateElements,
    ]);

    const addUploadedImageShape = (
      url: string,
      options?: { replaceExisting?: boolean; selectImage?: boolean },
    ) => {
      const { replaceExisting = true, selectImage = true } = options ?? {};
      const image = new window.Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        const naturalWidth = Math.max(1, image.naturalWidth || image.width);
        const naturalHeight = Math.max(1, image.naturalHeight || image.height);
        const currentStageWidth =
          stageSize.width > 0
            ? stageSize.width
            : Math.max(
                1,
                Math.round(
                  (naturalWidth * DEFAULT_CANVAS_HEIGHT) / naturalHeight,
                ),
              );
        const currentStageHeight =
          stageSize.height > 0 ? stageSize.height : DEFAULT_CANVAS_HEIGHT;
        const ratio = replaceExisting
          ? DEFAULT_CANVAS_HEIGHT / naturalHeight
          : Math.min(
              currentStageWidth / naturalWidth,
              currentStageHeight / naturalHeight,
              1,
            );
        const targetWidth = Math.max(1, Math.round(naturalWidth * ratio));
        const targetHeight = Math.max(1, Math.round(naturalHeight * ratio));
        const imageShapeId = `${UPLOADED_IMAGE_SHAPE_PREFIX}${Date.now()}_${Math.floor(Math.random() * 10000)}`;

        if (replaceExisting) {
          setStageSize({
            width: targetWidth,
            height: targetHeight,
          });
        }

        updateElements((prev) => {
          const base = replaceExisting
            ? prev.filter((element) => element.kind !== 'image')
            : prev;
          const nextStageWidth = replaceExisting
            ? targetWidth
            : currentStageWidth;
          const nextStageHeight = replaceExisting
            ? targetHeight
            : currentStageHeight;
          return [
            ...base,
            {
              id: imageShapeId,
              kind: 'image',
              x: replaceExisting
                ? 0
                : Math.max(0, Math.round((nextStageWidth - targetWidth) / 2)),
              y: replaceExisting
                ? 0
                : Math.max(0, Math.round((nextStageHeight - targetHeight) / 2)),
              width: targetWidth,
              height: targetHeight,
              imageUrl: url,
              sourceWidth: naturalWidth,
              sourceHeight: naturalHeight,
              cropX: 0,
              cropY: 0,
              cropWidth: naturalWidth,
              cropHeight: naturalHeight,
            },
          ];
        });
        if (selectImage) {
          setSelectedId(imageShapeId);
          setSelectedIds([]);
          setActiveTool('mouse');
        }
      };
      image.src = url;
    };

    const handleAddText = () => {
      pushUndo();
      const defaultFont = 'Pretendard';
      loadGoogleFont(defaultFont);

      const newText: TextObject = {
        id: `text_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
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
      updateElements((prev) => [
        ...prev,
        {
          ...newText,
          kind: 'text',
        },
      ]);
      setSelectedId(newText.id);
      setActiveTool('mouse');
    };

    const handleUpdateTextObject = (
      id: string,
      updates: Partial<TextObject>,
    ) => {
      updateElements((prev) =>
        prev.map((element) =>
          element.id === id && element.kind === 'text'
            ? { ...element, ...updates }
            : element,
        ),
      );
    };

    useImperativeHandle(ref, () => ({
      setBackgroundImage: (url: string | null) => {
        pushUndo();
        if (url) {
          const existingBaseImage = elementsRef.current.find(
            (element) => element.kind === 'image',
          );
          if (!existingBaseImage || existingBaseImage.kind !== 'image') {
            backgroundImageRef.current = url;
            setBackgroundImageState(url);
          }
          addUploadedImageShape(url, {
            replaceExisting: !existingBaseImage,
            selectImage: true,
          });
        } else {
          backgroundImageRef.current = null;
          setBackgroundImageState(null);
          updateElements((prev) =>
            prev.filter((element) => element.kind !== 'image'),
          );
        }
      },
      getSnapshot: (): CanvasSnapshot => ({
        backgroundImage: backgroundImageRef.current,
        elements: elementsRef.current,
      }),
      exportAsBlob: async (): Promise<Blob | null> => {
        const stage = stageRef.current;
        if (!stage) return null;

        const dataUrl = stage.toDataURL({ pixelRatio: 1 });
        const res = await fetch(dataUrl);
        return res.blob();
      },
      restoreSnapshot: (snapshot: CanvasSnapshot) => {
        const uploadedImage = snapshot.elements.find(
          (element) => element.kind === 'image',
        );
        const nextBackgroundImage =
          snapshot.backgroundImage ||
          (uploadedImage?.kind === 'image' ? uploadedImage.imageUrl : null) ||
          null;

        setElements(snapshot.elements);
        setBackgroundImageState(nextBackgroundImage);
        if (!uploadedImage && nextBackgroundImage) {
          addUploadedImageShape(nextBackgroundImage, {
            replaceExisting: false,
            selectImage: false,
          });
        }
        setSelectedId(null);
        setSelectedIds([]);
        setEditingTextId(null);
      },
      hasImage: () =>
        backgroundImageRef.current !== null ||
        elementsRef.current.some((element) => element.kind === 'image'),
      addText: () => {
        handleAddText();
      },
      updateTextObject: (id: string, updates: Partial<TextObject>) => {
        handleUpdateTextObject(id, updates);
      },
      clearCanvas: () => {
        setElements([]);
        setBackgroundImageState(null);
        setStageSize({ width: 0, height: 0 });
        setSelectedId(null);
        setSelectedIds([]);
        setEditingTextId(null);
      },
    }));

    const removeUneditedPlaceholderTexts = (candidateIds: string[]) => {
      const targetIds = candidateIds.filter((id) =>
        elementsRef.current.some(
          (element) => element.id === id && element.kind === 'text',
        ),
      );
      if (targetIds.length === 0) return;

      const removableIds = targetIds.filter((id) => {
        const textObj = elementsRef.current.find(
          (element) => element.id === id && element.kind === 'text',
        );
        return (
          !!textObj &&
          textObj.kind === 'text' &&
          textObj.text.trim() === DEFAULT_PLACEHOLDER_TEXT
        );
      });

      if (removableIds.length === 0) return;

      pushUndo();
      updateElements((prev) =>
        prev.filter((element) => !removableIds.includes(element.id)),
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

    const handlePenStrokeWidth = (value: number) => {
      setPenStrokeWidth(value);
    };
    const handlePenStrokeColor = (value: string) => {
      setPenStrokeColor(value);
    };

    useEffect(() => {
      if (baseImageElement?.kind !== 'image') return;

      setStageSize({
        width: Math.max(1, Math.round(baseImageElement.width)),
        height: Math.max(1, Math.round(baseImageElement.height)),
      });
    }, [baseImageElement, setStageSize]);

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
      const newShape = {
        id: `shape_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        kind: 'shape' as const,
        shapeType,
        x: 100,
        y: 100,
        width: size.width,
        height: size.height,
        fill: '#EF4444',
      };
      updateElements((prev) => [...prev, newShape]);
    };

    const isTextSelected =
      !!selectedId &&
      !editingTextId &&
      elements.some(
        (element) => element.id === selectedId && element.kind === 'text',
      );
    const selectedTextObject = isTextSelected
      ? (() => {
          const selectedElement = elements.find(
            (element) => element.id === selectedId && element.kind === 'text',
          );
          return selectedElement?.kind === 'text' ? selectedElement : undefined;
        })()
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
        <div className="relative w-full h-[600px] mt-[20px] mb-[16px] shrink-0 flex items-center justify-center">
          {stageSize.width > 0 && stageSize.height > 0 && hasBaseImage ? (
            <div
              ref={stageContainerRef}
              className="relative shrink-0 m-[20px]"
              style={{
                width: `${stageSize.width}px`,
                height: `${stageSize.height}px`,
              }}
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
              <EditorCanvas
                stageSize={stageSize}
                activeTool={activeTool}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseUp={handleMouseUp}
                elements={elements}
                baseImageId={baseImageElement?.id ?? null}
                selectedId={selectedId}
                currentLine={currentLine}
                setSelectedId={handleSelectObject}
                objectRefs={objectRefs}
                trRef={trRef}
                handleTransformEnd={handleTransformEnd}
                handleDragEnd={handleDragEnd}
                editingTextId={editingTextId}
                setEditingTextId={setEditingTextId}
                handleUpdateTextObject={handleUpdateTextObject}
                selectionRect={selectionRect}
                lassoPath={lassoPath}
                selectedIds={selectedIds}
                onStageReady={handleStageReady}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-[20px] mb-[20px] gap-[8px] text-[#94A3B8] select-none rounded-[12px] border border-[#CBD5E1] bg-white h-[600px] w-[500px]">
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
                이미지를 업로드하거나 템플릿에서 생성해 주세요
              </span>
            </div>
          )}
        </div>

        <Prompt onGenerate={onGenerate} isSubmitting={isGenerating} />
      </section>
    );
  },
);

Canvas.displayName = 'Canvas';
