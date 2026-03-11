import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/auth';

/**
 * 액세스 토큰과 리프레시 토큰을 localStorage에 저장합니다.
 * @param accessToken 저장할 액세스 토큰
 * @param refreshToken 저장할 리프레시 토큰
 */
export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
};

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
};

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
};

/**
 * localStorage에서 액세스 토큰을 가져옵니다.
 * @returns 저장된 액세스 토큰 또는 null
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN);
};

/**
 * localStorage에서 리프레시 토큰을 가져옵니다.
 * @returns 저장된 리프레시 토큰 또는 null
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN);
};

/**
 * localStorage에서 모든 토큰을 삭제합니다.
 */
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};
