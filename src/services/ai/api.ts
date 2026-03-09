import axiosInstance from '../axiosInstance';
import type {
  AIProxyResponse,
  DetailCutParams,
  DetailCutResult,
  KeyVisualParams,
  KeyVisualResult,
  MultilingualJobResult,
  MultilingualResult,
} from './type';

export async function generateKeyVisual(
  params: KeyVisualParams,
): Promise<AIProxyResponse<KeyVisualResult>> {
  const form = new FormData();
  form.append('file', params.file);
  form.append('feedback', params.feedback);
  if (params.guide_attributes) {
    form.append('guide_attributes', JSON.stringify(params.guide_attributes));
  }
  if (params.system_prompt) {
    form.append('system_prompt', params.system_prompt);
  }

  const res = await axiosInstance.post<AIProxyResponse<KeyVisualResult>>(
    '/api/ai/key-visual',
    form,
  );
  return res.data;
}

export async function translateMultilingual(
  file: File,
  source_lang = 'Korean',
  target_lang = 'English',
): Promise<AIProxyResponse<MultilingualResult>> {
  const form = new FormData();
  form.append('file', file);
  form.append('source_lang', source_lang);
  form.append('target_lang', target_lang);

  const res = await axiosInstance.post<AIProxyResponse<MultilingualResult>>(
    '/api/ai/multilingual/translate',
    form,
  );
  return res.data;
}

export async function submitMultilingualJob(
  file: File,
  source_lang = 'Korean',
  target_lang = 'English',
): Promise<AIProxyResponse<MultilingualJobResult>> {
  const form = new FormData();
  form.append('file', file);
  form.append('source_lang', source_lang);
  form.append('target_lang', target_lang);

  const res = await axiosInstance.post<AIProxyResponse<MultilingualJobResult>>(
    '/api/ai/multilingual/translate/jobs',
    form,
  );
  return res.data;
}

export async function getMultilingualJobStatus(
  jobId: string,
): Promise<AIProxyResponse<MultilingualJobResult>> {
  const res = await axiosInstance.get<AIProxyResponse<MultilingualJobResult>>(
    `/api/ai/multilingual/translate/jobs/${jobId}`,
  );
  return res.data;
}

export async function renderDetailCut(
  params: DetailCutParams,
): Promise<AIProxyResponse<DetailCutResult>> {
  const form = new FormData();
  params.files.forEach((file) => form.append('files', file));
  form.append('product_name', params.product_name);
  form.append('target_angle', params.target_angle);
  if (params.source_angles) {
    form.append('source_angles', JSON.stringify(params.source_angles));
  }

  const res = await axiosInstance.post<AIProxyResponse<DetailCutResult>>(
    '/api/ai/detail-cut/render',
    form,
  );
  return res.data;
}
