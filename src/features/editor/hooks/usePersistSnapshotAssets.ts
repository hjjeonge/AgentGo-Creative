import { useCallback } from 'react';

import { uploadFile } from '@/features/editor/api/file';
import type { CanvasSnapshot } from '@/features/editor/types';
import {
  partitionCanvasElements,
  toCanvasElements,
} from '@/features/editor/utils/elementAdapters';

export const usePersistSnapshotAssets = () => {
  const uploadBlobUrl = useCallback(
    async (blobUrl: string, fileNamePrefix: string): Promise<string> => {
      const blobRes = await fetch(blobUrl);
      const blob = await blobRes.blob();
      const file = new File([blob], `${fileNamePrefix}-${Date.now()}.png`, {
        type: blob.type || 'image/png',
      });
      const uploaded = await uploadFile(file);
      return uploaded.file_url;
    },
    [],
  );

  const persistSnapshotAssetUrls = useCallback(
    async (snapshot: CanvasSnapshot): Promise<CanvasSnapshot> => {
      const legacyCollections = partitionCanvasElements(snapshot.elements);
      const urlCache = new Map<string, string>();

      const persistUrl = async (
        url: string | undefined,
        fileNamePrefix: string,
      ): Promise<string | undefined> => {
        if (!url || !url.startsWith('blob:')) return url;

        const cached = urlCache.get(url);
        if (cached) return cached;

        const uploadedUrl = await uploadBlobUrl(url, fileNamePrefix);
        urlCache.set(url, uploadedUrl);
        return uploadedUrl;
      };

      const nextBackgroundImage =
        (await persistUrl(
          snapshot.backgroundImage ?? undefined,
          'snapshot-bg',
        )) || null;

      const nextShapes = await Promise.all(
        legacyCollections.shapes.map(async (shape) => {
          if (shape.type !== 'uploaded_image' || !shape.imageUrl) return shape;

          const nextImageUrl = await persistUrl(
            shape.imageUrl,
            'snapshot-shape',
          );
          return nextImageUrl ? { ...shape, imageUrl: nextImageUrl } : shape;
        }),
      );

      return {
        backgroundImage: nextBackgroundImage,
        elements: toCanvasElements({
          lines: legacyCollections.lines,
          shapes: nextShapes,
          texts: legacyCollections.texts,
        }),
      };
    },
    [uploadBlobUrl],
  );

  return {
    persistSnapshotAssetUrls,
  };
};
