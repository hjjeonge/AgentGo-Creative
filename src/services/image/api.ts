import axiosInstance from '../axiosInstance';
import type { ImageGenerateRequest, ImageGenerateResponse } from './type';

export const generateImage = (data: ImageGenerateRequest) => {
  return axiosInstance.post<ImageGenerateResponse>(
    '/api/images/generate',
    data,
  );
};

export const getImageJob = (jobId: string) => {
  return axiosInstance.get<ImageGenerateResponse>(`/api/images/jobs/${jobId}`);
};
