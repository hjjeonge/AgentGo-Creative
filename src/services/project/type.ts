import type { DrawLine, Shape, TextObject } from '../../types/editor';

export interface RecentProjectItem {
  id: string;
  title: string;
  date: string;
  thumbnail?: string | null;
}

export interface CreateProjectRes {
  projectId: string;
}

export interface CanvasSnapshot {
  lines: DrawLine[];
  shapes: Shape[];
  texts: TextObject[];
  backgroundImage: string | null;
}

export interface ProjectDetailRes {
  id: string;
  title: string;
  thumbnail_url: string | null;
  updated_at: string;
  latest_history_id: string | null;
  snapshot: CanvasSnapshot | null; // snapShot 이 어떻게 오는거지?
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

export interface HistoryItemRes {
  id: string;
  title: string;
  snapshot: CanvasSnapshot;
  timestamp: string;
}
