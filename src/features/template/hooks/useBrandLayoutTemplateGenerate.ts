import { generateBrandLayout } from '@/features/editor/api/ai';
import { resolveImageUrl } from '@/features/template/utils/resolveImageUrl';

import { compactLines } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const useBrandLayoutTemplateGenerate = ({
  files,
  getStringValue,
  getTagsValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const sourceImage = files.source_image?.[0];
    if (!sourceImage) {
      throw new Error('제품 이미지를 선택해 주세요.');
    }

    const brandLayoutTemplate = getStringValue('brand_layout_template');
    if (!brandLayoutTemplate) {
      throw new Error('브랜드 레이아웃 템플릿을 선택해 주세요.');
    }

    const copyPoints = getTagsValue('copy_points');
    if (copyPoints.length === 0) {
      throw new Error('카피 포인트를 하나 이상 입력해 주세요.');
    }

    const targetPersona = getStringValue('target_persona');
    if (!targetPersona) {
      throw new Error('타겟 고객을 입력해 주세요.');
    }

    const response = await generateBrandLayout({
      file: sourceImage,
      brand_layout_template: brandLayoutTemplate,
      copy_points: copyPoints,
      target_persona: targetPersona,
    });

    const result = response.data.result;
    if (!result?.image_url) {
      throw new Error('브랜드 레이아웃 이미지 생성 결과를 받지 못했습니다.');
    }

    const prompt = compactLines([
      '브랜드 레이아웃 이미지',
      `레이아웃: ${brandLayoutTemplate}`,
      `타겟: ${targetPersona}`,
      copyPoints.length > 0 ? `카피: ${copyPoints.join(', ')}` : undefined,
    ]);

    return {
      imageUrl: resolveImageUrl(result.image_url) || result.image_url,
      prompt,
    };
  };

  return { generate };
};
