import {
  getWebtoonLetteringJobStatus,
  submitWebtoonLetteringJob,
} from '@/features/editor/api/ai';

import { toDataUrl, wait } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const useWebtoonLetteringTemplateGenerate = ({
  files,
  getStringValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const sourceImage = files.source_image?.[0];
    if (!sourceImage) {
      throw new Error('웹툰 이미지를 선택해 주세요.');
    }

    const sourceLang = getStringValue('source_lang');
    if (!sourceLang) {
      throw new Error('원본 언어를 선택해 주세요.');
    }

    const targetLang = getStringValue('target_lang');
    if (!targetLang) {
      throw new Error('번역 언어를 선택해 주세요.');
    }

    const fontAutoMatchStr = getStringValue('font_auto_match');
    const balloonResizeStr = getStringValue('balloon_resize');

    const submitRes = await submitWebtoonLetteringJob({
      file: sourceImage,
      source_lang: sourceLang,
      target_lang: targetLang,
      font_auto_match:
        fontAutoMatchStr !== '' ? fontAutoMatchStr === 'true' : undefined,
      balloon_resize:
        balloonResizeStr !== '' ? balloonResizeStr === 'true' : undefined,
    });

    let job = submitRes.data;
    if (job.status !== 'success') {
      const jobId = job.result?.job_id;
      if (!jobId) {
        throw new Error('웹툰 식자 작업 ID를 받지 못했습니다.');
      }

      const maxAttempts = 30;
      for (let i = 0; i < maxAttempts; i++) {
        await wait(2000);
        const response = await getWebtoonLetteringJobStatus(jobId);
        job = response.data;
        if (job.status === 'success' || job.status === 'failed') break;
      }
    }

    if (job.status === 'failed') {
      throw new Error('웹툰 식자 최적화에 실패했습니다.');
    }

    if (job.status !== 'success') {
      throw new Error(
        '웹툰 식자 최적화 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
      );
    }

    const result = job.result;
    if (!result?.image_base64) {
      throw new Error('웹툰 식자 최적화 결과를 받지 못했습니다.');
    }

    const prompt = ['웹툰 식자 최적화', `${sourceLang} → ${targetLang}`].join(
      '\n',
    );

    return {
      imageUrl: toDataUrl(result.mime_type || 'image/png', result.image_base64),
      prompt,
    };
  };

  return { generate };
};
