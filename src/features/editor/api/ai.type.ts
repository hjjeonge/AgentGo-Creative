export interface AIProxyResponse<T = Record<string, unknown>> {
  status: 'success' | 'processing' | 'failed';
  result: T | null;
  meta: Record<string, unknown> | null;
}

export interface KeyVisualResult {
  image_base64: string;
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
