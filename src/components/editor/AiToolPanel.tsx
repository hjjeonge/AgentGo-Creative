import type React from "react";

const list = [
  "고화질 변경",
  "배경 제거",
  "이미지 확장",
  "유사 이미지 생성",
  "배경 변경",
  "흑백사진 컬러복원",
];

export const AiToolPanel: React.FC = () => {
  return (
    <div className="grid p-[34px] grid-cols-2 gap-[24px]">
      {list.map((el) => (
        <div key={el} className="flex flex-col gap-[7px]">
          <div className="w-[170px] h-[170px] border border-[#45556C] border-[2px] bg-[#F8FAFC] rounded-[10px] border-dashed"></div>
          <span className="text-[#0F172B] text-[16px] leading-[32px] text-center">
            {el}
          </span>
        </div>
      ))}
    </div>
  );
};
