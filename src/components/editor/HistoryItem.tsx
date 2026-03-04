import type React from "react";
import type { HistoryEntry } from "../../types/editor";

interface Props {
  entry: HistoryEntry;
  onClick: (entry: HistoryEntry) => void;
}

export const HistoryItem: React.FC<Props> = ({ entry, onClick }) => {
  return (
    <div
      className="overflow-hidden rounded-[10px] flex items-center justify-center p-[1px] bg-[linear-gradient(135deg,rgba(86,157,255,0.3)_0%,rgba(0,85,233,0.2)_50%,rgba(106,20,217,0.25)_100%)] box-border cursor-pointer hover:opacity-80"
      onClick={() => onClick(entry)}
    >
      <div className="bg-[#F8FAFF] p-[12px] flex items-center gap-[12px] w-full rounded-[9px]">
        <div className="w-[64px] h-[48px] rounded-[8px] bg-[#E2E8F0] shrink-0 overflow-hidden flex items-center justify-center">
          {entry.snapshot.backgroundImage ? (
            <img
              src={entry.snapshot.backgroundImage}
              className="w-full h-full object-cover"
              alt={entry.title}
            />
          ) : (
            <span className="text-[#90A1B9] text-[10px]">미리보기</span>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-[4px]">
          <span className="text-[#1E1E1E] text-[14px] leading-[19.88px] font-bold truncate">
            {entry.title}
          </span>
          <span className="text-[#90A1B9] text-[12px] leading-[18px]">
            {entry.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};