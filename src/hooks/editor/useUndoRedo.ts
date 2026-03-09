import { useRef } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type {
  DrawLine,
  HistoryState,
  Shape,
  TextObject,
} from '../../types/editor';

interface Params {
  linesRef: RefObject<DrawLine[]>;
  shapesRef: RefObject<Shape[]>;
  textsRef: RefObject<TextObject[]>;
  backgroundImageRef: RefObject<string | null>;
  setLines: Dispatch<SetStateAction<DrawLine[]>>;
  setShapes: Dispatch<SetStateAction<Shape[]>>;
  setTexts: Dispatch<SetStateAction<TextObject[]>>;
  setBackgroundImageState: Dispatch<SetStateAction<string | null>>;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  setEditingTextId: Dispatch<SetStateAction<string | null>>;
}

export const useUndoRedo = ({
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
}: Params) => {
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

  const undo = () => {
    const prev = undoStack.current.pop();
    if (!prev) return;
    redoStack.current.push({
      lines: linesRef.current,
      shapes: shapesRef.current,
      texts: textsRef.current,
      backgroundImage: backgroundImageRef.current,
    });
    applyHistory(prev);
  };

  const redo = () => {
    const next = redoStack.current.pop();
    if (!next) return;
    undoStack.current.push({
      lines: linesRef.current,
      shapes: shapesRef.current,
      texts: textsRef.current,
      backgroundImage: backgroundImageRef.current,
    });
    applyHistory(next);
  };

  return {
    pushUndo,
    undo,
    redo,
    applyHistory,
  };
};
