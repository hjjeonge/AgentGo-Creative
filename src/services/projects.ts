import { get, post, put } from "./apiClient";

export interface RecentProject {
  id: string;
  title: string;
  date: string;
  thumbnail?: string | null;
}

interface ApiProject {
  id: string;
  title: string;
  thumbnail_url?: string | null;
  updated_at: string;
}

export interface ProjectSaveRequest {
  title: string;
  snapshot: Record<string, unknown>;
  thumbnail_url?: string | null;
}

export interface ProjectSaveResponse {
  id: string;
  title: string;
}

export interface ProjectDetail {
  id: string;
  title: string;
  thumbnail_url: string | null;
  updated_at: string;
  latest_history_id: string | null;
  snapshot: Record<string, unknown> | null;
}

export interface HistoryEntry {
  id: string;
  title: string;
  snapshot: Record<string, unknown>;
  created_at: string;
}

export async function getRecentProjects(): Promise<RecentProject[]> {
  const data = await get<ApiProject[] | { items: ApiProject[] }>("/api/projects/recent");
  const items: ApiProject[] = Array.isArray(data) ? data : data.items ?? [];
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    date: new Date(item.updated_at).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    thumbnail: item.thumbnail_url || null,
  }));
}

export async function getProjectDetail(projectId: string): Promise<ProjectDetail> {
  return get<ProjectDetail>(`/api/projects/${projectId}`);
}

export async function createProject(body: ProjectSaveRequest): Promise<ProjectSaveResponse> {
  return post<ProjectSaveResponse>("/api/projects", body);
}

export async function updateProject(projectId: string, body: ProjectSaveRequest): Promise<ProjectSaveResponse> {
  return put<ProjectSaveResponse>(`/api/projects/${projectId}`, body);
}

export async function getProjectHistory(projectId: string): Promise<HistoryEntry[]> {
  return get<HistoryEntry[]>(`/api/projects/${projectId}/history`);
}
