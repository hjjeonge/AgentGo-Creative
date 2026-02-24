import { upload } from "./apiClient";

export interface FileUploadResponse {
  file_url: string;
  file_name: string;
  file_size: number;
}

export async function uploadFile(file: File): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return upload<FileUploadResponse>("/api/files/upload", formData);
}
