import {
  getLookbookJobStatus,
  submitLookbookJob,
} from '@/features/editor/api/ai';

import { resolveGeneratedImageSource, wait } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const useLookbookTemplateGenerate = ({
  files,
  getStringValue,
  getTagsValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const sourceImages = files.source_images ?? [];
    if (sourceImages.length === 0) {
      throw new Error('제품 이미지를 하나 이상 선택해 주세요.');
    }

    const spaceStyle = getStringValue('space_style');
    if (!spaceStyle) {
      throw new Error('공간 스타일을 선택해 주세요.');
    }

    const styleTone = getStringValue('style_tone');
    if (!styleTone) {
      throw new Error('스타일 톤을 선택해 주세요.');
    }

    const productLabels = getTagsValue('product_labels');

    const submitRes = await submitLookbookJob({
      files: sourceImages,
      space_style: spaceStyle,
      style_tone: styleTone,
      product_labels: productLabels.length > 0 ? productLabels : undefined,
    });

    let job = submitRes.data;
    if (job.status !== 'success') {
      const jobId = job.result?.job_id;
      if (!jobId) {
        throw new Error('룩북 생성 작업 ID를 받지 못했습니다.');
      }

      const maxAttempts = 30;
      for (let i = 0; i < maxAttempts; i++) {
        await wait(2000);
        const response = await getLookbookJobStatus(jobId);
        job = response.data;
        if (job.status === 'success' || job.status === 'failed') break;
      }
    }

    if (job.status === 'failed') {
      throw new Error('룩북 생성에 실패했습니다.');
    }

    if (job.status !== 'success') {
      throw new Error(
        '룩북 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
      );
    }

    const result = job.result;
    const imageUrl = resolveGeneratedImageSource(result);
    if (!imageUrl) {
      throw new Error('룩북 생성 결과를 받지 못했습니다.');
    }

    const prompt = [
      'AI 룩북',
      `공간: ${spaceStyle}`,
      `톤: ${styleTone}`,
      productLabels.length > 0 ? `제품: ${productLabels.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return {
      imageUrl,
      prompt,
    };
  };

  return { generate };
};
