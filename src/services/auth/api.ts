import axiosInstance from '../axiosInstance';
import type {
  LoginReq,
  LoginRes,
  LogoutReq,
  RefreshTokenReq,
  UserProfileRes,
} from './type';

// 로그인
export const postLogin = (data: LoginReq) => {
  return axiosInstance.post<LoginRes>('/api/auth/login', data);
};

// 로그아웃
export const postLogout = (data: LogoutReq) => {
  return axiosInstance.post<void>('/api/auth/logout', data);
};

// 유저 프로필 조회
export const getUserProfile = () => {
  return axiosInstance.get<UserProfileRes>('/api/users/me');
};

// 토큰 재발급
export const postRefreshToken = (data: RefreshTokenReq) => {
  return axiosInstance.post<LoginRes>('/api/auth/refresh', data);
};
