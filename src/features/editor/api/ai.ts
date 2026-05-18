import axiosInstance, { AI_REQUEST_TIMEOUT_MS } from '@/services/axiosInstance';

import type {
  AIProxyResponse,
  BrandLayoutParams,
  BrandLayoutResult,
  CampaignContentParams,
  CampaignContentResult,
  CrossSellJobResult,
  CrossSellParams,
  DetailCutParams,
  DetailCutResult,
  InfographicDataParams,
  InfographicDataResult,
  InfographicPdfJobResult,
  InfographicPdfParams,
  KeyVisualParams,
  KeyVisualResult,
  LookbookJobResult,
  LookbookParams,
  MultilingualJobResult,
  MultilingualResult,
  MultichannelConvertParams,
  MultichannelConvertResult,
  PersonaVariantsJobResult,
  PersonaVariantsParams,
  WebtoonLetteringJobResult,
  WebtoonLetteringParams,
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
  if (params.output_format) {
    form.append('output_format', params.output_format);
  }
  if (params.platform) {
    form.append('platform', params.platform);
  }

  return axiosInstance.post<AIProxyResponse<KeyVisualResult>>(
    '/api/ai/key-visual',
    form,
    { timeout: AI_REQUEST_TIMEOUT_MS },
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
    { timeout: AI_REQUEST_TIMEOUT_MS },
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
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const getMultilingualJobStatus = (jobId: string) => {
  return axiosInstance.get<AIProxyResponse<MultilingualJobResult>>(
    `/api/ai/multilingual/translate/jobs/${jobId}`,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const generateBrandLayout = (params: BrandLayoutParams) => {
  const form = new FormData();
  form.append('file', params.file);
  form.append('brand_layout_template', params.brand_layout_template);
  form.append('copy_points', JSON.stringify(params.copy_points));
  form.append('target_persona', params.target_persona);

  return axiosInstance.post<AIProxyResponse<BrandLayoutResult>>(
    '/api/ai/detail-catalog/brand-layout',
    form,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const submitLookbookJob = (params: LookbookParams) => {
  const form = new FormData();
  params.files.forEach((f) => form.append('files', f));
  form.append('space_style', params.space_style);
  form.append('style_tone', params.style_tone);
  if (params.product_labels) {
    form.append('product_labels', JSON.stringify(params.product_labels));
  }

  return axiosInstance.post<AIProxyResponse<LookbookJobResult>>(
    '/api/ai/detail-catalog/lookbook',
    form,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const getLookbookJobStatus = (jobId: string) => {
  return axiosInstance.get<AIProxyResponse<LookbookJobResult>>(
    `/api/ai/detail-catalog/lookbook/jobs/${jobId}`,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const convertMultichannel = (params: MultichannelConvertParams) => {
  const form = new FormData();
  form.append('file', params.file);
  form.append('target_formats', JSON.stringify(params.target_formats));
  if (params.source_copy) {
    form.append('source_copy', params.source_copy);
  }

  return axiosInstance.post<AIProxyResponse<MultichannelConvertResult>>(
    '/api/ai/multichannel/convert',
    form,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const generateCampaignContent = (params: CampaignContentParams) => {
  const form = new FormData();
  form.append('file', params.file);
  form.append('persona', params.persona);
  form.append('appeal_points', JSON.stringify(params.appeal_points));
  form.append('background_style', params.background_style);
  if (params.campaign_concept) {
    form.append('campaign_concept', params.campaign_concept);
  }

  return axiosInstance.post<AIProxyResponse<CampaignContentResult>>(
    '/api/ai/campaign/generate',
    form,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const submitPersonaVariantsJob = (params: PersonaVariantsParams) => {
  const form = new FormData();
  form.append('file', params.file);
  form.append('product_info', params.product_info);
  form.append('marketing_goal', params.marketing_goal);
  form.append('personas', JSON.stringify(params.personas));

  return axiosInstance.post<AIProxyResponse<PersonaVariantsJobResult>>(
    '/api/ai/sns-creative/persona-variants',
    form,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const getPersonaVariantsJobStatus = (jobId: string) => {
  return axiosInstance.get<AIProxyResponse<PersonaVariantsJobResult>>(
    `/api/ai/sns-creative/persona-variants/jobs/${jobId}`,
    { timeout: AI_REQUEST_TIMEOUT_MS },
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
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const submitCrossSellJob = (params: CrossSellParams) => {
  const form = new FormData();
  params.files.forEach((f) => form.append('files', f));
  form.append('product_names', JSON.stringify(params.product_names));
  form.append('styling_context', params.styling_context);
  if (params.model_image) {
    form.append('model_image', params.model_image);
  }

  return axiosInstance.post<AIProxyResponse<CrossSellJobResult>>(
    '/api/ai/studio-shoot/cross-sell',
    form,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const getCrossSellJobStatus = (jobId: string) => {
  return axiosInstance.get<AIProxyResponse<CrossSellJobResult>>(
    `/api/ai/studio-shoot/cross-sell/jobs/${jobId}`,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const submitWebtoonLetteringJob = (params: WebtoonLetteringParams) => {
  const form = new FormData();
  form.append('file', params.file);
  form.append('source_lang', params.source_lang);
  form.append('target_lang', params.target_lang);
  if (params.font_auto_match !== undefined) {
    form.append('font_auto_match', String(params.font_auto_match));
  }
  if (params.balloon_resize !== undefined) {
    form.append('balloon_resize', String(params.balloon_resize));
  }

  return axiosInstance.post<AIProxyResponse<WebtoonLetteringJobResult>>(
    '/api/ai/multilingual/webtoon-lettering',
    form,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const getWebtoonLetteringJobStatus = (jobId: string) => {
  return axiosInstance.get<AIProxyResponse<WebtoonLetteringJobResult>>(
    `/api/ai/multilingual/webtoon-lettering/jobs/${jobId}`,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const generateInfographicFromData = (params: InfographicDataParams) => {
  return axiosInstance.post<AIProxyResponse<InfographicDataResult>>(
    '/api/ai/infographic/from-data',
    params,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const submitInfographicPdfJob = (params: InfographicPdfParams) => {
  const form = new FormData();
  form.append('file', params.file);

  return axiosInstance.post<AIProxyResponse<InfographicPdfJobResult>>(
    '/api/ai/infographic/from-pdf',
    form,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};

export const getInfographicPdfJobStatus = (jobId: string) => {
  return axiosInstance.get<AIProxyResponse<InfographicPdfJobResult>>(
    `/api/ai/infographic/from-pdf/jobs/${jobId}`,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
};
