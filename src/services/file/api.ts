import axiosInstance from '../axiosInstance';
import type { FileUploadResponse } from './type';

export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axiosInstance.post<FileUploadResponse>(
    '/api/files/upload',
    formData,
  );
  return res.data;
};
