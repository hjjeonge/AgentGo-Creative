import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  partitionCanvasElements,
  toCanvasElements,
} from '@/features/editor/utils/elementAdapters';
import type {
  CanvasElement,
  DrawLine,
  Rect,
  Shape,
  TextObject,
} from '@/features/editor/types';

export const useCanvasState = () => {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [backgroundImage, setBackgroundImageState] = useState<string | null>(
    null,
  );
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [currentLine, setCurrentLine] = useState<DrawLine | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeType, setShapeType] = useState('square');
  const [penStrokeWidth, setPenStrokeWidth] = useState(2);
  const [penStrokeColor, setPenStrokeColor] = useState('#E7000B');
  const [brushPreview, setBrushPreview] = useState({
    x: 0,
    y: 0,
    size: 2,
    visible: false,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [selectionRect, setSelectionRect] = useState<Rect | null>(null);
  const [shapeSelectMode, setShapeSelectMode] = useState<'rect' | 'lasso'>(
    'rect',
  );
  const [lassoPath, setLassoPath] = useState<number[]>([]);
  const [isLassoing, setIsLassoing] = useState(false);

  const { lines, shapes, texts } = useMemo(
    () => partitionCanvasElements(elements),
    [elements],
  );

  const updateLegacyCollection = useCallback(
    <T,>(
      key: 'lines' | 'shapes' | 'texts',
      updater: SetStateAction<T[]>,
    ) => {
      setElements((prev) => {
        const collections = partitionCanvasElements(prev);
        const current = collections[key] as T[];
        const next =
          typeof updater === 'function'
            ? (updater as (prevState: T[]) => T[])(current)
            : updater;

        return toCanvasElements({
          lines:
            key === 'lines'
              ? (next as DrawLine[])
              : collections.lines,
          shapes:
            key === 'shapes'
              ? (next as Shape[])
              : collections.shapes,
          texts:
            key === 'texts'
              ? (next as TextObject[])
              : collections.texts,
        });
      });
    },
    [],
  );

  const setLines: Dispatch<SetStateAction<DrawLine[]>> = useCallback(
    (updater) => updateLegacyCollection('lines', updater),
    [updateLegacyCollection],
  );
  const setShapes: Dispatch<SetStateAction<Shape[]>> = useCallback(
    (updater) => updateLegacyCollection('shapes', updater),
    [updateLegacyCollection],
  );
  const setTexts: Dispatch<SetStateAction<TextObject[]>> = useCallback(
    (updater) => updateLegacyCollection('texts', updater),
    [updateLegacyCollection],
  );

  const elementsRef = useRef(elements);
  const linesRef = useRef(lines);
  const shapesRef = useRef(shapes);
  const textsRef = useRef(texts);
  const backgroundImageRef = useRef(backgroundImage);

  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const previewTimeoutRef = useRef<number | null>(null);
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null);
  const objectRefs = useRef<Record<string, any>>({});
  const trRef = useRef<any>(null);

  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);
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

  return {
    stageSize,
    setStageSize,
    backgroundImage,
    setBackgroundImageState,
    elements,
    setElements,
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
    elementsRef,
    linesRef,
    shapesRef,
    textsRef,
    backgroundImageRef,
    lastPointerRef,
    previewTimeoutRef,
    selectionStartRef,
    objectRefs,
    trRef,
  };
};
