import { useCallback, useEffect, useState } from 'react';

import {
  CREATE_NEW_PROJECT_CONFIRM_MESSAGE,
  MAX_HISTORY_COUNT,
  MAX_HISTORY_REACHED_MESSAGE,
} from '@/features/editor/constants/editor';
import type { CanvasSnapshot } from '@/features/editor/types';
import { createHistoryEntry } from '@/features/editor/utils/history';
import { normalizeSnapshotForRender } from '@/features/editor/utils/snapshot';
import type { HistoryItemRes } from '@/features/project/types';

interface UseEditorHistoryParams {
  historyEntries?: HistoryItemRes[];
  fallbackImageUrl?: string | null;
  clearProjectCanvas: () => void;
  getCanvasSnapshot: () => CanvasSnapshot | null;
  onClearProjectState: () => void;
}

export const useEditorHistory = ({
  historyEntries,
  fallbackImageUrl,
  clearProjectCanvas,
  getCanvasSnapshot,
  onClearProjectState,
}: UseEditorHistoryParams) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItemRes[]>([]);

  useEffect(() => {
    if (!historyEntries) return;

    setHistory(
      historyEntries.map((entry) => ({
        ...entry,
        snapshot: normalizeSnapshotForRender(entry.snapshot, fallbackImageUrl),
      })),
    );
  }, [fallbackImageUrl, historyEntries]);

  const toggleHistoryPanel = useCallback(() => {
    setIsHistoryOpen((prev) => !prev);
  }, []);

  const startNewProject = useCallback(() => {
    const confirmed = window.confirm(CREATE_NEW_PROJECT_CONFIRM_MESSAGE);
    if (!confirmed) return;

    clearProjectCanvas();
    setHistory([]);
    onClearProjectState();
  }, [clearProjectCanvas, onClearProjectState]);

  const addHistoryEntry = useCallback(
    (prompt: string, snapshotOverride?: CanvasSnapshot) => {
      if (history.length >= MAX_HISTORY_COUNT) {
        window.alert(MAX_HISTORY_REACHED_MESSAGE(MAX_HISTORY_COUNT));
        return null;
      }

      const snapshot = snapshotOverride ?? getCanvasSnapshot();
      if (!snapshot) return null;

      const newEntry = createHistoryEntry(prompt, snapshot);
      setHistory((prev) => [newEntry, ...prev]);
      return { entryId: newEntry.id, snapshot };
    },
    [getCanvasSnapshot, history.length],
  );

  return {
    addHistoryEntry,
    history,
    isHistoryOpen,
    startNewProject,
    toggleHistoryPanel,
  };
};
