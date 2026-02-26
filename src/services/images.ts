import { get, post } from "./apiClient";

export interface ImageGenerateRequest {
  prompt?: string;
  concept?: string;
  size?: string;
  targets?: string[];
  reference_urls?: string[];
  prompt_id?: string;
  prompt_params?: Record<string, string>;
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
