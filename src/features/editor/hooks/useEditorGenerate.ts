import { useState } from 'react';
import type { RefObject } from 'react';
import { uploadFile } from '@/features/editor/api/file';
import { generateImage, getImageJob } from '@/features/editor/api/image';
import type {
  CanvasHandle,
  CanvasSnapshot,
  PromptGeneratePayload,
} from '@/features/editor/types';
import { useUpdateProjectMutation } from '@/features/project/queries';
import { resolveImageUrl } from '@/features/template/utils/resolveImageUrl';

interface Params {
  projectId: string;
  projectTitle: string;
  historyCount: number;
  maxHistory: number;
  canvasRef: RefObject<CanvasHandle | null>;
  persistSnapshotAssetUrls: (
    snapshot: CanvasSnapshot,
  ) => Promise<CanvasSnapshot>;
  refetchHistory: () => Promise<unknown>;
  setHasCanvasImage: (value: boolean) => void;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error && error.message ? error.message : fallback;
};

const normalizeBackendAssetUrl = (url: string) => {
  if (url.startsWith('/')) return url;
  if (url.startsWith(`${API_BASE_URL}/`)) {
    return url.slice(API_BASE_URL.length);
  }
  return url;
};

export const useEditorGenerate = ({
  projectId,
  projectTitle,
  historyCount,
  maxHistory,
  canvasRef,
  persistSnapshotAssetUrls,
  refetchHistory,
  setHasCanvasImage,
}: Params) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: updateProject } = useUpdateProjectMutation();

  const uploadCanvasBlob = async (blob: Blob, fileNamePrefix: string) => {
    const file = new File([blob], `${fileNamePrefix}-${Date.now()}.png`, {
      type: blob.type || 'image/png',
    });
    const uploaded = await uploadFile(file);
    return uploaded.file_url;
  };

  const resolveTargetImageUrl = async () => {
    const canvasBlob = await canvasRef.current?.exportAsBlob();
    if (!canvasBlob) {
      throw new Error('캔버스 이미지를 확인할 수 없습니다.');
    }

    const uploadedUrl = await uploadCanvasBlob(canvasBlob, 'editor-target');
    return normalizeBackendAssetUrl(uploadedUrl);
  };

  const waitForCanvasImage = async (imageUrl: string) => {
    const maxAttempts = 20;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const snapshot = canvasRef.current?.getSnapshot();
      const hasImageElement = snapshot?.elements.some(
        (element) => element.kind === 'image' && element.imageUrl === imageUrl,
      );
      if (hasImageElement) {
        await wait(50);
        return;
      }
      await wait(100);
    }

    throw new Error('생성 이미지를 캔버스에 반영하지 못했습니다.');
  };

  const handleGenerate = async ({
    prompt,
    referenceFiles,
  }: PromptGeneratePayload): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (!projectId) {
        throw new Error('프로젝트 정보를 확인할 수 없습니다.');
      }

      if (historyCount >= maxHistory) {
        throw new Error(
          `작업이력이 최대 ${maxHistory}개에 도달했습니다. 기존 이력을 삭제 후 다시 시도해 주세요.`,
        );
      }

      const targetImageUrl = await resolveTargetImageUrl();
      const referenceUrls =
        referenceFiles.length > 0
          ? await Promise.all(
              referenceFiles.map(async (file) => {
                const uploaded = await uploadFile(file);
                return normalizeBackendAssetUrl(uploaded.file_url);
              }),
            )
          : [];
      const generateReferenceUrls = [targetImageUrl, ...referenceUrls];

      const generateRes = await generateImage({
        prompt,
        reference_urls: generateReferenceUrls,
      });

      let job = generateRes.data;
      if (job.status !== 'completed') {
        const maxAttempts = 30;
        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
          await wait(2000);
          const response = await getImageJob(job.job_id);
          job = response.data;
          if (job.status === 'completed' || job.status === 'failed') break;
        }
      }

      if (job.status === 'failed') {
        throw new Error('이미지 생성에 실패했습니다.');
      }

      const imageUrl = resolveImageUrl(job.result_url);
      if (job.status !== 'completed' || !imageUrl) {
        throw new Error(
          '이미지 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
        );
      }

      canvasRef.current?.clearCanvas();
      canvasRef.current?.setBackgroundImage(imageUrl);
      await waitForCanvasImage(imageUrl);
      setHasCanvasImage(true);

      const snapshot = canvasRef.current?.getSnapshot();
      if (!snapshot) {
        throw new Error('생성 이미지를 캔버스에 반영하지 못했습니다.');
      }

      const persistedSnapshot = await persistSnapshotAssetUrls(snapshot);
      const canvasBlob = await canvasRef.current?.exportAsBlob();
      if (!canvasBlob) {
        throw new Error('Canvas export failed');
      }

      const file = new File(
        [canvasBlob],
        `project-${projectId}-${Date.now()}.png`,
        { type: 'image/png' },
      );
      const uploaded = await uploadFile(file);
      const uploadedUrl = uploaded.file_url;

      await updateProject({
        projectId,
        data: {
          title: projectTitle,
          snapshot: persistedSnapshot,
          thumbnail_url: uploadedUrl,
        },
      });
      await refetchHistory();
    } catch (error) {
      const message = getErrorMessage(
        error,
        '이미지 생성 요청 처리 중 오류가 발생했습니다.',
      );
      window.alert(message);
      throw error instanceof Error ? error : new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleGenerate,
  };
};
