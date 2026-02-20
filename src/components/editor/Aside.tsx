import type React from "react";
import New from "./../../assets/file-new-line.svg";
import Upload from "./../../assets/upload-cloud-2-line.svg";
import AI from "./../../assets/ai.svg";
import Home from "./../../assets/home.svg";
import { useState } from "react";
import { AiToolPanel } from "./AiToolPanel";

export const Aside: React.FC = () => {
  const [aiClick, setAiClick] = useState(false);

  const handleAiTool = () => {
    setAiClick((prev) => !prev);
  };

  return (
    <>
      <aside className="relative flex flex-col justify-between p-[14px_7px] w-[85px] bg-white shrink-0 shadow-[8px_0_8px_-6px_rgba(50,56,62,0.08),12px_0_12px_-6px_rgba(50,56,62,0.08)]">
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
          <button
            className="flex flex-col gap-[4px] items-center"
            onClick={handleAiTool}
          >
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
      {aiClick && (
        <div className="absolute left-[85px] top-0 bottom-0 z-[60] w-fit bg-white border-l border-r border-[#E2E8F0] shadow-[8px_0_8px_-6px_rgba(50,56,62,0.08),12px_0_12px_-6px_rgba(50,56,62,0.08)]">
          <AiToolPanel />
        </div>
      )}
    </>
  );
};
