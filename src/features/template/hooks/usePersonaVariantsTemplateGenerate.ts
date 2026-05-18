import {
  getPersonaVariantsJobStatus,
  submitPersonaVariantsJob,
} from '@/features/editor/api/ai';

import { resolveGeneratedImageSource, wait } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const usePersonaVariantsTemplateGenerate = ({
  files,
  getStringValue,
  getTagsValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const sourceImage = files.source_image?.[0];
    if (!sourceImage) {
      throw new Error('제품 이미지를 선택해 주세요.');
    }

    const personas = getTagsValue('personas');
    if (personas.length === 0) {
      throw new Error('타겟 페르소나를 하나 이상 입력해 주세요.');
    }

    const submitRes = await submitPersonaVariantsJob({
      file: sourceImage,
      product_info: getStringValue('product_info'),
      marketing_goal: getStringValue('marketing_goal'),
      personas,
    });

    let job = submitRes.data;
    if (job.status !== 'success') {
      const jobId = job.result?.job_id;
      if (!jobId) {
        throw new Error('페르소나 변형 작업 ID를 받지 못했습니다.');
      }

      const maxAttempts = 30;
      for (let i = 0; i < maxAttempts; i++) {
        await wait(2000);
        const response = await getPersonaVariantsJobStatus(jobId);
        job = response.data;
        if (job.status === 'success' || job.status === 'failed') break;
      }
    }

    if (job.status === 'failed') {
      throw new Error('페르소나 변형 생성에 실패했습니다.');
    }

    if (job.status !== 'success') {
      throw new Error(
        '페르소나 변형 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
      );
    }

    const results = job.result?.results;
    const firstResult = results?.[0];
    const imageUrl = resolveGeneratedImageSource(firstResult);
    if (!imageUrl) {
      throw new Error('페르소나 변형 생성 결과를 받지 못했습니다.');
    }

    const prompt = [
      '무한 페르소나',
      `마케팅 목표: ${getStringValue('marketing_goal')}`,
      `페르소나: ${personas.join(', ')}`,
    ].join('\n');

    return {
      imageUrl,
      prompt,
      message:
        results && results.length > 1
          ? `${results.length}개 페르소나 변형이 생성되었습니다.`
          : undefined,
    };
  };

  return { generate };
};
