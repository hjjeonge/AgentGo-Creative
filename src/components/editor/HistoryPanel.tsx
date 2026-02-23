import type React from "react";
import Collapse from "./../../assets/Collapse.svg";
import Arrow from "./../../assets/arrow_down.svg";
import { HistoryItem } from "./HistoryItem";
import type { HistoryEntry } from "../../types/editor";

interface Props {
  historyOpen: boolean;
  handleWorkHistory: () => void;
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
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
        <aside className="w-[280px] bg-[#fff]/ shrink-0 border-l border-[#569DFF]/20 py-[20px] flex flex-col gap-[24px]">
          <div className="flex items-center justify-between px-[20px]">
            <span className="text-[#9CA3AF] text-[12px] leading-[18px]">
              작업이력 ({history.length}/20)
            </span>
            <button
              onClick={handleWorkHistory}
              className="w-[28px] h-[28px] rounded-[6px] border border-[#569DFF]/20 bg-[#F8FAFF] flex items-center justify-center"
            >
              <img src={Collapse} />
            </button>
          </div>
          <div className="flex flex-col gap-[8px] px-[12px] overflow-y-auto flex-1">
            {history.length === 0 ? (
              <p className="text-[#94A3B8] text-[13px] text-center mt-[20px]">
                아직 작업 이력이 없습니다.
              </p>
            ) : (
              history.map((entry) => (
                <HistoryItem key={entry.id} entry={entry} onClick={onRestore} />
              ))
            )}
          </div>
        </aside>
      ) : (
        <button
          onClick={handleWorkHistory}
          className="absolute right-0 top-[50%] p-[24px_7px] border border-[#62748E] border-[0.8px] border-r-0 rounded-[7px] rounded-r-none bg-[#F8FAFC] shadow-md"
        >
          <img src={Arrow} className="rotate-90" />
        </button>
      )}
    </>
  );
};