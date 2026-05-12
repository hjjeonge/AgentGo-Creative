import { useCallback } from 'react';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';

import { loadGoogleFont } from '@/commons/utils/fontLoader';
import type {
  CanvasElement,
  CanvasSnapshot,
  TextObject,
} from '@/features/editor/types';

const DEFAULT_CANVAS_HEIGHT = 600;
const DEFAULT_PLACEHOLDER_TEXT = '텍스트를 입력하세요';
const UPLOADED_IMAGE_SHAPE_PREFIX = 'shape_uploaded_image_';

const getDefaultShapeSize = (shapeType: string) => {
  if (
    shapeType === 'square' ||
    shapeType === 'round_square' ||
    shapeType === 'circle'
  ) {
    return { width: 120, height: 120 };
  }

  if (shapeType === 'semicircle') {
    return { width: 140, height: 80 };
  }

  if (shapeType === 'arrow' || shapeType === 'arrow_fill') {
    return { width: 170, height: 90 };
  }

  return { width: 160, height: 100 };
};

interface UseCanvasEditorActionsParams {
  backgroundImageRef: MutableRefObject<string | null>;
  elementsRef: MutableRefObject<CanvasElement[]>;
  pushUndo: () => void;
  selectedId: string | null;
  selectedIds: string[];
  setActiveTool: (tool: string) => void;
  setBackgroundImageState: (value: string | null) => void;
  setEditingTextId: (value: string | null) => void;
  setElements: Dispatch<SetStateAction<CanvasElement[]>>;
  setIsLassoing: (value: boolean) => void;
  setLassoPath: Dispatch<SetStateAction<number[]>>;
  setPenStrokeColor: (value: string) => void;
  setPenStrokeWidth: (value: number) => void;
  setSelectedId: (value: string | null) => void;
  setSelectedIds: (value: string[]) => void;
  setSelectionRect: (
    value: { x: number; y: number; width: number; height: number } | null,
  ) => void;
  setShapeType: (value: string) => void;
  setStageSize: (value: { width: number; height: number }) => void;
  selectionStartRef: MutableRefObject<{ x: number; y: number } | null>;
  stageSize: { width: number; height: number };
}

export const useCanvasEditorActions = ({
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
}: UseCanvasEditorActionsParams) => {
  const updateElements = useCallback(
    (updater: (prev: CanvasElement[]) => CanvasElement[]) => {
      setElements((prev) => updater(prev));
    },
    [setElements],
  );

  const addUploadedImageShape = useCallback(
    (
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
    },
    [
      setActiveTool,
      setSelectedId,
      setSelectedIds,
      setStageSize,
      stageSize,
      updateElements,
    ],
  );

  const handleAddText = useCallback(() => {
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

    updateElements((prev) => [...prev, { ...newText, kind: 'text' }]);
    setSelectedId(newText.id);
    setActiveTool('mouse');
  }, [pushUndo, setActiveTool, setSelectedId, updateElements]);

  const handleUpdateTextObject = useCallback(
    (id: string, updates: Partial<TextObject>) => {
      updateElements((prev) =>
        prev.map((element) =>
          element.id === id && element.kind === 'text'
            ? { ...element, ...updates }
            : element,
        ),
      );
    },
    [updateElements],
  );

  const removeUneditedPlaceholderTexts = useCallback(
    (candidateIds: string[]) => {
      const targetIds = candidateIds.filter((id) =>
        elementsRef.current.some(
          (element) => element.id === id && element.kind === 'text',
        ),
      );
      if (targetIds.length === 0) return;

      const removableIds = targetIds.filter((id) => {
        const textObject = elementsRef.current.find(
          (element) => element.id === id && element.kind === 'text',
        );

        return (
          !!textObject &&
          textObject.kind === 'text' &&
          textObject.text.trim() === DEFAULT_PLACEHOLDER_TEXT
        );
      });

      if (removableIds.length === 0) return;

      pushUndo();
      updateElements((prev) =>
        prev.filter((element) => !removableIds.includes(element.id)),
      );
    },
    [elementsRef, pushUndo, updateElements],
  );

  const resetSelectionState = useCallback(() => {
    setSelectedId(null);
    setSelectedIds([]);
    setEditingTextId(null);
    selectionStartRef.current = null;
    setSelectionRect(null);
    setLassoPath([]);
    setIsLassoing(false);
  }, [
    selectionStartRef,
    setEditingTextId,
    setIsLassoing,
    setLassoPath,
    setSelectedId,
    setSelectedIds,
    setSelectionRect,
  ]);

  const handleToolChange = useCallback(
    (tool: string) => {
      if (tool === 'text') {
        handleAddText();
        return;
      }

      removeUneditedPlaceholderTexts([
        ...(selectedId ? [selectedId] : []),
        ...selectedIds,
      ]);

      setActiveTool(tool);
      resetSelectionState();
    },
    [
      handleAddText,
      removeUneditedPlaceholderTexts,
      resetSelectionState,
      selectedId,
      selectedIds,
      setActiveTool,
    ],
  );

  const handleAddShape = useCallback(
    (nextShapeType: string) => {
      setShapeType(nextShapeType);
      const size = getDefaultShapeSize(nextShapeType);

      pushUndo();
      updateElements((prev) => [
        ...prev,
        {
          id: `shape_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          kind: 'shape',
          shapeType: nextShapeType,
          x: 100,
          y: 100,
          width: size.width,
          height: size.height,
          fill: '#EF4444',
        },
      ]);
    },
    [pushUndo, setShapeType, updateElements],
  );

  const setBackgroundImage = useCallback(
    (url: string | null) => {
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
        return;
      }

      backgroundImageRef.current = null;
      setBackgroundImageState(null);
      updateElements((prev) =>
        prev.filter((element) => element.kind !== 'image'),
      );
    },
    [
      addUploadedImageShape,
      backgroundImageRef,
      elementsRef,
      pushUndo,
      setBackgroundImageState,
      updateElements,
    ],
  );

  const restoreSnapshot = useCallback(
    (snapshot: CanvasSnapshot) => {
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
    [
      addUploadedImageShape,
      setBackgroundImageState,
      setEditingTextId,
      setElements,
      setSelectedId,
      setSelectedIds,
    ],
  );

  const clearCanvas = useCallback(() => {
    setElements([]);
    setBackgroundImageState(null);
    setStageSize({ width: 0, height: 0 });
    setSelectedId(null);
    setSelectedIds([]);
    setEditingTextId(null);
  }, [
    setBackgroundImageState,
    setEditingTextId,
    setElements,
    setSelectedId,
    setSelectedIds,
    setStageSize,
  ]);

  return {
    addUploadedImageShape,
    clearCanvas,
    handleAddShape,
    handleAddText,
    handleToolChange,
    handleUpdateTextObject,
    resetSelectionState,
    restoreSnapshot,
    setBackgroundImage,
    setPenStrokeColor,
    setPenStrokeWidth,
    updateElements,
  };
};
