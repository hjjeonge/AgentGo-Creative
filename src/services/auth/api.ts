import axiosInstance from '../axiosInstance';
import type { LoginReq, LoginRes, UserProfileRes } from './type';

// 로그인
export const postLogin = (data: LoginReq) => {
  return axiosInstance.post<LoginRes>('/api/auth/login', data);
};

// 로그아웃
export const postLogout = () => {
  return axiosInstance.post<void>('/api/auth/logout');
};

// 유저 프로필 조회
export const getUserProfile = () => {
  return axiosInstance.get<UserProfileRes>('/api/users/me');
};
