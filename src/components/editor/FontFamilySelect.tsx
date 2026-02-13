import type React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const FontFamilySelect: React.FC = () => {
  return (
    <Select>
      <SelectTrigger className="border border-[#90A1B9] rounded-[6px] w-full focus:outline-0 p-[14px] h-[52px]">
        <SelectValue placeholder="글씨체 선택" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          <SelectItem value="1">글씨체 1</SelectItem>
          <SelectItem value="2">글씨체 2</SelectItem>
          <SelectItem value="3">글씨체 3</SelectItem>
          <SelectItem value="4">글씨체 4</SelectItem>
          <SelectItem value="5">글씨체 5</SelectItem>
          <SelectItem value="6">글씨체 6</SelectItem>
          <SelectItem value="7">글씨체 7</SelectItem>
          <SelectItem value="8">글씨체 8</SelectItem>
          <SelectItem value="9">글씨체 9</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
