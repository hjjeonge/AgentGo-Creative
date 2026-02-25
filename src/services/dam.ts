import { del, download, get, patch, post, upload } from "./apiClient";

export interface FolderNode {
  id: string;
  name: string;
  is_fixed?: boolean;
  children?: FolderNode[];
}

export interface AssetSummary {
  id: string;
  name: string;
  file_type: string;
  file_size: string;
  thumbnail_url?: string | null;
  uploaded_by: string;
  updated_at: string;
}

export interface AssetDetail {
  id: string;
  name: string;
  file_type: string;
  file_url: string;
  file_size: string;
  uploaded_by: string;
  metadata?: Record<string, unknown> | null;
  reference_images?: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface AssetListResponse {
  items: AssetSummary[];
  total: number;
}

export async function getFolderTree(): Promise<FolderNode[]> {
  return get<FolderNode[]>("/api/dam/folders");
}

export async function listAssets(params?: {
  keyword?: string;
  file_type?: string;
  user_name?: string;
  date_from?: string;
  date_to?: string;
  folder_id?: string;
}): Promise<AssetListResponse> {
  const query = params
    ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== "") as [string, string][]).toString()
    : "";
  return get<AssetListResponse>(`/api/dam/assets${query}`);
}

export async function getAssetDetail(assetId: string): Promise<AssetDetail> {
  return get<AssetDetail>(`/api/dam/assets/${assetId}`);
}

export async function renameAsset(assetId: string, name: string): Promise<AssetSummary> {
  return patch<AssetSummary>(`/api/dam/assets/${assetId}`, { name });
}

export async function copyAsset(assetId: string): Promise<AssetDetail> {
  return post<AssetDetail>(`/api/dam/assets/${assetId}/copy`);
}

export async function deleteAsset(assetId: string): Promise<void> {
  await del<void>(`/api/dam/assets/${assetId}`);
}

export function downloadAssetUrl(assetId: string): string {
  return `/api/dam/assets/${assetId}/download`;
}

export async function downloadAsset(assetId: string): Promise<Blob> {
  return download(downloadAssetUrl(assetId));
}

export async function uploadAsset(file: File, name: string, metadata?: Record<string, unknown>, folderId?: string): Promise<AssetDetail> {
  const formData = new FormData();
  formData.append("file", file);

  const query = new URLSearchParams({ name });
  if (metadata) {
    query.set("metadata", JSON.stringify(metadata));
  }
  if (folderId) {
    query.set("folder_id", folderId);
  }

  return upload<AssetDetail>(`/api/dam/assets?${query.toString()}`, formData);
}

export async function updateAssetMetadata(assetId: string, metadata: Record<string, unknown>): Promise<AssetDetail> {
  return patch<AssetDetail>(`/api/dam/assets/${assetId}/metadata`, { metadata });
}
