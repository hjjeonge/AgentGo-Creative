import type React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Props {
  children: React.ReactNode;
}

export const TypographyPopover: React.FC<Props> = ({ children }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-fit">
        <div className="flex flex-col gap-[8px] p-[7px] rounded-[8px] text-[16px] leading-[24px] text-[#0F172B">
          <div className="flex items-center justify-between p-[7px]">
            <span>자간</span>
            <input className="border border-[#CAD5E2] rounded-[6px] p-[7px]" />
          </div>
          <div className="flex items-center justify-between p-[7px]">
            <span className="text-[16px] leading-[24px] text-[#0F172B]">
              행간
            </span>
            <input className="border border-[#CAD5E2] rounded-[6px] p-[7px]" />
          </div>
          <div className="flex items-center justify-between p-[7px]">
            <span className="text-[16px] leading-[24px] text-[#0F172B]">
              장평
            </span>
            <input className="border border-[#CAD5E2] rounded-[6px] p-[7px]" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
