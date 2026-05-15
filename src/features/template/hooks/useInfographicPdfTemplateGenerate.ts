import {
  getInfographicPdfJobStatus,
  submitInfographicPdfJob,
} from '@/features/editor/api/ai';

import { toDataUrl, wait } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const useInfographicPdfTemplateGenerate = ({
  files,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const pdfFile = files.pdf_file?.[0];
    if (!pdfFile) {
      throw new Error('PDF 파일을 선택해 주세요.');
    }

    const submitRes = await submitInfographicPdfJob({ file: pdfFile });

    let job = submitRes.data;
    if (job.status !== 'success') {
      const jobId = job.result?.job_id;
      if (!jobId) {
        throw new Error('스토리보드 생성 작업 ID를 받지 못했습니다.');
      }

      const maxAttempts = 40;
      for (let i = 0; i < maxAttempts; i++) {
        await wait(3000);
        const response = await getInfographicPdfJobStatus(jobId);
        job = response.data;
        if (job.status === 'success' || job.status === 'failed') break;
      }
    }

    if (job.status === 'failed') {
      throw new Error('스토리보드 슬라이드 생성에 실패했습니다.');
    }

    if (job.status !== 'success') {
      throw new Error(
        '스토리보드 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
      );
    }

    const slides = job.result?.slides;
    const firstSlide = slides?.[0];
    if (!firstSlide?.image_base64) {
      throw new Error('스토리보드 생성 결과를 받지 못했습니다.');
    }

    const prompt = [
      'PDF 스토리보드 슬라이드',
      slides && slides.length > 1 ? `총 ${slides.length}페이지 생성됨` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return {
      imageUrl: toDataUrl(
        firstSlide.mime_type || 'image/png',
        firstSlide.image_base64,
      ),
      prompt,
      message:
        slides && slides.length > 1
          ? `${slides.length}개 슬라이드가 생성되었습니다. 첫 번째 슬라이드를 에디터로 전송합니다.`
          : undefined,
    };
  };

  return { generate };
};
