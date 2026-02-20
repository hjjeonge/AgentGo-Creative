import type React from "react";
import type { Template as TemplateType } from "./Content";
import { useNavigate } from "react-router-dom";

interface Props {
  template: TemplateType;
}

export const Template: React.FC<Props> = ({ template }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/template")}
      className="flex flex-col justify-between p-[20px] h-[190px] w-[168px] rounded-[14px] border border-[#1447E6] bg-[#EFF6FF] shadow-sm text-[#0F172B] text-left"
    >
      <div className="w-[50px] h-[50px] overflow-hidden">{template.icon}</div>
      <div className="text-[14px] leading-[19.88px] font-bold">
        {template.title}
      </div>
      <div className="text-[12px] leading-[18px]">{template.comment}</div>
    </button>
  );
};
