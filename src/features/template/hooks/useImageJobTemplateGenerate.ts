import { uploadFile } from '@/features/editor/api/file';
import { generateImage, getImageJob } from '@/features/editor/api/image';
import { buildPrompt } from '@/features/template/utils/buildPrompt';
import {
  buildTemplateInputs,
  extractReferenceUrls,
} from '@/features/template/utils/buildTemplateInputs';
import { resolveImageUrl } from '@/features/template/utils/resolveImageUrl';
import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';
import { wait } from './templateGenerate.utils';

export const useImageJobTemplateGenerate = ({
  template,
  files,
  getStringValue,
  getTagsValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const uploadedByField: Record<string, string[]> = {};

    for (const field of template.fields) {
      if (field.type !== 'file' && field.type !== 'files') continue;

      const selectedFiles = files[field.key] ?? [];
      if (!selectedFiles.length) continue;

      const urls = await Promise.all(
        selectedFiles.map(async (file) => {
          const uploaded = await uploadFile(file);
          return uploaded.file_url;
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
    const prompt = buildPrompt(template.title, template.fields, templateInputs);
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
      throw new Error('이미지 생성에 실패했습니다.');
    }

    throw new Error(
      '이미지 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
    );
  };

  return { generate };
};
