import { useEffect, useRef, useState } from 'react';
import type { DrawLine, Rect, Shape, TextObject } from '@/features/editor/types';

export const useCanvasState = () => {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
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
  };
};
