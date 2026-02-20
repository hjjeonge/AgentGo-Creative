import type React from "react";
import New from "./../../assets/file-new-line.svg";
import Upload from "./../../assets/upload-cloud-2-line.svg";
import AI from "./../../assets/ai.svg";
import Home from "./../../assets/home.svg";

export const Aside: React.FC = () => {
  return (
    <aside className="flex flex-col justify-between p-[14px_7px] w-[85px] bg-white shrink-0 shadow-md">
      <div className="flex flex-col gap-[34px]">
        <button className="flex flex-col gap-[4px] items-center">
          <img src={New} />
          <span className="text-[#0F172B] text-[14px] leading-[19.88px]">
            새프로젝트
          </span>
        </button>
        <button className="flex flex-col gap-[4px] items-center">
          <img src={Upload} />
          <span className="text-[#0F172B] text-[14px] leading-[19.88px]">
            업로드
          </span>
        </button>
        <button className="flex flex-col gap-[4px] items-center">
          <img src={AI} />
          <span className="text-[#0F172B] text-[14px] leading-[19.88px]">
            AI 도구
          </span>
        </button>
      </div>
      <button className="flex flex-col gap-[4px] items-center">
        <img src={Home} />
        <span className="text-[#0F172B] text-[14px] leading-[19.88px]">
          홈으로
        </span>
      </button>
    </aside>
  );
};
