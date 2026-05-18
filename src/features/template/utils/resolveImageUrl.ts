import { API_BASE_URL } from '@/services/axiosInstance';

export const resolveImageUrl = (url: string | null | undefined) => {
  if (!url) return null;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  return `${API_BASE_URL}${url}`;
};
