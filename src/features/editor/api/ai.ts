import axiosInstance from '@/services/axiosInstance';
import type {
  AIProxyResponse,
  DetailCutParams,
  DetailCutResult,
  KeyVisualParams,
  KeyVisualResult,
  MultilingualJobResult,
  MultilingualResult,
} from './ai.type';

export const generateKeyVisual = (params: KeyVisualParams) => {
  const form = new FormData();
  form.append('file', params.file);
  form.append('feedback', params.feedback);
  if (params.guide_attributes) {
    form.append('guide_attributes', JSON.stringify(params.guide_attributes));
  }
  if (params.system_prompt) {
    form.append('system_prompt', params.system_prompt);
  }

  return axiosInstance.post<AIProxyResponse<KeyVisualResult>>(
    '/api/ai/key-visual',
    form,
  );
};

export const translateMultilingual = (
  file: File,
  source_lang = 'Korean',
  target_lang = 'English',
) => {
  const form = new FormData();
  form.append('file', file);
  form.append('source_lang', source_lang);
  form.append('target_lang', target_lang);

  return axiosInstance.post<AIProxyResponse<MultilingualResult>>(
    '/api/ai/multilingual/translate',
    form,
  );
};

export const submitMultilingualJob = (
  file: File,
  source_lang = 'Korean',
  target_lang = 'English',
) => {
  const form = new FormData();
  form.append('file', file);
  form.append('source_lang', source_lang);
  form.append('target_lang', target_lang);

  return axiosInstance.post<AIProxyResponse<MultilingualJobResult>>(
    '/api/ai/multilingual/translate/jobs',
    form,
  );
};

export const getMultilingualJobStatus = (jobId: string) => {
  return axiosInstance.get<AIProxyResponse<MultilingualJobResult>>(
    `/api/ai/multilingual/translate/jobs/${jobId}`,
  );
};

export const renderDetailCut = (params: DetailCutParams) => {
  const form = new FormData();
  params.files.forEach((file) => form.append('files', file));
  form.append('product_name', params.product_name);
  form.append('target_angle', params.target_angle);
  if (params.source_angles) {
    form.append('source_angles', JSON.stringify(params.source_angles));
  }

  return axiosInstance.post<AIProxyResponse<DetailCutResult>>(
    '/api/ai/detail-cut/render',
    form,
  );
};
