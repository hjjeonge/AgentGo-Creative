import {
  getCrossSellJobStatus,
  submitCrossSellJob,
} from '@/features/editor/api/ai';

import { toDataUrl, wait } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const useCrossSellStylingTemplateGenerate = ({
  files,
  getStringValue,
  getTagsValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const sourceImages = files.source_images ?? [];
    if (sourceImages.length === 0) {
      throw new Error('상품 이미지를 하나 이상 선택해 주세요.');
    }

    const productNames = getTagsValue('product_names');
    if (productNames.length === 0) {
      throw new Error('상품명을 하나 이상 입력해 주세요.');
    }

    const stylingContext = getStringValue('styling_context');
    if (!stylingContext) {
      throw new Error('스타일링 상황을 입력해 주세요.');
    }

    const modelImage = files.model_image?.[0];

    const submitRes = await submitCrossSellJob({
      files: sourceImages,
      product_names: productNames,
      styling_context: stylingContext,
      model_image: modelImage,
    });

    let job = submitRes.data;
    if (job.status !== 'success') {
      const jobId = job.result?.job_id;
      if (!jobId) {
        throw new Error('Cross-Sell 작업 ID를 받지 못했습니다.');
      }

      const maxAttempts = 30;
      for (let i = 0; i < maxAttempts; i++) {
        await wait(2000);
        const response = await getCrossSellJobStatus(jobId);
        job = response.data;
        if (job.status === 'success' || job.status === 'failed') break;
      }
    }

    if (job.status === 'failed') {
      throw new Error('Cross-Sell 스타일링 생성에 실패했습니다.');
    }

    if (job.status !== 'success') {
      throw new Error(
        'Cross-Sell 스타일링 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
      );
    }

    const result = job.result;
    if (!result?.image_base64) {
      throw new Error('Cross-Sell 스타일링 생성 결과를 받지 못했습니다.');
    }

    const prompt = [
      'AI Cross-Sell 스타일링',
      `상품: ${productNames.join(', ')}`,
      `상황: ${stylingContext}`,
    ]
      .filter(Boolean)
      .join('\n');

    return {
      imageUrl: toDataUrl(result.mime_type || 'image/png', result.image_base64),
      prompt,
    };
  };

  return { generate };
};
