import type React from "react";
import { useEffect, useState } from "react";
import { SwitchAccordion } from "../commons/SwitchAccordion";
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
import { ListFOrmatPopover } from "./ListFormatPopover";
import { TextAlignPopover } from "./TextAlignPopver";
import { ToolbarButton } from "./ToolbarButton";
import { TypographyPopover } from "./TypographyPopover";
import { VerticalAlignPopover } from "./VerticalAlignPopover";
import { StrokeContent } from "./StrokeContent";
import { ShadowContent } from "./ShadowContent";

const fontStyle = [
  { name: "bold", img: Bold, tooltip: "굵게" },
  { name: "italic", img: Italic, tooltip: "기울임" },
  { name: "underline", img: Underlined, tooltip: "밑줄" },
  { name: "strikethrough", img: StrikeThrough, tooltip: "취소선" },
];

const fontDeco = [
  { name: "color", img: TextColor, tooltip: "글자색" },
  { name: "highlighter", img: Highlighter, tooltip: "배경색" },
  { name: "satisfied", img: Satisfied, tooltip: "특수문자" },
];

interface TextEditorProps {
  selectedTextObject?: TextObject;
  handleUpdateTextObject: (id: string, updates: Partial<TextObject>) => void; // Updated prop
}

export const TextEditor: React.FC<TextEditorProps> = ({
  selectedTextObject,
  handleUpdateTextObject,
}) => {
  const [strokeOpen, setStrokeOpen] = useState(false);
  const [shadowOpen, setShadowOpen] = useState(false);

  useEffect(() => {
    if (!selectedTextObject) {
      setStrokeOpen(false);
      setShadowOpen(false);
    }
    if (
      selectedTextObject &&
      (selectedTextObject.strokeWidth ?? 0) > 0 &&
      !selectedTextObject.strokeEnabled
    ) {
      handleUpdateTextObject(selectedTextObject.id, { strokeEnabled: true });
    }
    if (selectedTextObject) {
      const hasShadow =
        (selectedTextObject.shadowBlur ?? 0) > 0 ||
        (selectedTextObject.shadowOpacity ?? 0) > 0 ||
        (selectedTextObject.shadowDistance ?? 0) > 0;
      if (hasShadow && !selectedTextObject.shadowEnabled) {
        handleUpdateTextObject(selectedTextObject.id, { shadowEnabled: true });
      }
    }
  }, [
    selectedTextObject?.id,
    selectedTextObject?.strokeWidth,
    selectedTextObject?.strokeEnabled,
    selectedTextObject?.shadowBlur,
    selectedTextObject?.shadowOpacity,
    selectedTextObject?.shadowDistance,
    selectedTextObject?.shadowEnabled,
    handleUpdateTextObject,
  ]);
  const handleStyleToggle = (
    style: "bold" | "italic" | "underline" | "strikethrough",
  ) => {
    if (!selectedTextObject) return;

    if (style === "bold" || style === "italic") {
      const currentStyles = new Set(
        (selectedTextObject.fontStyle || "")
          .split(" ")
          .filter((s) => s && s !== "normal"),
      );

      if (currentStyles.has(style)) {
        currentStyles.delete(style);
      } else {
        currentStyles.add(style);
      }

      let newFontStyle = "";
      if (currentStyles.has("bold")) newFontStyle += "bold ";
      if (currentStyles.has("italic")) newFontStyle += "italic ";

      newFontStyle = newFontStyle.trim();
      if (newFontStyle === "") newFontStyle = "normal";

      handleUpdateTextObject(selectedTextObject.id, {
        fontStyle: newFontStyle,
      });
    } else {
      // underline or strikethrough
      const decorationName =
        style === "underline" ? "underline" : "line-through";
      const currentDecorations = new Set(
        (selectedTextObject.textDecoration || "").split(" ").filter((d) => d),
      );

      if (currentDecorations.has(decorationName)) {
        currentDecorations.delete(decorationName);
      } else {
        currentDecorations.add(decorationName);
      }

      handleUpdateTextObject(selectedTextObject.id, {
        textDecoration: Array.from(currentDecorations).join(" "),
      });
    }
  };

  const settingMenus = [
    {
      name: "외곽선",
      isShow: true,
      contentClassName: "overflow-visible",
      content: (
        <StrokeContent
          stroke={selectedTextObject?.stroke}
          strokeWidth={selectedTextObject?.strokeWidth}
          onChangeStroke={(value) =>
            selectedTextObject &&
            handleUpdateTextObject(selectedTextObject.id, {
              stroke: value,
              strokeEnabled: true,
            })
          }
          onChangeStrokeWidth={(value) =>
            selectedTextObject &&
            handleUpdateTextObject(selectedTextObject.id, {
              strokeWidth: Math.max(0, value),
              strokeEnabled: true,
            })
          }
        />
      ),
    },
    {
      name: "그림자",
      isShow: true,
      contentClassName: "overflow-visible",
      content: (
        <ShadowContent
          shadowColor={selectedTextObject?.shadowColor}
          shadowDirection={selectedTextObject?.shadowDirection}
          shadowOpacity={selectedTextObject?.shadowOpacity}
          shadowDistance={selectedTextObject?.shadowDistance}
          shadowBlur={selectedTextObject?.shadowBlur}
          onChangeShadowColor={(value) =>
            selectedTextObject &&
            handleUpdateTextObject(selectedTextObject.id, {
              shadowColor: value,
              shadowEnabled: true,
            })
          }
          onChangeShadowDirection={(value) => {
            if (!selectedTextObject) return;
            const rad = (value * Math.PI) / 180;
            const distance = selectedTextObject.shadowDistance ?? 0;
            handleUpdateTextObject(selectedTextObject.id, {
              shadowDirection: value,
              shadowOffsetX: Math.cos(rad) * distance,
              shadowOffsetY: Math.sin(rad) * distance,
              shadowEnabled: true,
            });
          }}
          onChangeShadowOpacity={(value) =>
            selectedTextObject &&
            handleUpdateTextObject(selectedTextObject.id, {
              shadowOpacity: value,
              shadowEnabled: true,
            })
          }
          onChangeShadowDistance={(value) => {
            if (!selectedTextObject) return;
            const direction = selectedTextObject.shadowDirection ?? 45;
            const rad = (direction * Math.PI) / 180;
            handleUpdateTextObject(selectedTextObject.id, {
              shadowDistance: value,
              shadowOffsetX: Math.cos(rad) * value,
              shadowOffsetY: Math.sin(rad) * value,
              shadowEnabled: true,
            });
          }}
          onChangeShadowBlur={(value) =>
            selectedTextObject &&
            handleUpdateTextObject(selectedTextObject.id, {
              shadowBlur: value,
              shadowEnabled: true,
            })
          }
        />
      ),
    },
    {
      name: "세로쓰기",
      isShow: false,
      content: null,
    },
  ];

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
                onClick={() => handleStyleToggle(el.name as any)}
                isActive={
                  (el.name === "bold" &&
                    selectedTextObject?.fontStyle?.includes("bold")) ||
                  (el.name === "italic" &&
                    selectedTextObject?.fontStyle?.includes("italic")) ||
                  (el.name === "underline" &&
                    selectedTextObject?.textDecoration?.includes(
                      "underline",
                    )) ||
                  (el.name === "strikethrough" &&
                    selectedTextObject?.textDecoration?.includes(
                      "line-through",
                    )) ||
                  false
                }
                className="border-l border-[#90A1B9] last:border-r-0 first:border-l-0 w-[45px] h-[40px] p-[11px_5px]"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-[26px]">
          <div className="flex items-center justify-between flex-1">
            <TextAlignPopover
              value={selectedTextObject?.align}
              onChange={(value) =>
                selectedTextObject &&
                handleUpdateTextObject(selectedTextObject.id, { align: value })
              }
            >
              <ToolbarButton icon={AlignCenter} tooltip="글자정렬" />
            </TextAlignPopover>
            <VerticalAlignPopover
              value={selectedTextObject?.verticalAlign}
              onChange={(value) =>
                selectedTextObject &&
                handleUpdateTextObject(selectedTextObject.id, {
                  verticalAlign: value,
                })
              }
            >
              <ToolbarButton icon={VerticalTop} tooltip="상단정렬" />
            </VerticalAlignPopover>
            <TypographyPopover
              letterSpacing={selectedTextObject?.letterSpacing}
              lineHeight={selectedTextObject?.lineHeight}
              scaleX={selectedTextObject?.scaleX}
              onChangeLetterSpacing={(value) =>
                selectedTextObject &&
                handleUpdateTextObject(selectedTextObject.id, {
                  letterSpacing: value,
                })
              }
              onChangeLineHeight={(value) =>
                selectedTextObject &&
                handleUpdateTextObject(selectedTextObject.id, {
                  lineHeight: value,
                })
              }
              onChangeScaleX={(value) =>
                selectedTextObject &&
                handleUpdateTextObject(selectedTextObject.id, { scaleX: value })
              }
            >
              <ToolbarButton icon={LineSpacing} tooltip="글자조절" />
            </TypographyPopover>
            <ListFOrmatPopover
              value={selectedTextObject?.listFormat}
              onChange={(value) =>
                selectedTextObject &&
                handleUpdateTextObject(selectedTextObject.id, {
                  listFormat:
                    selectedTextObject.listFormat === value ? "none" : value,
                })
              }
            >
              <ToolbarButton icon={ListBulleted} tooltip="글머리기호" />
            </ListFOrmatPopover>
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
          <SwitchAccordion
            key={menu.name}
            value={menu.name}
            title={menu.name}
            isShow={menu.isShow}
            contentClassName={menu.contentClassName}
            isSwitchOn={
              menu.name === "외곽선"
                ? (selectedTextObject?.strokeEnabled ?? false)
                : menu.name === "그림자"
                  ? (selectedTextObject?.shadowEnabled ?? false)
                  : menu.name === "세로쓰기"
                    ? (selectedTextObject?.verticalWriting ?? false)
                  : undefined
            }
            handleSwitch={
              menu.name === "외곽선"
                ? (checked) => {
                    if (!selectedTextObject) return;
                    if (checked) {
                      handleUpdateTextObject(selectedTextObject.id, {
                        strokeEnabled: true,
                        stroke: selectedTextObject.stroke ?? "#000000",
                        strokeWidth:
                          selectedTextObject.strokeWidth &&
                          selectedTextObject.strokeWidth > 0
                            ? selectedTextObject.strokeWidth
                            : 1,
                      });
                      setStrokeOpen(true);
                    } else {
                      handleUpdateTextObject(selectedTextObject.id, {
                        strokeEnabled: false,
                        stroke: "#000000",
                        strokeWidth: 0,
                      });
                    }
                  }
                : menu.name === "그림자"
                  ? (checked) => {
                      if (!selectedTextObject) return;
                      if (checked) {
                        handleUpdateTextObject(selectedTextObject.id, {
                          shadowEnabled: true,
                          shadowColor:
                            selectedTextObject.shadowColor ?? "#000000",
                          shadowOpacity:
                            selectedTextObject.shadowOpacity ?? 0.5,
                          shadowBlur:
                            selectedTextObject.shadowBlur && selectedTextObject.shadowBlur > 0
                              ? selectedTextObject.shadowBlur
                              : 4,
                          shadowDistance:
                            selectedTextObject.shadowDistance &&
                            selectedTextObject.shadowDistance > 0
                              ? selectedTextObject.shadowDistance
                              : 4,
                        });
                        const direction =
                          selectedTextObject.shadowDirection ?? 45;
                        const distance =
                          selectedTextObject.shadowDistance &&
                          selectedTextObject.shadowDistance > 0
                            ? selectedTextObject.shadowDistance
                            : 4;
                        const rad = (direction * Math.PI) / 180;
                        handleUpdateTextObject(selectedTextObject.id, {
                          shadowOffsetX: Math.cos(rad) * distance,
                          shadowOffsetY: Math.sin(rad) * distance,
                        });
                        setShadowOpen(true);
                      } else {
                        handleUpdateTextObject(selectedTextObject.id, {
                          shadowEnabled: false,
                          shadowColor: "#000000",
                          shadowOpacity: 0,
                          shadowBlur: 0,
                          shadowDistance: 0,
                          shadowOffsetX: 0,
                          shadowOffsetY: 0,
                          shadowDirection: 45,
                        });
                      }
                    }
                : menu.name === "세로쓰기"
                  ? (checked) => {
                      if (!selectedTextObject) return;
                      handleUpdateTextObject(selectedTextObject.id, {
                        verticalWriting: checked,
                      });
                    }
                : undefined
            }
            isOpen={
              menu.name === "외곽선"
                ? strokeOpen
                : menu.name === "그림자"
                  ? shadowOpen
                  : undefined
            }
            handleOpen={
              menu.name === "외곽선"
                ? (open) => setStrokeOpen(open)
                : menu.name === "그림자"
                  ? (open) => setShadowOpen(open)
                  : undefined
            }
          >
            {menu.content}
          </SwitchAccordion>
        ))}
      </div>
    </div>
  );
};
