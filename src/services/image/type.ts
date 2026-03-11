export interface ImageGenerateRequest {
  brand_guideline_id?: string;
  prompt?: string;
  concept?: string;
  size?: string;
  targets?: string[];
  reference_urls?: string[];
  template_key?: string;
  template_name?: string;
  template_inputs?: Record<string, string | string[]>;
}

export interface ImageGenerateResponse {
  job_id: string;
  status: string;
  result_url?: string | null;
}
