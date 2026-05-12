import type React from 'react';

import { Button } from '@/commons/components/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Props {
  children: React.ReactNode;
}

// todo Ai 요소 렌더링 방식 변경 필요
const list = [
  '고화질 변경',
  '컬러 복원',
  '배경 제거',
  '배경 변경',
  '유사 이미지 생성',
];

export const AiEffectPopover: React.FC<Props> = ({ children }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-0 w-fit border border-border-neutral overflow-hidden"
      >
        <div className="grid grid-cols-2 p-4 bg-[#F8FAFC] gap-3">
          {list.map((el) => (
            <Button key={el} variant="neutral-outlined" className="!w-full">
              {el}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
