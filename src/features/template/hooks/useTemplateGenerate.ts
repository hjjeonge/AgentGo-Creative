import { useState } from 'react';

import { useBrandLayoutTemplateGenerate } from './useBrandLayoutTemplateGenerate';
import { useCampaignContentTemplateGenerate } from './useCampaignContentTemplateGenerate';
import { useCrossSellStylingTemplateGenerate } from './useCrossSellStylingTemplateGenerate';
import { useDetailCutTemplateGenerate } from './useDetailCutTemplateGenerate';
import { useImageJobTemplateGenerate } from './useImageJobTemplateGenerate';
import { useInfographicDataTemplateGenerate } from './useInfographicDataTemplateGenerate';
import { useInfographicPdfTemplateGenerate } from './useInfographicPdfTemplateGenerate';
import { useKeyVisualTemplateGenerate } from './useKeyVisualTemplateGenerate';
import { useLookbookTemplateGenerate } from './useLookbookTemplateGenerate';
import { useMultichannelConvertTemplateGenerate } from './useMultichannelConvertTemplateGenerate';
import { useMultilingualTemplateGenerate } from './useMultilingualTemplateGenerate';
import { usePersonaVariantsTemplateGenerate } from './usePersonaVariantsTemplateGenerate';
import { useWebtoonLetteringTemplateGenerate } from './useWebtoonLetteringTemplateGenerate';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const useTemplateGenerate = ({
  template,
  files,
  getStringValue,
  getTagsValue,
}: TemplateGenerateContext) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const imageJobGenerate = useImageJobTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const keyVisualGenerate = useKeyVisualTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const detailCutGenerate = useDetailCutTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const multilingualGenerate = useMultilingualTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const personaVariantsGenerate = usePersonaVariantsTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const campaignContentGenerate = useCampaignContentTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const multichannelConvertGenerate = useMultichannelConvertTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const brandLayoutGenerate = useBrandLayoutTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const lookbookGenerate = useLookbookTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const crossSellStylingGenerate = useCrossSellStylingTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const webtoonLetteringGenerate = useWebtoonLetteringTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const infographicDataGenerate = useInfographicDataTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });
  const infographicPdfGenerate = useInfographicPdfTemplateGenerate({
    template,
    files,
    getStringValue,
    getTagsValue,
  });

  const selectGenerator = () => {
    switch (template.key) {
      case 'sns_marketing':
      case 'studio_shot':
        return keyVisualGenerate.generate;
      case 'detail_catalog':
        return detailCutGenerate.generate;
      case 'multilingual':
        return multilingualGenerate.generate;
      case 'multichannel_convert':
        return multichannelConvertGenerate.generate;
      case 'campaign_content':
        return campaignContentGenerate.generate;
      case 'persona_variants':
        return personaVariantsGenerate.generate;
      case 'brand_layout':
        return brandLayoutGenerate.generate;
      case 'lookbook':
        return lookbookGenerate.generate;
      case 'cross_sell_styling':
        return crossSellStylingGenerate.generate;
      case 'webtoon_lettering':
        return webtoonLetteringGenerate.generate;
      case 'infographic_data':
        return infographicDataGenerate.generate;
      case 'infographic_pdf':
        return infographicPdfGenerate.generate;
      default:
        return imageJobGenerate.generate;
    }
  };

  const generateFromTemplate =
    async (): Promise<TemplateGenerateResult | null> => {
      if (isSubmitting) return null;

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const generate = selectGenerator();
        return await generate();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : '이미지 생성 요청에 실패했습니다.';
        setErrorMessage(message);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    };

  return {
    isSubmitting,
    errorMessage,
    generateFromTemplate,
  };
};
