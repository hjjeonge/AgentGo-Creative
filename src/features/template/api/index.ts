import axiosInstance from '@/services/axiosInstance';
import type {
  CreateNewTemplateReq,
  FavoriteTemplateRes,
  TemplateRes,
} from '../types';

// 즐겨찾는 템플릿 목록 조회 -> 검색 가능해야함
export const getFavoriteTemplates = () => {
  return axiosInstance.get<FavoriteTemplateRes[]>(`/api/templates/favorites`);
};

// 전체 템플릿 목록 조회
export const getTemplates = () => {
  return axiosInstance.get<TemplateRes[]>(`/api/templates`);
};

// 새 템플릿 추가 요청 -> 템플릿 페이지에서 이미지 생성하는 로직이랑 동일한 로직인지...?
export const postNewTemplate = (data: CreateNewTemplateReq) => {
  return axiosInstance.post('/api/templates', data);
};

// 즐켜찾는 템플릿 추가 요청
export const postFavoriteTemplate = (templateId: string) => {
  return axiosInstance.post(`/api/templates/favorites/${templateId}`);
};

// 즐겨찾는 템플릿 해제 요청
export const deleteFavoriteTemplate = (templateId: string) => {
  return axiosInstance.delete(`/api/templates/favorites/${templateId}`);
};

// 템플릿 삭제 요청
export const deleteTemplate = (templateId: string) => {
  return axiosInstance.delete(`/api/templates/${templateId}`);
};
