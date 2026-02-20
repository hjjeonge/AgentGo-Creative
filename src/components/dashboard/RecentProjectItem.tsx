import type React from "react";

export const RecentProjectItem: React.FC = () => {
  return (
    <div
      className="overflow-hidden rounded-[10px] flex items-center justify-center p-[1px]"
      style={{
        background: `
      radial-gradient(120% 120% at 50% -20%, rgba(86,157,255,0.3) 0%, rgba(86,157,255,0) 60%),
      radial-gradient(100% 100% at 0% 100%, rgba(0,85,233,0.2) 0%, rgba(0,85,233,0) 65%),
      radial-gradient(80% 80% at 100% 100%, rgba(106,20,217,0.25) 0%, rgba(106,20,217,0) 70%),
      #ffffff
    `,
      }}
    >
      <div className=" bg-[#F8FAFF] p-[12px] flex items-center gap-[12px] w-full rounded-[9px]">
        <img className="w-[58px] h-[58px] rounded-[8px]" />
        <div className="flex-1 flex flex-col gap-[4px]">
          <span className="text-[#1E1E1E] text-[14px] leading-[19.88px]">
            title
          </span>
          <div className="flex items-center text-[#90A1B9] text-[12px] leading-[18px]">
            <span>hh:mm:ss</span>
            <span>|</span>
            <span>dd/mm/YYYY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
