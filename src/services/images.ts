import { get, post } from "./apiClient";

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

export async function generateImage(body: ImageGenerateRequest): Promise<ImageGenerateResponse> {
  return post<ImageGenerateResponse>("/api/images/generate", body);
}

export async function getImageJob(jobId: string): Promise<ImageGenerateResponse> {
  return get<ImageGenerateResponse>(`/api/images/jobs/${jobId}`);
}
