import type React from "react";
import Add from "./../../assets/add.svg";
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
import type { TextObject } from "./EditorCanvas"; // Import TextObject
import { FontFamilySelect } from "./FontFamilySelect";
import { SettingsSwitchRow } from "./SettingsSwitchRow";
import { TextAlignPopover } from "./TextAlignPopver";
import { ToolbarButton } from "./ToolbarButton";
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

const settingMenus = ["외곽선", "그림자", "곡선", "세로쓰기"];

interface TextEditorProps {
  selectedTextObject?: TextObject;
  handleUpdateTextObject: (id: string, updates: Partial<TextObject>) => void; // Updated prop
}

export const TextEditor: React.FC<TextEditorProps> = ({
  selectedTextObject,
  handleUpdateTextObject,
}) => {
  return (
    <div className="absolute z-[50] top-[140px] right-[195px] rounded-[6px] bg-[#F1F5F9] border border-[#90A1B9] p-[24px] flex flex-col gap-[7px]">
      <div className="flex flex-col gap-[14px]">
        <FontFamilySelect
          selectedTextObject={selectedTextObject}
          handleUpdateTextObject={handleUpdateTextObject}
        />
        <div className="flex items-center gap-[28px]">
          <div className="flex items-center border border-[#90A1B9] rounded-[6px] overflow-hidden">
            <button
              className="flex items-center justify-center border-r border-[#90A1B9] last:border-r-0 w-[40px] h-[40px] p-[11px_5px] cursor-pointer"
              onClick={() =>
                selectedTextObject &&
                handleUpdateTextObject(selectedTextObject.id, {
                  fontSize: Math.max(5, selectedTextObject.fontSize - 1),
                })
              }
            >
              <img src={Remove} />
            </button>
            <input
              type="number"
              className="w-full text-center bg-transparent focus:outline-none"
              value={selectedTextObject?.fontSize || 0}
              onChange={(e) =>
                selectedTextObject &&
                handleUpdateTextObject(selectedTextObject.id, {
                  fontSize: parseInt(e.target.value) || 0,
                })
              }
            />
            <button
              className="flex items-center justify-center border-l border-[#90A1B9]  w-[40px] h-[40px] p-[11px_5px] cursor-pointer"
              onClick={() =>
                selectedTextObject &&
                handleUpdateTextObject(selectedTextObject.id, {
                  fontSize: selectedTextObject.fontSize + 1,
                })
              }
            >
              <img src={Add} />
            </button>
          </div>
          <div className="flex items-center border border-[#90A1B9] rounded-[6px] overflow-hidden">
            {fontStyle.map((el) => (
              <ToolbarButton
                key={el.name}
                icon={el.img}
                tooltip={el.tooltip}
                className="border-l border-[#90A1B9] last:border-r-0 first:border-l-0 w-[45px] h-[40px] p-[11px_5px]"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-[26px]">
          <div className="flex items-center justify-between flex-1">
            <TextAlignPopover>
              <ToolbarButton icon={AlignCenter} tooltip="글자정렬" />
            </TextAlignPopover>
            <VerticalAlignPopover>
              <ToolbarButton icon={VerticalTop} tooltip="상단정렬" />
            </VerticalAlignPopover>
            <TypographyPopover>
              <ToolbarButton icon={LineSpacing} tooltip="글자조절" />
            </TypographyPopover>
            <ToolbarButton icon={ListBulleted} tooltip="글머리기호" />
          </div>
          <div className="w-[1px] h-[30px] bg-[#90A1B9]" />
          <div className="flex items-center justify-between flex-1">
            {fontDeco.map((el) => (
              <ToolbarButton key={el.name} icon={el.img} tooltip={el.tooltip} />
            ))}
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-[#90A1B9]" />
      <div>
        {settingMenus.map((menu) => (
          <SettingsSwitchRow key={menu} label={menu} />
        ))}
      </div>
    </div>
  );
};
