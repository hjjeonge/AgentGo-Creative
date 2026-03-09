import type { Dispatch, RefObject, SetStateAction } from 'react';
import {
  getRectImageIntersections,
  pickTargetIntersection,
} from '../../utils/editor/cropUtils';
import { getPathBoundingRect } from '../../utils/editor/geometry';
import type { Rect, Shape } from '../../types/editor';

interface Params {
  shapesRef: RefObject<Shape[]>;
  selectedId: string | null;
  setShapes: Dispatch<SetStateAction<Shape[]>>;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  setActiveTool: Dispatch<SetStateAction<string>>;
  pushUndo: () => void;
}

export const useCrop = ({
  shapesRef,
  selectedId,
  setShapes,
  setSelectedId,
  setSelectedIds,
  setActiveTool,
  pushUndo,
}: Params) => {
  /**
   * cropByRect
   *
   * 사각/정사각 선택 영역을 기준으로 이미지 crop 값을 계산해 적용합니다.
   * 교차 영역 계산, 대상 이미지 선택, cropX/Y/Width/Height 갱신을 담당합니다.
   */
  const cropByRect = (rect: Rect) => {
    const uploadedShapes = shapesRef.current.filter(
      (shape) => shape.type === 'uploaded_image',
    );
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
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === target.shape.id
            ? {
                ...shape,
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
            : shape,
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

  /**
   * cropByLasso
   *
   * 자유형(lasso) 경로를 기준으로 대상 이미지에 마스크/라소 크롭 로직을 적용합니다.
   * lasso 경계 계산, 대상 이미지 선택, 경로 좌표 변환/저장을 담당합니다.
   */
  const cropByLasso = (lassoPath: number[]) => {
    if (lassoPath.length < 6) return false;
    const maskRect = getPathBoundingRect(lassoPath);
    if (!maskRect || maskRect.width <= 2 || maskRect.height <= 2) return false;

    const uploadedShapes = shapesRef.current.filter(
      (shape) => shape.type === 'uploaded_image',
    );
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
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === target.shape.id
          ? { ...shape, maskPath: localMaskPath }
          : shape,
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
