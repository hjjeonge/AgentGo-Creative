import { useEffect } from 'react';
import type { RefObject } from 'react';

import {
  DEFAULT_PROJECT_TITLE,
  RESTORE_HISTORY_CONFIRM_MESSAGE,
} from '@/features/editor/constants/editor';
import type { CanvasHandle, CanvasSnapshot } from '@/features/editor/types';
import {
  normalizeSnapshotForRender,
  snapshotHasImage,
} from '@/features/editor/utils/snapshot';
import type {
  HistoryItemRes,
  ProjectDetailRes,
} from '@/features/project/types';
import { resolveImageUrl } from '@/features/template/utils/resolveImageUrl';

interface UseEditorProjectParams {
  canvasRef: RefObject<CanvasHandle | null>;
  projectDetail?: ProjectDetailRes;
  projectDetailError?: Error | null;
  projectHistoryError?: Error | null;
  setHasCanvasImage: (value: boolean) => void;
  setProjectTitle: (value: string) => void;
}

export const useEditorProject = ({
  canvasRef,
  projectDetail,
  projectDetailError,
  projectHistoryError,
  setHasCanvasImage,
  setProjectTitle,
}: UseEditorProjectParams) => {
  useEffect(() => {
    if (!projectDetail) return;

    const thumbnailUrl = projectDetail.thumbnail_url || null;
    setProjectTitle(projectDetail.title || DEFAULT_PROJECT_TITLE);

    const snapshot = projectDetail.snapshot;
    if (snapshot) {
      const normalized = normalizeSnapshotForRender(snapshot, thumbnailUrl);
      canvasRef.current?.restoreSnapshot(normalized);
      setHasCanvasImage(snapshotHasImage(normalized));
      return;
    }

    const normalizedThumbnail = resolveImageUrl(thumbnailUrl);
    if (normalizedThumbnail) {
      canvasRef.current?.restoreSnapshot({
        backgroundImage: normalizedThumbnail,
        elements: [],
      });
      setHasCanvasImage(true);
      return;
    }

    setHasCanvasImage(false);
  }, [canvasRef, projectDetail, setHasCanvasImage, setProjectTitle]);

  useEffect(() => {
    if (!projectDetailError && !projectHistoryError) return;
    console.error(
      'project load error ',
      projectDetailError ?? projectHistoryError,
    );
  }, [projectDetailError, projectHistoryError]);

  const restoreHistorySnapshot = (entry: HistoryItemRes) => {
    const confirmed = window.confirm(
      RESTORE_HISTORY_CONFIRM_MESSAGE(entry.title),
    );
    if (!confirmed) return;

    const normalizedSnapshot = normalizeSnapshotForRender(entry.snapshot);
    canvasRef.current?.restoreSnapshot(normalizedSnapshot);
    setHasCanvasImage(snapshotHasImage(normalizedSnapshot));
  };

  const restoreGeneratedImage = (imageUrl: string) => {
    canvasRef.current?.clearCanvas();
    canvasRef.current?.setBackgroundImage(imageUrl);
    setHasCanvasImage(true);
  };

  const applyUploadedImage = (url: string) => {
    canvasRef.current?.setBackgroundImage(url);
    setHasCanvasImage(true);
  };

  const clearProjectCanvas = () => {
    canvasRef.current?.clearCanvas();
    setHasCanvasImage(false);
  };

  const getCanvasSnapshot = (): CanvasSnapshot | null => {
    return canvasRef.current?.getSnapshot() ?? null;
  };

  return {
    applyUploadedImage,
    clearProjectCanvas,
    getCanvasSnapshot,
    restoreGeneratedImage,
    restoreHistorySnapshot,
  };
};
