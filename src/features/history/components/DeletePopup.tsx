import type React from 'react';

import { Button } from '@/commons/components/Button';

interface Props {
  title: string;
  onCancel: () => void;
  onRemove: () => void;
  isLoading?: boolean;
}

export const DeletePopup: React.FC<Props> = ({
  title,
  onCancel,
  onRemove,
}: Props) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(18,20,22,0.25)]">
      <div className="bg-white w-150 rounded-md">
        <div className="px-5.5 py-2 border-b border-border-neutral font-bold text-lg text-text-primary">
          프로젝트 삭제
        </div>
        <div className="flex flex-col gap-2 p-6">
          <span className="font-bold text-md text-text-primary">
            정말 삭제할까요?
          </span>
          <span>
            <span className="font-bold">{title}</span>
            프로젝트의 모든 데이터가 영구적으로 삭제됩니다.
            <br />이 작업은 되돌릴 수 없습니다.
          </span>
        </div>
        <div className="flex justify-end px-5.5 py-3.5 gap-2">
          <Button variant="neutral-outlined" onClick={onCancel}>
            취소
          </Button>
          <Button className="bg-[#E7000B]!" onClick={onRemove}>
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};
