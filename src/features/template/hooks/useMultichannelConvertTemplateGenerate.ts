import { convertMultichannel } from '@/features/editor/api/ai';

import { toDataUrl } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const useMultichannelConvertTemplateGenerate = ({
  files,
  getStringValue,
  getTagsValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const sourceImage = files.source_image?.[0];
    if (!sourceImage) {
      throw new Error('원본 소재 이미지를 선택해 주세요.');
    }

    const targetFormats = getTagsValue('target_formats');
    if (targetFormats.length === 0) {
      throw new Error('변환할 채널 포맷을 하나 이상 입력해 주세요.');
    }

    const response = await convertMultichannel({
      file: sourceImage,
      target_formats: targetFormats,
      source_copy: getStringValue('source_copy') || undefined,
    });

    const result = response.data.result;
    const conversions = result?.conversions;
    if (!conversions || conversions.length === 0) {
      throw new Error('멀티채널 변환 결과를 받지 못했습니다.');
    }

    const first = conversions[0];
    const prompt = ['멀티채널 변환', `포맷: ${targetFormats.join(', ')}`].join(
      '\n',
    );

    return {
      imageUrl: toDataUrl(first.mime_type || 'image/png', first.image_base64),
      prompt,
      message:
        conversions.length > 1
          ? `${conversions.length}개 포맷으로 변환되었습니다.`
          : undefined,
    };
  };

  return { generate };
};
