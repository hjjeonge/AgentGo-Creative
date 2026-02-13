import type React from "react";
import { CustomSwitch } from "../commons/CustomSwitch";
import { CustomTooltip } from "../commons/CustomTooltip";
import Add from "./../../assets/add.svg";
import Arrow from "./../../assets/arrow_down.svg";
import AlignCenter from "./../../assets/format_align_center.svg";
import Bold from "./../../assets/format_bold.svg";
import TextColor from "./../../assets/format_color_text.svg";
import Highlighter from "./../../assets/format_ink_highlighter.svg";
import Italic from "./../../assets/format_italic.svg";
import LineSpacing from "./../../assets/format_line_spacing.svg";
import ListBulleted from "./../../assets/format_list_bulleted.svg";
import StrikeThrough from "./../../assets/format_strikethrough.svg";
import Underlined from "./../../assets/format_underlined.svg";
import Remove from "./../../assets/remove.svg";
import Satisfied from "./../../assets/sentiment_satisfied.svg";
import VerticalTop from "./../../assets/vertical_align_top.svg";
import { FontFamilySelect } from "./FontFamilySelect";
import { TextAlignPopover } from "./TextAlignPopver";
import { TypographyPopover } from "./TypographyPopover";
import { VerticalAlignPopover } from "./VerticalAlignPopover";

const fontStyle = [
  { name: "bold", img: Bold, tooltip: "굵게" },
  { name: "italic", img: Italic, tooltip: "기울임" },
  { name: "underlined", img: Underlined, tooltip: "밑줄" },
  { name: "strikethrough", img: StrikeThrough, tooltip: "취소선" },
];

const fontDeco = [
  { name: "color", img: TextColor, tooltip: "글자색" },
  { name: "highlighter", img: Highlighter, tooltip: "배경색" },
  { name: "satisfied", img: Satisfied, tooltip: "특수문자" },
];

export const TextEditor: React.FC = () => {
  return (
    <div className="absolute z-[50] top-[140px] right-[195px] rounded-[6px] bg-[#F1F5F9] border border-[#90A1B9] p-[24px] flex flex-col gap-[7px]">
      <div className="flex flex-col gap-[14px]">
        <FontFamilySelect />
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
              <CustomTooltip key={el.name} content={el.tooltip}>
                <button className="flex items-center justify-center border-l border-[#90A1B9] last:border-r-0 first:border-l-0 w-[45px] h-[40px] p-[11px_5px] cursor-pointer">
                  <img src={el.img} />
                </button>
              </CustomTooltip>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-[26px]">
          <div className="flex items-center justify-between flex-1">
            <TextAlignPopover>
              <button className="flex items-center justify-center w-[40px] h-[40px] cursor-pointer">
                <CustomTooltip content={"글자정렬"}>
                  <img src={AlignCenter} />
                </CustomTooltip>
              </button>
            </TextAlignPopover>
            <VerticalAlignPopover>
              <button className="flex items-center justify-center w-[40px] h-[40px] cursor-pointer">
                <CustomTooltip content={"상단정렬"}>
                  <img src={VerticalTop} />
                </CustomTooltip>
              </button>
            </VerticalAlignPopover>
            <TypographyPopover>
              <button className="flex items-center justify-center w-[40px] h-[40px] cursor-pointer">
                <CustomTooltip content={"글자조절"}>
                  <img src={LineSpacing} />
                </CustomTooltip>
              </button>
            </TypographyPopover>
            <CustomTooltip content={"글머리기호"}>
              <button className="flex items-center justify-center w-[40px] h-[40px] cursor-pointer">
                <img src={ListBulleted} />
              </button>
            </CustomTooltip>
          </div>
          <div className="w-[1px] h-[30px] bg-[#90A1B9]" />
          <div className="flex items-center justify-between flex-1">
            {fontDeco.map((el) => (
              <CustomTooltip key={el.name} content={el.tooltip}>
                <button className="flex items-center justify-center w-[40px] h-[40px] cursor-pointer">
                  <img src={el.img} />
                </button>
              </CustomTooltip>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-[#90A1B9]" />
      <div>
        <div className="flex items-center justify-between p-[7px]">
          <div className="flex items-center justify-center gap-[4px]">
            <button className="flex items-center justify-center">
              <img src={Arrow} className="-rotate-90" />
            </button>
            <span>외곽선</span>
          </div>
          <CustomSwitch />
        </div>
        <div className="flex items-center justify-between p-[7px]">
          <div className="flex items-center justify-center gap-[4px]">
            <button className="flex items-center justify-center">
              <img src={Arrow} className="-rotate-90" />
            </button>
            <span>그림자</span>
          </div>
          <CustomSwitch />
        </div>
        <div className="flex items-center justify-between p-[7px]">
          <div className="flex items-center justify-center gap-[4px]">
            <button className="flex items-center justify-center">
              <img src={Arrow} className="-rotate-90" />
            </button>
            <span>곡선</span>
          </div>
          <CustomSwitch />
        </div>
        <div className="flex items-center justify-between p-[7px]">
          <div className="flex items-center justify-center gap-[4px]">
            <button className="flex items-center justify-center">
              <img src={Arrow} className="-rotate-90" />
            </button>
            <span>세로쓰기</span>
          </div>
          <CustomSwitch />
        </div>
      </div>
    </div>
  );
};
