import { get } from "./apiClient";

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

export interface RecentProjectsResponse {
  items: RecentProject[];
}

export async function getRecentProjects(): Promise<RecentProject[]> {
  const data = await get<ApiProject[] | RecentProjectsResponse>("/api/projects/recent");
  const items = Array.isArray(data) ? data : data.items || [];
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
