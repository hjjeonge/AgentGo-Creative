import axiosInstance from '../axiosInstance';
import type { FileUploadResponse } from './type';

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post<FileUploadResponse>('/api/files/upload', formData);
};
