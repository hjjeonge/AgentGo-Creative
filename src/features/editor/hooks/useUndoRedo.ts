import { useRef } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type {
  CanvasElement,
  DrawLine,
  HistoryState,
  Shape,
  TextObject,
} from '@/features/editor/types';

interface Params {
  elementsRef: RefObject<CanvasElement[]>;
  linesRef: RefObject<DrawLine[]>;
  shapesRef: RefObject<Shape[]>;
  textsRef: RefObject<TextObject[]>;
  backgroundImageRef: RefObject<string | null>;
  setElements: Dispatch<SetStateAction<CanvasElement[]>>;
  setLines: Dispatch<SetStateAction<DrawLine[]>>;
  setShapes: Dispatch<SetStateAction<Shape[]>>;
  setTexts: Dispatch<SetStateAction<TextObject[]>>;
  setBackgroundImageState: Dispatch<SetStateAction<string | null>>;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  setEditingTextId: Dispatch<SetStateAction<string | null>>;
}

export const useUndoRedo = ({
  elementsRef,
  linesRef,
  shapesRef,
  textsRef,
  backgroundImageRef,
  setElements,
  setLines,
  setShapes,
  setTexts,
  setBackgroundImageState,
  setSelectedId,
  setSelectedIds,
  setEditingTextId,
}: Params) => {
  const undoStack = useRef<HistoryState[]>([]);
  const redoStack = useRef<HistoryState[]>([]);

  const createHistoryState = (): HistoryState => ({
    lines: linesRef.current,
    shapes: shapesRef.current,
    texts: textsRef.current,
    backgroundImage: backgroundImageRef.current,
    elements: elementsRef.current,
  });

  const pushUndo = () => {
    undoStack.current.push(createHistoryState());
    redoStack.current = [];
  };

  const applyHistory = (state: HistoryState) => {
    if (state.elements) {
      setElements(state.elements);
    } else {
      setLines(state.lines);
      setShapes(state.shapes);
      setTexts(state.texts);
    }
    setBackgroundImageState(state.backgroundImage);
    setSelectedId(null);
    setSelectedIds([]);
    setEditingTextId(null);
  };

  const undo = () => {
    const prev = undoStack.current.pop();
    if (!prev) return;
    redoStack.current.push(createHistoryState());
    applyHistory(prev);
  };

  const redo = () => {
    const next = redoStack.current.pop();
    if (!next) return;
    undoStack.current.push(createHistoryState());
    applyHistory(next);
  };

  return {
    pushUndo,
    undo,
    redo,
    applyHistory,
  };
};
