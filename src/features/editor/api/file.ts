import axiosInstance from '@/services/axiosInstance';
import type { FileUploadResponse } from './file.type';

export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axiosInstance.post<FileUploadResponse>(
    '/api/files/upload',
    formData,
  );
  return res.data;
};
