import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { CanvasHeader } from '@/features/editor/components/CanvasHeader';
import { CanvasLayout } from '@/features/editor/components/CanvasLayout';
import { CanvasStageSection } from '@/features/editor/components/CanvasStageSection';
import { useCanvasEditorActions } from '@/features/editor/hooks/useCanvasEditorActions';
import { useCanvasKeyboardShortcuts } from '@/features/editor/hooks/useCanvasKeyboardShortcuts';
import { useCanvasState } from '@/features/editor/hooks/useCanvasState';
import { useCrop } from '@/features/editor/hooks/useCrop';
import { useDrawing } from '@/features/editor/hooks/useDrawing';
import { useSelection } from '@/features/editor/hooks/useSelection';
import { useUndoRedo } from '@/features/editor/hooks/useUndoRedo';
import type {
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
  onUploadImage?: (url: string) => void;
  onChangeImage?: (url: string) => void;
  breadcrumbLabel?: string | null;
  breadcrumbPath?: string | null;
  backPath?: string;
  onSelectedTextObjectChange?: (textObject?: TextObject) => void;
  isGenerating?: boolean;
}

export const Canvas = forwardRef<CanvasHandle, Props>(
  (
    {
      onGenerate,
      onUploadImage,
      onChangeImage,
      breadcrumbLabel,
      breadcrumbPath,
      backPath,
      onSelectedTextObjectChange,
      isGenerating = false,
    },
    ref,
  ) => {
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

    const {
      clearCanvas,
      handleAddShape,
      handleAddText,
      handleToolChange,
      handleUpdateTextObject,
      replaceBackgroundImage,
      restoreSnapshot,
      setBackgroundImage,
      setPenStrokeColor: handlePenStrokeColor,
      setPenStrokeWidth: handlePenStrokeWidth,
      updateElements,
    } = useCanvasEditorActions({
      backgroundImageRef,
      elementsRef,
      pushUndo,
      selectedId,
      selectedIds,
      selectionStartRef,
      setActiveTool,
      setBackgroundImageState,
      setEditingTextId,
      setElements,
      setIsLassoing,
      setLassoPath,
      setPenStrokeColor,
      setPenStrokeWidth,
      setSelectedId,
      setSelectedIds,
      setSelectionRect,
      setShapeType,
      setStageSize,
      stageSize,
    });

    useCanvasKeyboardShortcuts({
      activeTool,
      isDisabled: isGenerating,
      backgroundImageRef,
      editingTextId,
      penStrokeWidth,
      pushUndo,
      redo,
      selectedId,
      selectedIds,
      setBackgroundImageState,
      setPenStrokeWidth,
      setSelectedId,
      setSelectedIds,
      showBrushPreview,
      undo,
      updateElements,
    });

    useImperativeHandle(ref, () => ({
      setBackgroundImage,
      replaceBackgroundImage,
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
      restoreSnapshot,
      hasImage: () =>
        backgroundImageRef.current !== null ||
        elementsRef.current.some((element) => element.kind === 'image'),
      addText: () => {
        handleAddText();
      },
      updateTextObject: (id: string, updates: Partial<TextObject>) => {
        handleUpdateTextObject(id, updates);
      },
      clearCanvas,
    }));

    useEffect(() => {
      if (baseImageElement?.kind !== 'image') return;

      setStageSize({
        width: Math.max(1, Math.round(baseImageElement.width)),
        height: Math.max(1, Math.round(baseImageElement.height)),
      });
    }, [baseImageElement, setStageSize]);

    const handleMouseDown = (e: any) => {
      if (isGenerating) return;

      if (activeTool === 'crop') {
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
      if (isGenerating) return;

      if (activeTool === 'crop') {
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
      if (isGenerating) return;

      if (activeTool === 'crop') {
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
      <CanvasLayout
        header={
          <CanvasHeader
            breadcrumbLabel={breadcrumbLabel}
            breadcrumbPath={breadcrumbPath}
            backPath={backPath}
          />
        }
        stage={
          <CanvasStageSection
            brushPreview={brushPreview}
            hasBaseImage={hasBaseImage}
            isGenerating={isGenerating}
            onUploadImage={onUploadImage}
            stageContainerRef={stageContainerRef}
            stageSize={stageSize}
            toolbar={
              <Toolbar
                activeTool={activeTool}
                onToolChange={handleToolChange}
                onUploadImage={onUploadImage}
                onChangeImage={onChangeImage}
                selectedTextObject={selectedTextObject}
                handleUpdateTextObject={handleUpdateTextObject}
                penStrokeWidth={penStrokeWidth}
                handlePenStrokeWidth={handlePenStrokeWidth}
                penStrokeColor={penStrokeColor}
                handlePenStrokeColor={handlePenStrokeColor}
                shapeType={shapeType}
                setShapeType={handleAddShape}
                shapeSelectMode={shapeSelectMode}
                setShapeSelectMode={setShapeSelectMode}
              />
            }
          >
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
          </CanvasStageSection>
        }
        prompt={<Prompt onGenerate={onGenerate} isSubmitting={isGenerating} />}
      />
    );
  },
);

Canvas.displayName = 'Canvas';
