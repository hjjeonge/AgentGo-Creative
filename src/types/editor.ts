import type { DrawLine, Shape, TextObject } from "../components/editor/EditorCanvas";

export interface CanvasSnapshot {
  lines: DrawLine[];
  shapes: Shape[];
  texts: TextObject[];
  backgroundImage: string | null;
}

export interface HistoryEntry {
  id: string;
  title: string;
  timestamp: string;
  snapshot: CanvasSnapshot;
}

export interface CanvasHandle {
  setBackgroundImage: (url: string | null) => void;
  getSnapshot: () => CanvasSnapshot;
  restoreSnapshot: (snapshot: CanvasSnapshot) => void;
  hasImage: () => boolean;
  clearCanvas: () => void;
}