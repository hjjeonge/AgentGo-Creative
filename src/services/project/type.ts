export interface RecentProjectItem {
  id: string;
  title: string;
  date: string;
  thumbnail?: string | null;
}

export interface ProjectDetailRes {
  id: string;
  title: string;
  thumbnail_url: string | null;
  updated_at: string;
  latest_history_id: string | null;
  snapshot: Record<string, unknown> | null;
}

export interface SaveProjectReq {
  title: string;
  snapshot: Record<string, unknown>;
  thumbnail_url?: string | null;
}

export interface SaveProjectRes {
  id: string;
  title: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  snapshot: Record<string, unknown>;
  created_at: string;
}
