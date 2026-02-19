import type React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Center from "./../../assets/format_align_center.svg";
import Justify from "./../../assets/format_align_justify.svg";
import Left from "./../../assets/format_align_left.svg";
import Right from "./../../assets/format_align_right.svg";

interface Props {
  children: React.ReactNode;
  value?: "left" | "center" | "right" | "justify";
  onChange: (value: "left" | "center" | "right" | "justify") => void;
}

export const TextAlignPopover: React.FC<Props> = ({
  children,
  value,
  onChange,
}: Props) => {
  const list = [
    { name: "center", img: Center },
    { name: "left", img: Left },
    { name: "right", img: Right },
    { name: "justify", img: Justify },
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
              onClick={() => onChange((el.name as Props["value"]) ?? "left")}
            >
              <img src={el.img} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
