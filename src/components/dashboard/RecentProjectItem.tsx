import type React from "react";

export const RecentProjectItem: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-[10px] flex items-center justify-center p-[1px] bg-[linear-gradient(135deg,rgba(86,157,255,0.3)_0%,rgba(0,85,233,0.2)_50%,rgba(106,20,217,0.25)_100%)] box-border">
      <div className=" bg-[#F8FAFF] p-[12px] flex items-center gap-[12px] w-full rounded-[9px]">
        <img
          className="w-[58px] h-[58px] rounded-[8px]"
          src="https://images.unsplash.com/photo-1770034285769-4a5a3f410346?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8"
        />
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
