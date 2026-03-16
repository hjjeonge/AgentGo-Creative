import type { Rect, Shape, ShapeIntersection } from '@/features/editor/types';

export const getRectImageIntersections = (
  rect: Rect,
  shapes: Shape[],
): ShapeIntersection[] => {
  return shapes
    .map((shape) => {
      const ix = Math.max(rect.x, shape.x);
      const iy = Math.max(rect.y, shape.y);
      const ix2 = Math.min(rect.x + rect.width, shape.x + shape.width);
      const iy2 = Math.min(rect.y + rect.height, shape.y + shape.height);
      const iWidth = Math.max(0, ix2 - ix);
      const iHeight = Math.max(0, iy2 - iy);
      return {
        shape,
        ix,
        iy,
        iWidth,
        iHeight,
        area: iWidth * iHeight,
      };
    })
    .filter((candidate) => candidate.area > 4);
};

export const pickTargetIntersection = (
  intersections: ShapeIntersection[],
  selectedId: string | null,
): ShapeIntersection | undefined => {
  if (intersections.length === 0) return undefined;
  if (selectedId) {
    const selected = intersections.find(
      (candidate) => candidate.shape.id === selectedId,
    );
    if (selected) return selected;
  }
  return intersections[intersections.length - 1];
};
