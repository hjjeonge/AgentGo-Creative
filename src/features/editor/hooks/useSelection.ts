import { useEffect } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { CanvasElement } from '@/features/editor/types';

interface Params {
  selectedId: string | null;
  selectedIds: string[];
  editingTextId: string | null;
  elements: CanvasElement[];
  objectRefs: RefObject<Record<string, any>>;
  trRef: RefObject<any>;
  pushUndo: () => void;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  setEditingTextId: Dispatch<SetStateAction<string | null>>;
  setActiveTool: Dispatch<SetStateAction<string>>;
  setElements: Dispatch<SetStateAction<CanvasElement[]>>;
}

export const useSelection = ({
  selectedId,
  selectedIds,
  editingTextId,
  elements,
  objectRefs,
  trRef,
  pushUndo,
  setSelectedId,
  setSelectedIds,
  setEditingTextId,
  setActiveTool,
  setElements,
}: Params) => {
  const selectSingleId = (id: string | null) => {
    setSelectedId(id);
    setSelectedIds([]);
  };

  const handleSelectObject = (id: string | null) => {
    selectSingleId(id);
    setEditingTextId(null);
    setActiveTool('mouse');
  };

  useEffect(() => {
    if (trRef.current) {
      if (!editingTextId) {
        if (selectedIds.length > 1) {
          const nodes = selectedIds
            .map((id) => objectRefs.current[id])
            .filter(Boolean);
          trRef.current.nodes(nodes);
        } else if (selectedId) {
          const node = objectRefs.current[selectedId];
          if (node) trRef.current.nodes([node]);
        } else {
          trRef.current.nodes([]);
        }
      } else {
        trRef.current.nodes([]);
      }
      trRef.current.getLayer()?.batchDraw();
    }
  }, [editingTextId, elements, objectRefs, selectedId, selectedIds, trRef]);

  const handleTransformEnd = (e: any) => {
    pushUndo();
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation?.() ?? 0;
    const id = node.id();

    node.scaleX(1);
    node.scaleY(1);

    setElements((prev) =>
      prev.map((element) => {
        if (element.id !== id) return element;

        if (element.kind === 'text') {
          const baseScaleX = element.scaleX ?? 1;
          const effectiveScaleX = scaleX / baseScaleX;
          return {
            ...element,
            x: node.x(),
            y: node.y(),
            rotation,
            width: Math.max(5, (element.width ?? node.width()) * effectiveScaleX),
            fontSize: Math.max(5, element.fontSize * scaleY),
          };
        }

        if (element.kind === 'shape' || element.kind === 'image') {
          return {
            ...element,
            x: node.x(),
            y: node.y(),
            rotation,
            width: Math.max(5, element.width * scaleX),
            height: Math.max(5, element.height * scaleY),
          };
        }

        return element;
      }),
    );
  };

  const handleDragEnd = (e: any) => {
    const node = e.target;
    const id = node.id?.();
    if (!id) return;
    const nextX = node.x();
    const nextY = node.y();

    setElements((prev) => {
      let changed = false;
      const next = prev.map((element) => {
        if (element.id !== id) return element;
        if (
          element.kind !== 'shape' &&
          element.kind !== 'image' &&
          element.kind !== 'text'
        ) {
          return element;
        }
        changed = true;
        return { ...element, x: nextX, y: nextY };
      });
      if (changed) pushUndo();
      return next;
    });
  };

  return {
    selectSingleId,
    handleSelectObject,
    handleTransformEnd,
    handleDragEnd,
  };
};
