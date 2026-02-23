import type React from "react";
import CloseIcon from "../../assets/close-line.svg";

interface Props {
  projectTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<Props> = ({ projectTitle, onCancel, onConfirm }: Props) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[12px] shadow-xl w-[360px] p-[28px] flex flex-col gap-[20px]">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-bold text-[#0F172B]">프로젝트 삭제</span>
          <button onClick={onCancel}>
            <img src={CloseIcon} className="w-[18px] h-[18px]" />
          </button>
        </div>
        <p className="text-[14px] text-[#475569] leading-[22px]">
          <span className="font-semibold text-[#0F172B]">"{projectTitle}"</span> 프로젝트를
          삭제하시겠습니까?<br />삭제된 프로젝트는 복구할 수 없습니다.
        </p>
        <div className="flex gap-[8px]">
          <button
            onClick={onCancel}
            className="flex-1 py-[10px] border border-[#CBD5E1] rounded-[8px] text-[14px] text-[#475569]"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-[10px] bg-[#E11D48] text-white rounded-[8px] text-[14px] font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};