import axiosInstance from '../axiosInstance';
import type {
  CreateProjectRes,
  HistoryItem,
  ProjectDetailRes,
  RecentProjectItem,
  SaveProjectReq,
  SaveProjectRes,
} from './type';

// 최근 프로젝트 목록 조회
export const getRecentProjects = () => {
  return axiosInstance.get<RecentProjectItem[]>('/api/projects/recent');
};

// 최근 프로젝트 삭제
export const deleteRecentProject = (projectId: string) => {
  return axiosInstance.delete(`/api/projects/recent/${projectId}`);
};

// 프로젝트 상세 조회
export const getProjectDetail = (projectId: string) => {
  return axiosInstance.get<ProjectDetailRes>(`/api/projects/${projectId}`);
};

// 새 프로젝트 생성
export const postNewProject = () => {
  return axiosInstance.post<CreateProjectRes>('/api/projects');
};

// 프로젝트 수정
export const putProject = (projectId: string, data: SaveProjectReq) => {
  return axiosInstance.post<SaveProjectRes>(`/api/projects/${projectId}`, data);
};

// 작업이력 조회
export const getProjectHistory = (projectId: string) => {
  return axiosInstance.get<HistoryItem[]>(`/api/projects/${projectId}/history`);
};
