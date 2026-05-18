import { generateKeyVisual } from '@/features/editor/api/ai';
import { resolveImageUrl } from '@/features/template/utils/resolveImageUrl';

import { compactLines } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

const buildKeyVisualFeedback = ({
  template,
  getStringValue,
  getTagsValue,
}: Pick<
  TemplateGenerateContext,
  'template' | 'getStringValue' | 'getTagsValue'
>) => {
  if (template.key === 'sns_marketing') {
    const targets = getTagsValue('target_audience');
    return compactLines([
      template.title,
      targets.length > 0 ? `타겟설정: ${targets.join(', ')}` : undefined,
      getStringValue('feedback')
        ? `마케팅 피드백: ${getStringValue('feedback')}`
        : undefined,
      getStringValue('concept')
        ? `컨셉: ${getStringValue('concept')}`
        : undefined,
    ]);
  }

  return compactLines([
    template.title,
    getStringValue('product_name')
      ? `제품명: ${getStringValue('product_name')}`
      : undefined,
    getStringValue('lighting')
      ? `조명 스타일: ${getStringValue('lighting')}`
      : undefined,
    getStringValue('background_style')
      ? `배경 스타일: ${getStringValue('background_style')}`
      : undefined,
    getStringValue('feedback')
      ? `연출 지시: ${getStringValue('feedback')}`
      : undefined,
  ]);
};

export const useKeyVisualTemplateGenerate = ({
  template,
  files,
  getStringValue,
  getTagsValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const sourceImage = files.source_image?.[0];
    if (!sourceImage) {
      throw new Error(
        template.key === 'studio_shot'
          ? '제품 이미지를 선택해 주세요.'
          : '원본 이미지를 선택해 주세요.',
      );
    }

    const prompt = buildKeyVisualFeedback({
      template,
      getStringValue,
      getTagsValue,
    });
    const response = await generateKeyVisual({
      file: sourceImage,
      feedback: prompt,
      output_format: getStringValue('size') || undefined,
      platform: getStringValue('platform') || undefined,
    });
    const result = response.data.result;

    if (!result?.image_url) {
      throw new Error('키비주얼 생성 결과를 받지 못했습니다.');
    }

    return {
      imageUrl: resolveImageUrl(result.image_url) || result.image_url,
      prompt,
    };
  };

  return { generate };
};
