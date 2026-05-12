import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import {
  DEFAULT_PROJECT_TITLE,
  MAX_HISTORY_COUNT,
} from '@/features/editor/constants/editor';
import { useEditorGenerate } from '@/features/editor/hooks/useEditorGenerate';
import { useEditorHistory } from '@/features/editor/hooks/useEditorHistory';
import { useEditorProject } from '@/features/editor/hooks/useEditorProject';
import { usePersistSnapshotAssets } from '@/features/editor/hooks/usePersistSnapshotAssets';
import type { CanvasHandle, TextObject } from '@/features/editor/types';
import {
  useProjectDetailQuery,
  useProjectHistoryQuery,
} from '@/features/project/queries';

export const useEditorPage = () => {
  const location = useLocation();
  const { projectId = '' } = useParams();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const breadcrumbLabel = searchParams.get('templateName');
  const breadcrumbPath = searchParams.get('templatePath');

  const [hasCanvasImage, setHasCanvasImage] = useState(false);
  const [projectTitle, setProjectTitle] = useState(DEFAULT_PROJECT_TITLE);
  const [selectedTextObject, setSelectedTextObject] = useState<
    TextObject | undefined
  >(undefined);

  const canvasRef = useRef<CanvasHandle | null>(null);
  const lastImageRef = useRef<string | null>(null);

  const projectDetailQuery = useProjectDetailQuery(projectId);
  const projectHistoryQuery = useProjectHistoryQuery(projectId);
  const { persistSnapshotAssetUrls } = usePersistSnapshotAssets();
  const {
    applyUploadedImage,
    clearProjectCanvas,
    getCanvasSnapshot,
    replaceProjectImage,
    restoreGeneratedImage,
    restoreHistorySnapshot,
  } = useEditorProject({
    canvasRef,
    projectDetail: projectDetailQuery.data,
    projectDetailError: projectDetailQuery.error,
    projectHistoryError: projectHistoryQuery.error,
    setHasCanvasImage,
    setProjectTitle,
  });
  const {
    addHistoryEntry,
    history,
    isHistoryOpen,
    startNewProject,
    toggleHistoryPanel,
  } = useEditorHistory({
    historyEntries: projectHistoryQuery.data,
    fallbackImageUrl: projectDetailQuery.data?.thumbnail_url || null,
    clearProjectCanvas,
    getCanvasSnapshot,
    onClearProjectState: () => {
      setHasCanvasImage(false);
      setProjectTitle(DEFAULT_PROJECT_TITLE);
    },
  });

  const handleAddText = useCallback(() => {
    canvasRef.current?.addText();
  }, []);

  const handleUpdateTextObject = useCallback(
    (id: string, updates: Partial<TextObject>) => {
      canvasRef.current?.updateTextObject(id, updates);
    },
    [],
  );

  const { isSubmitting: isGenerating, handleGenerate } = useEditorGenerate({
    projectId,
    projectTitle,
    historyCount: history.length,
    maxHistory: MAX_HISTORY_COUNT,
    canvasRef,
    persistSnapshotAssetUrls,
    refetchHistory: projectHistoryQuery.refetch,
    setHasCanvasImage,
  });

  useEffect(() => {
    const imageUrl = searchParams.get('image');
    const prompt = searchParams.get('prompt') || '생성 중';

    if (imageUrl && imageUrl !== lastImageRef.current) {
      lastImageRef.current = imageUrl;
      restoreGeneratedImage(imageUrl);
      addHistoryEntry(prompt);
    }
  }, [addHistoryEntry, restoreGeneratedImage, searchParams]);

  return {
    breadcrumbLabel,
    breadcrumbPath,
    canvasRef,
    handleAddText,
    handleGenerate,
    handleNewProject: startNewProject,
    handleRestore: restoreHistorySnapshot,
    handleUpdateTextObject,
    handleChangeImage: replaceProjectImage,
    handleUpload: applyUploadedImage,
    handleWorkHistory: toggleHistoryPanel,
    hasCanvasImage,
    history,
    isGenerating,
    isHistoryOpen,
    projectId,
    projectTitle,
    selectedTextObject,
    setSelectedTextObject,
  };
};
