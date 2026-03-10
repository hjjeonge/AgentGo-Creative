import { useState } from 'react';
import { uploadFile } from '../../services/file/api';
import type { TemplateConfig } from '../../types/template';
import { buildPrompt } from '../../utils/template/buildPrompt';
import {
  buildTemplateInputs,
  extractReferenceUrls,
} from '../../utils/template/buildTemplateInputs';
import { resolveImageUrl } from '../../utils/template/resolveImageUrl';
import { generateImage, getImageJob } from '../../services/image/api';

type FormFiles = Record<string, File[]>;

interface UseTemplateGenerateParams {
  template: TemplateConfig;
  files: FormFiles;
  getStringValue: (key: string) => string;
  getTagsValue: (key: string) => string[];
}

interface GenerateResult {
  imageUrl: string;
  prompt: string;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useTemplateGenerate = ({
  template,
  files,
  getStringValue,
  getTagsValue,
}: UseTemplateGenerateParams) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateFromTemplate = async (): Promise<GenerateResult | null> => {
    if (isSubmitting) return null;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const uploadedByField: Record<string, string[]> = {};

      for (const field of template.fields) {
        if (field.type !== 'file' && field.type !== 'files') continue;

        const selectedFiles = files[field.key] ?? [];
        if (!selectedFiles.length) continue;

        const urls = await Promise.all(
          selectedFiles.map(async (file) => {
            const uploaded = await uploadFile(file);
            return uploaded.data.file_url;
          }),
        );
        uploadedByField[field.key] = urls;
      }

      const templateInputs = buildTemplateInputs({
        fields: template.fields,
        uploadedByField,
        getStringValue,
        getTagsValue,
      });

      const allReferenceUrls = extractReferenceUrls(uploadedByField);
      const prompt = buildPrompt(
        template.title,
        template.fields,
        templateInputs,
      );
      const sizeValue = getStringValue('size') || undefined;
      const targets = getTagsValue('target_audience');

      const res = await generateImage({
        prompt,
        concept: getStringValue('concept') || undefined,
        size: sizeValue,
        targets: targets.length > 0 ? targets : undefined,
        reference_urls: allReferenceUrls,
        template_key: template.key,
        template_name: template.title,
        template_inputs: templateInputs,
      });

      let job = res.data;
      if (job.status !== 'completed') {
        const maxAttempts = 30;
        for (let i = 0; i < maxAttempts; i++) {
          await wait(2000);
          const response = await getImageJob(job.job_id);
          job = response.data;
          if (job.status === 'completed' || job.status === 'failed') break;
        }
      }

      if (job.status === 'completed' && job.result_url) {
        const imageUrl = resolveImageUrl(job.result_url);
        if (imageUrl) {
          return { imageUrl, prompt };
        }
      }

      if (job.status === 'failed') {
        setErrorMessage('이미지 생성에 실패했습니다.');
        return null;
      }

      setErrorMessage(
        '이미지 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
      );
      return null;
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
