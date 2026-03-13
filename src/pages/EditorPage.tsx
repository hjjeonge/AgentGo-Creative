import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Aside } from '@/features/editor/components/Aside';
import { Canvas } from '@/features/editor/components/Canvas';
import { HistoryPanel } from '@/features/editor/components/HistoryPanel';
import { uploadFile } from '@/features/editor/api/file';
import {
  getProjectDetail,
  getProjectHistory,
  putProject,
} from '@/features/project/api';
import type { HistoryItemRes } from '@/features/project/types';
import { projectQueryKeys } from '@/features/project/queries/queryKeys';
import { queryClient } from '@/lib/queryClient';
import type {
  CanvasHandle,
  CanvasSnapshot,
  TextObject,
} from '@/features/editor/types';
import {
  partitionCanvasElements,
  toCanvasElements,
} from '@/features/editor/utils/elementAdapters';
import { resolveImageUrl } from '@/features/template/utils/resolveImageUrl';

const MAX_HISTORY = 20;

export const EditorPage: React.FC = () => {
  const location = useLocation();
  const { projectId = '' } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const breadcrumbLabel = searchParams.get('templateName');
  const breadcrumbPath = searchParams.get('templatePath');
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [history, setHistory] = useState<HistoryItemRes[]>([]);
  const [hasCanvasImage, setHasCanvasImage] = useState(false);
  const [projectTitle, setProjectTitle] = useState('새 프로젝트');
  const [selectedTextObject, setSelectedTextObject] = useState<
    TextObject | undefined
  >(undefined);
  const canvasRef = useRef<CanvasHandle>(null);
  const lastImageRef = useRef<string | null>(null);

  const normalizeSnapshotForRender = (
    snapshot: CanvasSnapshot,
    fallbackImageUrl?: string | null,
  ): CanvasSnapshot => {
    const legacyCollections = snapshot.elements
      ? partitionCanvasElements(snapshot.elements)
      : {
          lines: snapshot.lines,
          shapes: snapshot.shapes,
          texts: snapshot.texts,
        };
    const normalizedFallback = resolveImageUrl(fallbackImageUrl);
    const normalize = (url: string | null | undefined): string | null => {
      if (!url) return null;
      if (url.startsWith('blob:')) return normalizedFallback || null;
      return resolveImageUrl(url);
    };

    const normalizedBackground = normalize(snapshot.backgroundImage);
    const normalizedShapes = legacyCollections.shapes.map((shape) => {
      if (shape.type !== 'uploaded_image') return shape;
      return {
        ...shape,
        imageUrl: normalize(shape.imageUrl) || undefined,
      };
    });
    const shapeBackground =
      normalizedShapes.find(
        (shape) => shape.type === 'uploaded_image' && shape.imageUrl,
      )?.imageUrl || null;

    return {
      ...snapshot,
      lines: legacyCollections.lines,
      backgroundImage: normalizedBackground || shapeBackground,
      shapes: normalizedShapes,
      texts: legacyCollections.texts,
      elements: toCanvasElements({
        lines: legacyCollections.lines,
        shapes: normalizedShapes,
        texts: legacyCollections.texts,
      }),
    };
  };

  const snapshotHasImage = (snapshot: CanvasSnapshot) =>
    snapshot.backgroundImage !== null ||
    (
      snapshot.elements
        ? partitionCanvasElements(snapshot.elements).shapes
        : snapshot.shapes
    ).some(
      (shape) => shape.type === 'uploaded_image' && !!shape.imageUrl,
    );

  const fetchAndSetHistory = async (fallbackImageUrl?: string | null) => {
    const historyRes = await getProjectHistory(projectId);
    setHistory(
      historyRes.data.map((entry) => ({
        ...entry,
        snapshot: normalizeSnapshotForRender(entry.snapshot, fallbackImageUrl),
      })),
    );
  };

  useEffect(() => {
    Promise.all([getProjectDetail(projectId), getProjectHistory(projectId)])
      .then(([detailRes, historyRes]) => {
        const thumbnailUrl = detailRes.data.thumbnail_url || null;
        setProjectTitle(detailRes.data.title || '새 프로젝트');

        const snapshot = detailRes.data.snapshot;
        if (snapshot) {
          const normalized = normalizeSnapshotForRender(snapshot, thumbnailUrl);
          canvasRef.current?.restoreSnapshot(normalized);
          setHasCanvasImage(snapshotHasImage(normalized));
        }

        setHistory(
          historyRes.data.map((entry) => ({
            ...entry,
            snapshot: normalizeSnapshotForRender(entry.snapshot, thumbnailUrl),
          })),
        );
      })
      .catch((err) => console.error('project load error ', err));
  }, [projectId]);

  const handleWorkHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  const handleUpload = (url: string) => {
    canvasRef.current?.setBackgroundImage(url);
    setHasCanvasImage(true);
  };

  const handleNewProject = () => {
    const confirmed = window.confirm(
      '현재 작업을 종료하고 새 프로젝트를 시작하시겠습니까?',
    );
    if (!confirmed) return;
    canvasRef.current?.clearCanvas();
    setHasCanvasImage(false);
    setHistory([]);
  };

  const handleAddText = () => {
    canvasRef.current?.addText();
  };

  const handleUpdateTextObject = (id: string, updates: Partial<TextObject>) => {
    canvasRef.current?.updateTextObject(id, updates);
  };

  const addHistoryEntry = (
    prompt: string,
    snapshotOverride?: CanvasSnapshot,
  ): { entryId: string; snapshot: CanvasSnapshot } | null => {
    if (history.length >= MAX_HISTORY) {
      alert(
        `작업이력이 최대 ${MAX_HISTORY}개에 도달했습니다.\n기존 이력을 삭제 후 다시 시도해 주세요.`,
      );
      return null;
    }

    const snapshot = snapshotOverride ?? canvasRef.current?.getSnapshot();
    if (!snapshot) return null;

    const now = new Date();
    const timestamp = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const entryId = `history_${Date.now()}`;
    const newEntry: HistoryItemRes = {
      id: entryId,
      title: prompt.length > 20 ? prompt.slice(0, 20) + '…' : prompt,
      timestamp,
      snapshot,
    };

    setHistory((prev) => [newEntry, ...prev]);
    return { entryId, snapshot };
  };

  const uploadBlobUrl = async (
    blobUrl: string,
    fileNamePrefix: string,
  ): Promise<string> => {
    const blobRes = await fetch(blobUrl);
    const blob = await blobRes.blob();
    const file = new File([blob], `${fileNamePrefix}-${Date.now()}.png`, {
      type: blob.type || 'image/png',
    });
    const uploaded = await uploadFile(file);
    return uploaded.file_url;
  };

  const persistSnapshotAssetUrls = async (
    snapshot: CanvasSnapshot,
  ): Promise<CanvasSnapshot> => {
    const legacyCollections = snapshot.elements
      ? partitionCanvasElements(snapshot.elements)
      : {
          lines: snapshot.lines,
          shapes: snapshot.shapes,
          texts: snapshot.texts,
        };
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
        const nextImageUrl = await persistUrl(shape.imageUrl, 'snapshot-shape');
        return nextImageUrl ? { ...shape, imageUrl: nextImageUrl } : shape;
      }),
    );

    return {
      ...snapshot,
      lines: legacyCollections.lines,
      backgroundImage: nextBackgroundImage,
      shapes: nextShapes,
      texts: legacyCollections.texts,
      elements: toCanvasElements({
        lines: legacyCollections.lines,
        shapes: nextShapes,
        texts: legacyCollections.texts,
      }),
    };
  };

  const handleGenerate = async (prompt: string) => {
    void prompt;
    if (!projectId) return;
    if (history.length >= MAX_HISTORY) {
      alert(
        `작업이력이 최대 ${MAX_HISTORY}개에 도달했습니다.\n기존 이력을 삭제 후 다시 시도해 주세요.`,
      );
      return;
    }

    const snapshot = canvasRef.current?.getSnapshot();
    if (!snapshot) return;

    try {
      const persistedSnapshot = await persistSnapshotAssetUrls(snapshot);
      const canvasBlob = await canvasRef.current?.exportAsBlob();
      if (!canvasBlob) throw new Error('Canvas export failed');

      const file = new File(
        [canvasBlob],
        `project-${projectId}-${Date.now()}.png`,
        { type: 'image/png' },
      );
      const uploaded = await uploadFile(file);
      const uploadedUrl = uploaded.file_url;

      await putProject(projectId, {
        title: projectTitle,
        snapshot: persistedSnapshot,
        thumbnail_url: uploadedUrl,
      });

      await fetchAndSetHistory(uploadedUrl);

      await queryClient.invalidateQueries({
        queryKey: projectQueryKeys.recent(),
      });
    } catch (error) {
      console.error('save project error ', error);
      alert('프로젝트 저장 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const imageUrl = searchParams.get('image');
    const prompt = searchParams.get('prompt') || '생성 중';
    if (imageUrl && imageUrl !== lastImageRef.current) {
      lastImageRef.current = imageUrl;
      canvasRef.current?.clearCanvas();
      canvasRef.current?.setBackgroundImage(imageUrl);
      setHasCanvasImage(true);
      addHistoryEntry(prompt);
    }
  }, [location.search]);

  const handleRestore = (entry: HistoryItemRes) => {
    const confirmed = window.confirm(
      `"${entry.title}" 작업으로 돌아가시겠습니까?\n현재 작업 내용은 사라집니다.`,
    );
    if (!confirmed) return;
    canvasRef.current?.restoreSnapshot(entry.snapshot);
    setHasCanvasImage(snapshotHasImage(entry.snapshot));
  };

  return (
    <div className="h-full w-full flex relative">
      <Aside
        hasImage={hasCanvasImage}
        onUpload={handleUpload}
        onNewProject={handleNewProject}
        onAddText={handleAddText}
        selectedTextObject={selectedTextObject}
        handleUpdateTextObject={handleUpdateTextObject}
      />
      <Canvas
        ref={canvasRef}
        onGenerate={handleGenerate}
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        onSelectedTextObjectChange={setSelectedTextObject}
      />
      <HistoryPanel
        handleWorkHistory={handleWorkHistory}
        historyOpen={isHistoryOpen}
        history={history}
        onRestore={handleRestore}
      />
    </div>
  );
};
