import axios, { AxiosError } from 'axios';

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from '@/commons/utils/tokenManager';
import type { CommonError } from '@/commons/types/api';
import { postRefreshToken } from '@/features/auth/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// refresh 제외 대상 API
const AUTH_EXCLUDED_URLS = ['/api/auth/login', '/api/auth/refresh'];

let isRefreshing = false; // refresh 중복 호출 방지용 플래그
let failedQueue: any[] = []; // 대기열 추가

// 대기열에 있는 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
    const requestUrl = originalRequest?.url ?? '';

    // refresh 대상 제외
    if (AUTH_EXCLUDED_URLS.includes(requestUrl)) {
      return Promise.reject(error);
    }

    // 401 세션 만료이면 강제 로그아웃 처리합니다.
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // 이미 refresh 중이라면, 이 요청을 Promise에 담아 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      const refreshToken = getRefreshToken();

      // refresh token 없다면 로그아웃 처리
      if (!refreshToken) {
        handleSessionExpiry('세션이 만료되었습니다. 다시 로그인 해주세요.');
        return;
      }
      isRefreshing = true;

      try {
        const { data } = await postRefreshToken({
          refresh_token: refreshToken,
        });
        const { access_token } = data;

        setAccessToken(access_token);

        // 대기 중이던 요청들에게 새 토큰 전달하며 실행
        processQueue(null, access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        // 갱신 실패 시 대기 중인 요청들도 모두 에러 처리
        processQueue(error, null);
        handleSessionExpiry('세션이 만료되었습니다. 다시 로그인 해주세요.');
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
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
