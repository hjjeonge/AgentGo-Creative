import { useEffect } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { CanvasElement, DrawLine } from '@/features/editor/types';

interface Params {
  activeTool: string;
  isDrawing: boolean;
  currentLine: DrawLine | null;
  penStrokeWidth: number;
  penStrokeColor: string;
  setIsDrawing: Dispatch<SetStateAction<boolean>>;
  setCurrentLine: Dispatch<SetStateAction<DrawLine | null>>;
  setElements: Dispatch<SetStateAction<CanvasElement[]>>;
  setBrushPreview: Dispatch<
    SetStateAction<{ x: number; y: number; size: number; visible: boolean }>
  >;
  lastPointerRef: RefObject<{ x: number; y: number }>;
  previewTimeoutRef: RefObject<number | null>;
  pushUndo: () => void;
}

export const useDrawing = ({
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
}: Params) => {
  const showBrushPreview = (size: number) => {
    if (previewTimeoutRef.current) {
      window.clearTimeout(previewTimeoutRef.current);
    }
    const { x, y } = lastPointerRef.current;
    setBrushPreview({ x, y, size, visible: true });
    previewTimeoutRef.current = window.setTimeout(() => {
      setBrushPreview((prev) => ({ ...prev, visible: false }));
    }, 800);
  };

  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        window.clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [previewTimeoutRef]);

  const handleMouseDownDrawing = (e: any) => {
    if (activeTool !== 'pen' && activeTool !== 'eraser') {
      return;
    }

    setIsDrawing(true);
    const pos = e.target.getStage().getRelativePointerPosition();
    setCurrentLine({
      points: [pos.x, pos.y],
      tool: activeTool,
      strokeWidth: penStrokeWidth,
      stroke: penStrokeColor,
    });
  };

  const handleMouseMoveDrawing = (e: any) => {
    if (!isDrawing || (activeTool !== 'pen' && activeTool !== 'eraser')) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getRelativePointerPosition();
    setCurrentLine((prev) =>
      prev
        ? {
            ...prev,
            points: [...prev.points, point.x, point.y],
          }
        : null,
    );
  };

  const handleMouseUpDrawing = () => {
    if (!currentLine) return;
    pushUndo();
    setElements((prev) => [
      ...prev,
      {
        id: `line_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        kind: 'line',
        points: [...currentLine.points],
        tool: currentLine.tool,
        strokeWidth: currentLine.strokeWidth,
        stroke: currentLine.stroke,
      },
    ]);
    setCurrentLine(null);
    setIsDrawing(false);
  };

  return {
    showBrushPreview,
    handleMouseDownDrawing,
    handleMouseMoveDrawing,
    handleMouseUpDrawing,
  };
};
