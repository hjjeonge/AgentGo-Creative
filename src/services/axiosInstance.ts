import axios, { AxiosError } from 'axios';

import { clearTokens, getAccessToken } from '../utils/tokenManager';
import type { CommonError } from './type';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 * 모든 API 요청이 보내지기 전에 헤더에 액세스 토큰을 추가합니다.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // FormData인 경우, 브라우저가 자동으로 Content-Type을 설정하도록 헤더를 삭제
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const accessToken = getAccessToken();
    // 토큰이 있으면 헤더에 추가
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * 응답 인터셉터
 * 401 에러 발생 시 토큰 갱신을 시도하고, 실패 시 로그아웃 처리합니다.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<CommonError>) => {
    const originalRequest = error.config as any;

    // 401 세션 만료이면 강제 로그아웃 처리합니다.
    if (error.response?.status === 401 && originalRequest) {
      handleSessionExpiry('세션이 만료되었습니다. 다시 로그인 해주세요.');
    }
    return Promise.reject(error);
  },
);

function handleSessionExpiry(message: string) {
  clearTokens();
  if (window.location.pathname !== '/login') {
    alert(message);
    window.location.href = '/login';
  }
}

export default axiosInstance;
