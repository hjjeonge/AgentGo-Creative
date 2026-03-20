import { useState } from 'react';
import { useDetailCutTemplateGenerate } from './useDetailCutTemplateGenerate';
import { useImageJobTemplateGenerate } from './useImageJobTemplateGenerate';
import { useKeyVisualTemplateGenerate } from './useKeyVisualTemplateGenerate';
import { useMultilingualTemplateGenerate } from './useMultilingualTemplateGenerate';
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

  const selectGenerator = () => {
    switch (template.key) {
      case 'sns_marketing':
      case 'studio_shot':
        return keyVisualGenerate.generate;
      case 'detail_catalog':
        return detailCutGenerate.generate;
      case 'multilingual':
        return multilingualGenerate.generate;
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
