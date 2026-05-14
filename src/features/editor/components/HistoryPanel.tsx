import type React from 'react';
import { X } from 'lucide-react';

import { Button } from '@/commons/components/Button';
import { IconButton } from '@/commons/components/IconButton';
import { HistoryFillIcon } from '@/commons/components/icons/HistoryFillIcon';
import type { HistoryItemRes } from '@/features/project/types';

import { HistoryItem } from './HistoryItem';

interface Props {
  historyOpen: boolean;
  handleWorkHistory: () => void;
  history: HistoryItemRes[];
  onRestore: (entry: HistoryItemRes) => void;
}

export const HistoryPanel: React.FC<Props> = ({
  historyOpen,
  handleWorkHistory,
  history,
  onRestore,
}) => {
  return (
    <>
      {historyOpen ? (
        <aside className="absolute right-0 top-3 bottom-5 z-50 w-[280px] bg-white shrink-0 border border-border-neutral rounded-md border-r-0 rounded-r-none flex flex-col gap-3">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-text-tertiary font-bold text-sm">
              작업이력 ({history.length})
            </span>
            <IconButton variant="primary-plain" onClick={handleWorkHistory}>
              <X size={18} className="text-[#1D293D]" />
            </IconButton>
          </div>
          <div className="flex flex-col gap-[8px] px-[12px] overflow-y-auto flex-1">
            {history.length === 0 ? (
              <div className="flex flex-col gap-2 items-center text-text-tertiary text-sm text-center mt-12">
                <p>작업 이력이 없습니다.</p>
                <p>
                  원하는 장면이나 스타일을
                  <br />
                  생성하세요.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {history.length > 20 ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 text-text-primary text-sm">
                      <p>
                        작업 이력이 최대 20개를 초과했습니다.
                        <br />
                        삭제 후 계속 진행해 주세요.
                      </p>
                      <Button variant="neutral-outlined" size="sm">
                        전체 삭제
                      </Button>
                    </div>
                    <div className="h-[1px] w-full bg-border-neutral" />
                  </div>
                ) : null}
                {history.map((entry) => (
                  <HistoryItem
                    key={entry.id}
                    entry={entry}
                    onClick={onRestore}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>
      ) : (
        <button
          onClick={handleWorkHistory}
          className="absolute right-0 top-[12px] w-[57px] pl-4 h-8 border border-border-neutral border-r-0 rounded-[40px] rounded-r-none bg-white shadow-md hover:bg-[#E2E8F0]"
        >
          <HistoryFillIcon />
        </button>
      )}
    </>
  );
};
