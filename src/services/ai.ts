import { get, upload } from "./apiClient";

// ── 공통 응답 타입 ───────────────────────────────────────────────────────

export interface AIProxyResponse<T = Record<string, unknown>> {
  status: "success" | "processing" | "failed";
  result: T | null;
  meta: Record<string, unknown> | null;
}

// ── Key Visual ───────────────────────────────────────────────────────────

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

export function generateKeyVisual(
  params: KeyVisualParams
): Promise<AIProxyResponse<KeyVisualResult>> {
  const form = new FormData();
  form.append("file", params.file);
  form.append("feedback", params.feedback);
  if (params.guide_attributes) {
    form.append("guide_attributes", JSON.stringify(params.guide_attributes));
  }
  if (params.system_prompt) {
    form.append("system_prompt", params.system_prompt);
  }
  return upload<AIProxyResponse<KeyVisualResult>>("/api/ai/key-visual", form);
}

// ── Multilingual Translation ─────────────────────────────────────────────

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

export function translateMultilingual(
  file: File,
  source_lang = "Korean",
  target_lang = "English"
): Promise<AIProxyResponse<MultilingualResult>> {
  const form = new FormData();
  form.append("file", file);
  form.append("source_lang", source_lang);
  form.append("target_lang", target_lang);
  return upload<AIProxyResponse<MultilingualResult>>(
    "/api/ai/multilingual/translate",
    form
  );
}

export function submitMultilingualJob(
  file: File,
  source_lang = "Korean",
  target_lang = "English"
): Promise<AIProxyResponse<MultilingualJobResult>> {
  const form = new FormData();
  form.append("file", file);
  form.append("source_lang", source_lang);
  form.append("target_lang", target_lang);
  return upload<AIProxyResponse<MultilingualJobResult>>(
    "/api/ai/multilingual/translate/jobs",
    form
  );
}

export function getMultilingualJobStatus(
  jobId: string
): Promise<AIProxyResponse<MultilingualJobResult>> {
  return get<AIProxyResponse<MultilingualJobResult>>(
    `/api/ai/multilingual/translate/jobs/${jobId}`
  );
}

// ── Detail Cut ───────────────────────────────────────────────────────────

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

export function renderDetailCut(
  params: DetailCutParams
): Promise<AIProxyResponse<DetailCutResult>> {
  const form = new FormData();
  params.files.forEach((f) => form.append("files", f));
  form.append("product_name", params.product_name);
  form.append("target_angle", params.target_angle);
  if (params.source_angles) {
    form.append("source_angles", JSON.stringify(params.source_angles));
  }
  return upload<AIProxyResponse<DetailCutResult>>(
    "/api/ai/detail-cut/render",
    form
  );
}

// ── 유틸리티: base64 → Blob URL 변환 ────────────────────────────────────

export function base64ToBlobUrl(base64: string, mimeType = "image/png"): string {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeType });
  return URL.createObjectURL(blob);
}