import type React from "react";
import Top from "./../../assets/vertical_align_top.svg";
import Center from "./../../assets/vertical_align_center.svg";
import Bottom from "./../../assets/vertical_align_bottom.svg";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Props {
  children: React.ReactNode;
}

export const VerticalAlignPopover: React.FC<Props> = ({ children }: Props) => {
  const list = [
    { name: "top", img: Top },
    { name: "center", img: Center },
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
              className="flex items-center justify-center w-[40px] h-[40px] p-[3px] cursor-pointer"
            >
              <img src={el.img} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
