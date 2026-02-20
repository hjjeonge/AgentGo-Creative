import type React from "react";
import Dots from "./../../assets/dots.svg";

export const UserCard: React.FC = () => {
  return (
    <div className="w-[270px] h-[42px] p-[14px] rounded-[8px] border border-[#569DFF]/20 bg-[#F8FAFF] flex items-center justify-between">
      <div className="w-[28px] h-[28px] bg-[linear-gradient(135deg,#0055E9_0%,#6A14D9_100%)] flex items-center justify-center rounded-full text-[12px] text-white leading-[18px] font-bold">
        클
      </div>
      <div className="flex items-center gap-[2px]">
        <span className="text-[#1E1E1E] text-[14px] font-semibold">클로잇</span>
        <span className="text-[#9CA3AF] text-[12px]">
          cloit.genai@itcen.com
        </span>
      </div>
      <button>
        <img src={Dots} />
      </button>
    </div>
  );
};
