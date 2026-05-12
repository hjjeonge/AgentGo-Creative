import { useEffect } from 'react';
import type { MutableRefObject } from 'react';

import type { CanvasElement } from '@/features/editor/types';

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

interface UseCanvasKeyboardShortcutsParams {
  activeTool: string;
  editingTextId: string | null;
  penStrokeWidth: number;
  redo: () => void;
  selectedId: string | null;
  selectedIds: string[];
  setBackgroundImageState: (value: string | null) => void;
  setPenStrokeWidth: (value: number) => void;
  setSelectedId: (value: string | null) => void;
  setSelectedIds: (value: string[]) => void;
  showBrushPreview: (size: number) => void;
  undo: () => void;
  updateElements: (updater: (prev: CanvasElement[]) => CanvasElement[]) => void;
  pushUndo: () => void;
  backgroundImageRef: MutableRefObject<string | null>;
}

export const useCanvasKeyboardShortcuts = ({
  activeTool,
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
}: UseCanvasKeyboardShortcutsParams) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;

      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      if (
        (e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
        (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)
      ) {
        e.preventDefault();
        redo();
        return;
      }

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

      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        !editingTextId &&
        activeTool === 'mouse'
      ) {
        const toDelete =
          selectedIds.length > 0 ? selectedIds : selectedId ? [selectedId] : [];

        if (toDelete.length === 0) return;

        pushUndo();
        updateElements((prev) => {
          const next = prev.filter((element) => !toDelete.includes(element.id));
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
  ]);
};
