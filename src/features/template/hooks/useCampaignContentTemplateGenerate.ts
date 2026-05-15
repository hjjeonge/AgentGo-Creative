import { generateCampaignContent } from '@/features/editor/api/ai';
import { resolveImageUrl } from '@/features/template/utils/resolveImageUrl';

import { compactLines } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const useCampaignContentTemplateGenerate = ({
  files,
  getStringValue,
  getTagsValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const sourceImage = files.source_image?.[0];
    if (!sourceImage) {
      throw new Error('제품 이미지를 선택해 주세요.');
    }

    const persona = getStringValue('persona');
    if (!persona) {
      throw new Error('타겟 페르소나를 입력해 주세요.');
    }

    const appealPoints = getTagsValue('appeal_points');
    if (appealPoints.length === 0) {
      throw new Error('핵심 소구 포인트를 하나 이상 입력해 주세요.');
    }

    const backgroundStyle = getStringValue('background_style');
    if (!backgroundStyle) {
      throw new Error('배경 스타일을 선택해 주세요.');
    }

    const response = await generateCampaignContent({
      file: sourceImage,
      persona,
      appeal_points: appealPoints,
      background_style: backgroundStyle,
      campaign_concept: getStringValue('campaign_concept') || undefined,
    });

    const result = response.data.result;
    if (!result?.image_url) {
      throw new Error('캠페인 콘텐츠 생성 결과를 받지 못했습니다.');
    }

    const prompt = compactLines([
      '캠페인 콘텐츠',
      `페르소나: ${persona}`,
      appealPoints.length > 0
        ? `소구 포인트: ${appealPoints.join(', ')}`
        : undefined,
      `배경: ${backgroundStyle}`,
      getStringValue('campaign_concept')
        ? `콘셉트: ${getStringValue('campaign_concept')}`
        : undefined,
    ]);

    return {
      imageUrl: resolveImageUrl(result.image_url) || result.image_url,
      prompt,
    };
  };

  return { generate };
};
