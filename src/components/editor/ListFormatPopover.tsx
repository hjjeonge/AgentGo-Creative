import type React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ListBulleted from "./../../assets/format_list_bulleted.svg";
import NumberedList from "./../../assets/format_list_numbered.svg";

interface Props {
  children: React.ReactNode;
  value?: "none" | "ordered" | "unordered";
  onChange: (value: "none" | "ordered" | "unordered") => void;
}

export const ListFOrmatPopover: React.FC<Props> = ({
  children,
  value,
  onChange,
}: Props) => {
  const list = [
    { name: "unordered", img: ListBulleted },
    { name: "ordered", img: NumberedList },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-fit">
        <div className="flex gap-[8px] p-[7px] rounded-[8px]">
          {list.map((el) => (
            <button
              key={el.name}
              className={`flex items-center justify-center w-[40px] h-[40px] p-[3px] cursor-pointer ${value === el.name ? "bg-[#E2E8F0] rounded-[6px]" : ""}`}
              onClick={() => onChange((el.name as Props["value"]) ?? "none")}
            >
              <img src={el.img} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
