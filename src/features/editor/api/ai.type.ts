export interface AIProxyResponse<T = Record<string, unknown>> {
  status: 'success' | 'processing' | 'failed';
  result: T | null;
  meta: Record<string, unknown> | null;
}

export interface KeyVisualResult {
  image_url: string;
  mime_type: string;
  guide_version: number;
  guide_attributes: Record<string, string>;
  guide_change_log: unknown[];
}

export interface KeyVisualParams {
  file: File;
  feedback: string;
  guide_attributes?: Record<string, string>;
  system_prompt?: string;
}

export interface TranslationItem {
  text: string;
  corrected_text: string;
  translation: string;
  rect: [number, number, number, number];
}

export interface MultilingualResult {
  translations: TranslationItem[];
  segment_count: number;
}

export interface MultilingualJobResult {
  job_id: string;
  translations?: TranslationItem[];
  segment_count?: number;
}

export interface DetailCutResult {
  image_base64: string;
  mime_type: string;
  product_name: string;
  target_angle: string;
}

export interface DetailCutParams {
  files: File[];
  product_name: string;
  target_angle: string;
  source_angles?: string[];
}

export interface PersonaVariantItem {
  persona: string;
  image_base64: string;
  mime_type: string;
  copy_text: string;
  ab_test_label: string;
}

export interface PersonaVariantsJobResult {
  job_id: string;
  results?: PersonaVariantItem[];
}

export interface PersonaVariantsParams {
  file: File;
  product_info: string;
  marketing_goal: string;
  personas: string[];
}

export interface CampaignContentResult {
  image_url: string;
  mime_type: string;
  copy_suggestion: string;
  composition_desc: string;
}

export interface CampaignContentParams {
  file: File;
  persona: string;
  appeal_points: string[];
  background_style: string;
  campaign_concept?: string;
}

export interface MultichannelConversionItem {
  format: string;
  width: number;
  height: number;
  image_base64: string;
  mime_type: string;
}

export interface MultichannelConvertResult {
  conversions: MultichannelConversionItem[];
}

export interface MultichannelConvertParams {
  file: File;
  target_formats: string[];
  source_copy?: string;
}

export interface BrandLayoutResult {
  image_url: string;
  mime_type: string;
  layout_applied: string;
  copy_placed: string[];
}

export interface BrandLayoutParams {
  file: File;
  brand_layout_template: string;
  copy_points: string[];
  target_persona: string;
}

export interface LookbookJobResult {
  job_id: string;
  image_base64?: string;
  mime_type?: string;
  style_desc?: string;
}

export interface LookbookParams {
  files: File[];
  space_style: string;
  style_tone: string;
  product_labels?: string[];
}

export interface CrossSellJobResult {
  job_id: string;
  image_base64?: string;
  mime_type?: string;
  style_desc?: string;
}

export interface CrossSellParams {
  files: File[];
  product_names: string[];
  styling_context: string;
  model_image?: File;
}

export interface WebtoonLetteringJobResult {
  job_id: string;
  image_base64?: string;
  mime_type?: string;
}

export interface WebtoonLetteringParams {
  file: File;
  source_lang: string;
  target_lang: string;
  font_auto_match?: boolean;
  balloon_resize?: boolean;
}

export interface InfographicDataResult {
  image_base64: string;
  mime_type: string;
  layout_applied: string;
}

export interface InfographicDataParams {
  products_json: string;
  layout_type: string;
  promo_theme: string;
  headline?: string;
  brand_color?: string;
}

export interface InfographicPdfJobResult {
  job_id: string;
  slides?: Array<{ image_base64: string; mime_type: string; page: number }>;
}

export interface InfographicPdfParams {
  file: File;
}
