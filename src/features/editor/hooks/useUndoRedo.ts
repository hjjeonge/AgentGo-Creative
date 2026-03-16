import { useRef } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { CanvasElement, HistoryState } from '@/features/editor/types';

interface Params {
  elementsRef: RefObject<CanvasElement[]>;
  backgroundImageRef: RefObject<string | null>;
  setElements: Dispatch<SetStateAction<CanvasElement[]>>;
  setBackgroundImageState: Dispatch<SetStateAction<string | null>>;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  setEditingTextId: Dispatch<SetStateAction<string | null>>;
}

export const useUndoRedo = ({
  elementsRef,
  backgroundImageRef,
  setElements,
  setBackgroundImageState,
  setSelectedId,
  setSelectedIds,
  setEditingTextId,
}: Params) => {
  const undoStack = useRef<HistoryState[]>([]);
  const redoStack = useRef<HistoryState[]>([]);

  const createHistoryState = (): HistoryState => {
    return {
      backgroundImage: backgroundImageRef.current,
      elements: elementsRef.current,
    };
  };

  const pushUndo = () => {
    undoStack.current.push(createHistoryState());
    redoStack.current = [];
  };

  const applyHistory = (state: HistoryState) => {
    setElements(state.elements);
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
