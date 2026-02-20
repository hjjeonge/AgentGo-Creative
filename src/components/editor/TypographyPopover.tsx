import type React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Props {
  children: React.ReactNode;
  letterSpacing?: number;
  lineHeight?: number;
  scaleX?: number;
  onChangeLetterSpacing: (value: number) => void;
  onChangeLineHeight: (value: number) => void;
  onChangeScaleX: (value: number) => void;
}

export const TypographyPopover: React.FC<Props> = ({
  children,
  letterSpacing,
  lineHeight,
  scaleX,
  onChangeLetterSpacing,
  onChangeLineHeight,
  onChangeScaleX,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-fit">
        <div className="flex flex-col gap-[8px] p-[7px] rounded-[8px] text-[16px] leading-[24px] text-[#0F172B">
          <div className="flex items-center justify-between p-[7px]">
            <span>자간</span>
            <input
              type="number"
              value={letterSpacing ?? 0}
              onChange={(e) =>
                onChangeLetterSpacing(parseFloat(e.target.value) || 0)
              }
              className="border border-[#CAD5E2] rounded-[6px] p-[7px]"
            />
          </div>
          <div className="flex items-center justify-between p-[7px]">
            <span className="text-[16px] leading-[24px] text-[#0F172B]">
              행간
            </span>
            <input
              type="number"
              step="0.1"
              value={lineHeight ?? 1.2}
              onChange={(e) =>
                onChangeLineHeight(Math.max(0.1, parseFloat(e.target.value) || 0))
              }
              className="border border-[#CAD5E2] rounded-[6px] p-[7px]"
            />
          </div>
          <div className="flex items-center justify-between p-[7px]">
            <span className="text-[16px] leading-[24px] text-[#0F172B]">
              장평
            </span>
            <input
              type="number"
              step="0.1"
              value={scaleX ?? 1}
              onChange={(e) =>
                onChangeScaleX(Math.max(0.1, parseFloat(e.target.value) || 0))
              }
              className="border border-[#CAD5E2] rounded-[6px] p-[7px]"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
