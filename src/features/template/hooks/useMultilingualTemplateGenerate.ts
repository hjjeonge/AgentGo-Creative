import {
  getMultilingualJobStatus,
  submitMultilingualJob,
} from '@/features/editor/api/ai';
import { buildPrompt } from '@/features/template/utils/buildPrompt';
import { buildTemplateInputs } from '@/features/template/utils/buildTemplateInputs';

import { wait } from './templateGenerate.utils';

import type {
  TemplateGenerateContext,
  TemplateGenerateResult,
} from './templateGenerate.types';

export const useMultilingualTemplateGenerate = ({
  template,
  files,
  getStringValue,
  getTagsValue,
}: TemplateGenerateContext) => {
  const generate = async (): Promise<TemplateGenerateResult> => {
    const sourceImage = files.source_image?.[0];
    if (!sourceImage) {
      throw new Error('원본 이미지를 선택해 주세요.');
    }

    const templateInputs = buildTemplateInputs({
      fields: template.fields,
      uploadedByField: {},
      getStringValue,
      getTagsValue,
    });
    const prompt = buildPrompt(template.title, template.fields, templateInputs);
    const submitRes = await submitMultilingualJob(
      sourceImage,
      getStringValue('source_lang') || 'Korean',
      getStringValue('target_lang') || 'English',
    );

    let job = submitRes.data;
    if (job.status !== 'success') {
      const jobId = job.result?.job_id;
      if (!jobId) {
        throw new Error('다국어 변환 작업 ID를 받지 못했습니다.');
      }

      const maxAttempts = 30;
      for (let i = 0; i < maxAttempts; i++) {
        await wait(2000);
        const response = await getMultilingualJobStatus(jobId);
        job = response.data;
        if (job.status === 'success' || job.status === 'failed') break;
      }
    }

    if (job.status === 'failed') {
      throw new Error('다국어 변환에 실패했습니다.');
    }

    if (job.status !== 'success') {
      throw new Error(
        '다국어 변환 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
      );
    }

    return {
      prompt,
      navigateToEditor: false,
      message: '다국어 변환 작업이 완료되었습니다.',
    };
  };

  return { generate };
};
