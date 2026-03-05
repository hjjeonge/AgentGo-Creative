import type React from 'react';
import { useState } from 'react';

interface Props {
  defaultValue: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export const RenameModal: React.FC<Props> = ({
  defaultValue,
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[12px] shadow-xl p-[24px] w-[400px] flex flex-col gap-[16px]">
        <p className="text-[15px] font-semibold text-[#0F172B]">이름 변경</p>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) onConfirm(value.trim());
          }}
          autoFocus
          className="border border-[#CBD5E1] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0F172B] outline-none focus:border-[#155DFC]"
        />
        <div className="flex justify-end gap-[8px]">
          <button
            onClick={onCancel}
            className="px-[16px] py-[8px] border border-[#CBD5E1] text-[#475569] rounded-[8px] text-[13px]"
          >
            취소
          </button>
          <button
            onClick={() => {
              if (value.trim()) onConfirm(value.trim());
            }}
            className="px-[16px] py-[8px] bg-[#155DFC] text-white rounded-[8px] text-[13px] font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
