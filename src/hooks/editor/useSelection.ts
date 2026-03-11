import { useEffect } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { Shape, TextObject } from '../../types/editor';

interface Params {
  selectedId: string | null;
  selectedIds: string[];
  editingTextId: string | null;
  shapes: Shape[];
  texts: TextObject[];
  objectRefs: RefObject<Record<string, any>>;
  trRef: RefObject<any>;
  pushUndo: () => void;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  setEditingTextId: Dispatch<SetStateAction<string | null>>;
  setActiveTool: Dispatch<SetStateAction<string>>;
  setShapes: Dispatch<SetStateAction<Shape[]>>;
  setTexts: Dispatch<SetStateAction<TextObject[]>>;
}

export const useSelection = ({
  selectedId,
  selectedIds,
  editingTextId,
  shapes,
  texts,
  objectRefs,
  trRef,
  pushUndo,
  setSelectedId,
  setSelectedIds,
  setEditingTextId,
  setActiveTool,
  setShapes,
  setTexts,
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
  }, [
    editingTextId,
    objectRefs,
    selectedId,
    selectedIds,
    shapes,
    texts,
    trRef,
  ]);

  const handleTransformEnd = (e: any) => {
    pushUndo();
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const id = node.id();

    node.scaleX(1);
    node.scaleY(1);

    setTexts((prev) =>
      prev.map((text) => {
        if (text.id !== id) return text;
        const baseScaleX = text.scaleX ?? 1;
        const effectiveScaleX = scaleX / baseScaleX;
        return {
          ...text,
          x: node.x(),
          y: node.y(),
          width: Math.max(5, (text.width ?? node.width()) * effectiveScaleX),
          fontSize: Math.max(5, text.fontSize * scaleY),
        };
      }),
    );

    setShapes((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, s.width * scaleX),
              height: Math.max(5, s.height * scaleY),
            }
          : s,
      ),
    );
  };

  const handleDragEnd = (e: any) => {
    const node = e.target;
    const id = node.id?.();
    if (!id) return;
    const nextX = node.x();
    const nextY = node.y();

    setShapes((prev) => {
      let changed = false;
      const next = prev.map((shape) => {
        if (shape.id !== id) return shape;
        changed = true;
        return { ...shape, x: nextX, y: nextY };
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
