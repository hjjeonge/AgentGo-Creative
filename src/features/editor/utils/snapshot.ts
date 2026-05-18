import type { CanvasSnapshot } from '@/features/editor/types';
import {
  partitionCanvasElements,
  toCanvasElements,
} from '@/features/editor/utils/elementAdapters';
import { resolveImageUrl } from '@/features/template/utils/resolveImageUrl';

const normalizeAssetUrl = (
  url: string | null | undefined,
  fallbackImageUrl?: string | null,
) => {
  if (!url) return null;

  const normalizedFallback = resolveImageUrl(fallbackImageUrl);
  if (url.startsWith('blob:')) return normalizedFallback || null;

  return resolveImageUrl(url);
};

export const normalizeSnapshotForRender = (
  snapshot: CanvasSnapshot,
  fallbackImageUrl?: string | null,
): CanvasSnapshot => {
  const legacyCollections = partitionCanvasElements(snapshot.elements);
  const normalizedBackground = normalizeAssetUrl(
    snapshot.backgroundImage,
    fallbackImageUrl,
  );

  const normalizedShapes = legacyCollections.shapes.map((shape) => {
    if (shape.type !== 'uploaded_image') return shape;

    return {
      ...shape,
      imageUrl:
        normalizeAssetUrl(shape.imageUrl, fallbackImageUrl) || undefined,
    };
  });

  const shapeBackground =
    normalizedShapes.find(
      (shape) => shape.type === 'uploaded_image' && shape.imageUrl,
    )?.imageUrl || null;

  return {
    backgroundImage: normalizedBackground || shapeBackground,
    elements: toCanvasElements({
      lines: legacyCollections.lines,
      shapes: normalizedShapes,
      texts: legacyCollections.texts,
    }),
  };
};

export const snapshotHasImage = (snapshot: CanvasSnapshot) => {
  return (
    snapshot.backgroundImage !== null ||
    partitionCanvasElements(snapshot.elements).shapes.some(
      (shape) => shape.type === 'uploaded_image' && !!shape.imageUrl,
    )
  );
};
