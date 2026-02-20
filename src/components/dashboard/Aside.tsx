import type React from "react";
import { RecentProjectItem } from "./RecentProjectItem";
import Arrow from "./../../assets/arrow_down.svg";

interface Props {
  asideOpen: boolean;
  handleAside: () => void;
}

export const Aside: React.FC<Props> = ({ asideOpen, handleAside }: Props) => {
  return (
    <>
      {asideOpen ? (
        <div className="py-[20px] flex flex-col gap-[24px] border-r border-[#569DFF]/20 box-border bg-white opacity-95">
          <div className="flex justify-between items-center px-[20px]">
            <span className="text-[#9CA3AF] text-[11px] font-semibold">
              최근 프로젝트
            </span>
            <button
              onClick={handleAside}
              className="w-[28px] h-[28px] rounded-[6px] border border-[#569DFF]/20 bg-[#F8FAFF]"
            >
              <img />
            </button>
          </div>
          <div className="px-[12px] flex flex-col gap-[8px]">
            <RecentProjectItem />
            <RecentProjectItem />
            <RecentProjectItem />
            <RecentProjectItem />
            <RecentProjectItem />
            <RecentProjectItem />
          </div>
        </div>
      ) : (
        <button
          onClick={handleAside}
          className="absolute left-0 top-[50%] p-[24px_7px] border border-[#62748E] border-[0.8px] border-l-0 rounded-[7px] rounded-l-none bg-[#F8FAFC] shadow-md"
        >
          <img src={Arrow} className="-rotate-90" />
        </button>
      )}
    </>
  );
};
