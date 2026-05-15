import { generateInfographicFromData } from '@/features/editor/api/ai';

import { toDataUrl } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const useInfographicDataTemplateGenerate = ({
  getStringValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const productsJson = getStringValue('products_json');
    if (!productsJson) {
      throw new Error('상품 데이터(JSON)를 입력해 주세요.');
    }

    try {
      JSON.parse(productsJson);
    } catch {
      throw new Error('상품 데이터 JSON 형식이 올바르지 않습니다.');
    }

    const layoutType = getStringValue('layout_type');
    if (!layoutType) {
      throw new Error('레이아웃을 선택해 주세요.');
    }

    const promoTheme = getStringValue('promo_theme');
    if (!promoTheme) {
      throw new Error('프로모션 테마를 선택해 주세요.');
    }

    const response = await generateInfographicFromData({
      products_json: productsJson,
      layout_type: layoutType,
      promo_theme: promoTheme,
      headline: getStringValue('headline') || undefined,
      brand_color: getStringValue('brand_color') || undefined,
    });

    const result = response.data.result;
    if (!result?.image_base64) {
      throw new Error('인포그래픽 생성 결과를 받지 못했습니다.');
    }

    const prompt = [
      '프로모션 인포그래픽',
      `레이아웃: ${layoutType}`,
      `테마: ${promoTheme}`,
      getStringValue('headline')
        ? `헤드라인: ${getStringValue('headline')}`
        : '',
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
