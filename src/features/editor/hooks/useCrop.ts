import type { Dispatch, RefObject, SetStateAction } from 'react';
import {
  getRectImageIntersections,
  pickTargetIntersection,
} from '@/features/editor/utils/cropUtils';
import { getPathBoundingRect } from '@/features/editor/utils/geometry';
import type {
  CanvasElement,
  ImageElement,
  Rect,
  Shape,
} from '@/features/editor/types';

interface Params {
  elementsRef: RefObject<CanvasElement[]>;
  selectedId: string | null;
  setElements: Dispatch<SetStateAction<CanvasElement[]>>;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  setActiveTool: Dispatch<SetStateAction<string>>;
  pushUndo: () => void;
}

export const useCrop = ({
  elementsRef,
  selectedId,
  setElements,
  setSelectedId,
  setSelectedIds,
  setActiveTool,
  pushUndo,
}: Params) => {
  const toImageShape = (element: ImageElement): Shape => {
    return {
      id: element.id,
      type: 'uploaded_image',
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      fill: 'transparent',
      imageUrl: element.imageUrl,
      sourceWidth: element.sourceWidth,
      sourceHeight: element.sourceHeight,
      cropX: element.cropX,
      cropY: element.cropY,
      cropWidth: element.cropWidth,
      cropHeight: element.cropHeight,
      maskPath: element.maskPath,
    };
  };

  const cropByRect = (rect: Rect) => {
    const uploadedShapes = elementsRef.current
      .filter((element): element is ImageElement => element.kind === 'image')
      .map(toImageShape);
    if (uploadedShapes.length === 0) return false;

    const intersections = getRectImageIntersections(rect, uploadedShapes);
    if (intersections.length === 0) return false;

    const target = pickTargetIntersection(intersections, selectedId);
    if (!target) return false;

    const applyCrop = (sourceWidth: number, sourceHeight: number) => {
      const safeSourceWidth = Math.max(1, sourceWidth);
      const safeSourceHeight = Math.max(1, sourceHeight);
      const currentCropX = target.shape.cropX ?? 0;
      const currentCropY = target.shape.cropY ?? 0;
      const currentCropWidth = Math.max(
        1,
        target.shape.cropWidth ?? safeSourceWidth,
      );
      const currentCropHeight = Math.max(
        1,
        target.shape.cropHeight ?? safeSourceHeight,
      );
      const scaleX = currentCropWidth / Math.max(1, target.shape.width);
      const scaleY = currentCropHeight / Math.max(1, target.shape.height);

      const nextCropX = currentCropX + (target.ix - target.shape.x) * scaleX;
      const nextCropY = currentCropY + (target.iy - target.shape.y) * scaleY;
      const nextCropWidth = target.iWidth * scaleX;
      const nextCropHeight = target.iHeight * scaleY;

      pushUndo();
      setElements((prev) =>
        prev.map((element) =>
          element.id === target.shape.id && element.kind === 'image'
            ? {
                ...element,
                x: target.ix,
                y: target.iy,
                width: target.iWidth,
                height: target.iHeight,
                sourceWidth: safeSourceWidth,
                sourceHeight: safeSourceHeight,
                cropX: nextCropX,
                cropY: nextCropY,
                cropWidth: nextCropWidth,
                cropHeight: nextCropHeight,
              }
            : element,
        ),
      );
      setSelectedId(target.shape.id);
      setSelectedIds([]);
      setActiveTool('mouse');
    };

    if (
      (target.shape.sourceWidth ?? 0) <= 0 ||
      (target.shape.sourceHeight ?? 0) <= 0
    ) {
      const url = target.shape.imageUrl;
      if (url) {
        const image = new window.Image();
        image.onload = () =>
          applyCrop(
            Math.max(1, image.naturalWidth || image.width),
            Math.max(1, image.naturalHeight || image.height),
          );
        image.src = url;
        return true;
      }
    }

    applyCrop(
      Math.max(1, target.shape.sourceWidth ?? target.shape.width),
      Math.max(1, target.shape.sourceHeight ?? target.shape.height),
    );
    return true;
  };

  const cropByLasso = (lassoPath: number[]) => {
    if (lassoPath.length < 6) return false;
    const maskRect = getPathBoundingRect(lassoPath);
    if (!maskRect || maskRect.width <= 2 || maskRect.height <= 2) return false;

    const uploadedShapes = elementsRef.current
      .filter((element): element is ImageElement => element.kind === 'image')
      .map(toImageShape);
    const intersections = getRectImageIntersections(maskRect, uploadedShapes);
    const target = pickTargetIntersection(intersections, selectedId);
    if (!target) return false;

    const safeWidth = Math.max(1, target.shape.width);
    const safeHeight = Math.max(1, target.shape.height);
    const localMaskPath: number[] = [];
    for (let i = 0; i < lassoPath.length; i += 2) {
      const stageX = lassoPath[i];
      const stageY = lassoPath[i + 1];
      const localX = stageX - target.shape.x;
      const localY = stageY - target.shape.y;
      localMaskPath.push(localX / safeWidth, localY / safeHeight);
    }

    pushUndo();
    setElements((prev) =>
      prev.map((element) =>
        element.id === target.shape.id && element.kind === 'image'
          ? { ...element, maskPath: localMaskPath }
          : element,
      ),
    );
    setSelectedId(target.shape.id);
    setSelectedIds([]);
    setActiveTool('mouse');
    return true;
  };

  return {
    cropByRect,
    cropByLasso,
  };
};
