import { renderDetailCut } from '@/features/editor/api/ai';
import { buildPrompt } from '@/features/template/utils/buildPrompt';
import { buildTemplateInputs } from '@/features/template/utils/buildTemplateInputs';

import { resolveGeneratedImageSource } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const useDetailCutTemplateGenerate = ({
  template,
  files,
  getStringValue,
  getTagsValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const sourceImages = files.source_images ?? [];
    if (sourceImages.length === 0) {
      throw new Error('제품 이미지를 하나 이상 선택해 주세요.');
    }

    const templateInputs = buildTemplateInputs({
      fields: template.fields,
      uploadedByField: {
        source_images: sourceImages.map((file) => file.name),
      },
      getStringValue,
      getTagsValue,
    });
    const prompt = buildPrompt(template.title, template.fields, templateInputs);
    const sourceAnglesInput = getStringValue('source_angles');
    const sourceAngles = sourceAnglesInput
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);

    const response = await renderDetailCut({
      files: sourceImages,
      product_name: getStringValue('product_name'),
      target_angle: getStringValue('target_angle'),
      source_angles: sourceAngles.length > 0 ? sourceAngles : undefined,
    });
    const result = response.data.result;
    const imageUrl = resolveGeneratedImageSource(result);
    if (!imageUrl) {
      throw new Error('디테일컷 생성 결과를 받지 못했습니다.');
    }

    return {
      imageUrl,
      prompt,
    };
  };

  return { generate };
};
