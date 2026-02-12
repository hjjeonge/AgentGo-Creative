import type React from "react";
import Arrow from "./../../assets/arrow_down.svg";
import Bold from "./../../assets/format_bold.svg";
import Italic from "./../../assets/format_italic.svg";
import Underlined from "./../../assets/format_underlined.svg";
import StrikeThrough from "./../../assets/format_strikethrough.svg";
import Remove from "./../../assets/remove.svg";
import Add from "./../../assets/add.svg";
import AlignCenter from "./../../assets/format_align_center.svg";
import VerticalTop from "./../../assets/vertical_align_top.svg";
import LineSpacing from "./../../assets/format_line_spacing.svg";
import ListBulleted from "./../../assets/format_list_bulleted.svg";
import TextColor from "./../../assets/format_color_text.svg";
import Highlighter from "./../../assets/format_ink_highlighter.svg";
import Satisfied from "./../../assets/sentiment_satisfied.svg";

const fontStyle = [
  { name: "bold", img: Bold },
  { name: "italic", img: Italic },
  { name: "underlined", img: Underlined },
  { name: "strikethrough", img: StrikeThrough },
];

const fontAlign = [
  { name: "align", img: AlignCenter },
  { name: "vertical", img: VerticalTop },
  { name: "spacing", img: LineSpacing },
  { name: "bulleted", img: ListBulleted },
];

const fontDeco = [
  { name: "color", img: TextColor },
  { name: "highlighter", img: Highlighter },
  { name: "satisfied", img: Satisfied },
];

export const TextEditor: React.FC = () => {
  return (
    <div className="absolute z-[50] top-[140px] right-[195px] rounded-[6px] bg-[#F1F5F9] border border-[#90A1B9] p-[24px] flex flex-col gap-[7px]">
      <div className="flex flex-col gap-[14px]">
        <button className="border border-[#90A1B9] rounded-[6px] p-[14px] flex items-center justify-between">
          <span>나눔고딕</span>
          <img src={Arrow} />
        </button>
        <div className="flex items-center gap-[28px]">
          <div className="flex items-center border border-[#90A1B9] rounded-[6px] overflow-hidden">
            <button className="flex items-center justify-center border-r border-[#90A1B9] last:border-r-0 w-[40px] h-[40px] p-[11px_5px] cursor-pointer">
              <img src={Remove} />
            </button>
            <input className="" />
            <button className="flex items-center justify-center border-l border-[#90A1B9]  w-[40px] h-[40px] p-[11px_5px] cursor-pointer">
              <img src={Add} />
            </button>
          </div>
          <div className="flex items-center border border-[#90A1B9] rounded-[6px] overflow-hidden">
            {fontStyle.map((el) => (
              <button
                key={el.name}
                className="flex items-center justify-center border-l border-[#90A1B9] last:border-r-0 first:border-l-0 w-[45px] h-[40px] p-[11px_5px] cursor-pointer"
              >
                <img src={el.img} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-[26px]">
          <div className="flex items-center justify-between flex-1">
            {fontAlign.map((el) => (
              <button
                key={el.name}
                className="flex items-center justify-center w-[40px] h-[40px] cursor-pointer"
              >
                <img src={el.img} />
              </button>
            ))}
          </div>
          <div className="w-[1px] h-[30px] bg-[#90A1B9]" />
          <div className="flex items-center justify-between flex-1">
            {fontDeco.map((el) => (
              <button
                key={el.name}
                className="flex items-center justify-center w-[40px] h-[40px] cursor-pointer"
              >
                <img src={el.img} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-[#90A1B9]" />
      <div>
        <div>외곽선</div>
        <div>그림자</div>
        <div>곡선</div>
        <div>세로쓰기</div>
      </div>
    </div>
  );
};
