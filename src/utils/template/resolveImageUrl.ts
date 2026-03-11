const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const resolveImageUrl = (url: string | null | undefined) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE_URL}${url}`;
};
