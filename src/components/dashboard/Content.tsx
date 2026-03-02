import type React from "react";
import { useNavigate } from "react-router-dom";
import { Template } from "./Template";
import { DEFAULT_TEMPLATE_KEY, TEMPLATE_CONFIGS } from "../../constants/templateConfigs";

export interface TemplateCard {
  key: string;
  icon: string;
  title: string;
  comment: string;
}

const list: TemplateCard[] = TEMPLATE_CONFIGS.map((item) => ({
  key: item.key,
  icon: item.icon,
  title: item.title,
  comment: item.comment,
}));

export const Content: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center gap-[40px]">
      <div className="flex flex-col gap-[24px] items-center justify-center">
        <div className="flex flex-col gap-[14px] items-center justify-center">
          <span className="text-[#0F172B] text-[64px] font-medium leading-[85.12px]">
            <span className="text-[#155DFC] font-bold">클로잇</span>님
            안녕하세요
          </span>
          <span className="text-[#0F172B] text-[36px] font-bold leading-[47.88px]">
            무엇을 도와드릴까요?
          </span>
        </div>
        <button
          onClick={() => navigate("/editor")}
          className="bg-[linear-gradient(135deg,#0055E9_0%,#6A14D9_100%)] p-[14px_24px] rounded-[8px] flex items-center gap-[4px] text-[#F8FAFC] text-[17px] font-bold leading-[29.88px] w-fit"
        >
          <span>+</span>
          <span>Create Now</span>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-[24px]">
        {list.map((el) => (
          <Template key={el.key} template={el} />
        ))}
        <div className="flex items-center justify-center w-[168px] h-[190px]">
          <button
            onClick={() => navigate(`/template?template=${DEFAULT_TEMPLATE_KEY}`)}
            className="flex items-center justify-center w-[80px] h-[80px] bg-[#155DFC] rounded-full text-white text-[32px]"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
