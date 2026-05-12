import type { CanvasSnapshot } from '@/features/editor/types';
import type { HistoryItemRes } from '@/features/project/types';

export const getHistoryTimestamp = () => {
  return new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

export const createHistoryEntry = (
  prompt: string,
  snapshot: CanvasSnapshot,
): HistoryItemRes => {
  return {
    id: `history_${Date.now()}`,
    title: prompt.length > 20 ? `${prompt.slice(0, 20)}…` : prompt,
    timestamp: getHistoryTimestamp(),
    snapshot,
  };
};
