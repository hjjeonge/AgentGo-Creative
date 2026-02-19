import type React from "react";
import Top from "./../../assets/vertical_align_top.svg";
import Center from "./../../assets/vertical_align_center.svg";
import Bottom from "./../../assets/vertical_align_bottom.svg";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Props {
  children: React.ReactNode;
  value?: "top" | "middle" | "bottom";
  onChange: (value: "top" | "middle" | "bottom") => void;
}

export const VerticalAlignPopover: React.FC<Props> = ({
  children,
  value,
  onChange,
}: Props) => {
  const list = [
    { name: "top", img: Top },
    { name: "middle", img: Center },
    { name: "bottom", img: Bottom },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-fit">
        <div className="flex gap-[8px] p-[7px] rounded-[8px]">
          {list.map((el) => (
            <button
              key={el.name}
              className={`flex items-center justify-center w-[40px] h-[40px] p-[3px] ${value === el.name ? "bg-[#E2E8F0] rounded-[6px]" : ""}`}
              onClick={() => onChange((el.name as Props["value"]) ?? "top")}
            >
              <img src={el.img} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
