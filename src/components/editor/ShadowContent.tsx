import type React from "react";

export const ShadowContent: React.FC = () => {
  return (
    <div className="flex flex-col p-[7px] border-b border-[#E2E8F0]  text-[16px] leading-[24px] text-[#0F172B]">
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>색상</span>
        <button className="w-[24px] h-[24px] p-[1px] border border-[#90A1B9] rounded-[4px] box-border">
          <div className="w-full h-full rounded-[3px] bg-black" />
        </button>
      </div>
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>방향</span>
        <input className="border border-[#CAD5E2] rounded-[6px] p-[7px] max-w-[100px]" />
      </div>
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>불투명도</span>
        <input className="border border-[#CAD5E2] rounded-[6px] p-[7px] max-w-[100px]" />
      </div>
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>거리</span>
        <input className="border border-[#CAD5E2] rounded-[6px] p-[7px] max-w-[100px]" />
      </div>
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>흐림</span>
        <input className="border border-[#CAD5E2] rounded-[6px] p-[7px] max-w-[100px]" />
      </div>
    </div>
  );
};
