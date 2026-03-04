import type React from "react";

const list = [
  "고화질 변경",
  "배경 제거",
  "이미지 확장",
  "유사 이미지 생성",
  "배경 변경",
  "흑백사진 컬러복원",
];

interface Props {
  hasImage: boolean;
}

export const AiToolPanel: React.FC<Props> = ({ hasImage }) => {
  return (
    <div className="grid p-[34px] grid-cols-2 gap-[24px]">
      {list.map((el) => (
        <button
          key={el}
          disabled={!hasImage}
          onClick={() => {
            if (!hasImage) return;
            alert(`${el} 기능은 추후 제공될 예정입니다.`);
          }}
          className={`flex flex-col gap-[7px] items-center ${!hasImage ? "opacity-40 cursor-not-allowed" : "hover:opacity-80"}`}
          title={!hasImage ? "캔버스에 이미지를 업로드해 주세요." : el}
        >
          <div className="w-[150px] h-[150px] border border-[#45556C] border-[2px] bg-[#F8FAFC] rounded-[10px] border-dashed"></div>
          <span className="text-[#0F172B] text-[14px] leading-[32px] text-center">
            {el}
          </span>
        </button>
      ))}
    </div>
  );
};
