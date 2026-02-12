import React, { act, useEffect, useRef, useState } from "react";
import { ClickIcon } from "../icons/ClickIcon";
import { DiagramIcon } from "../icons/DiagramIcon";
import { EraserIcon } from "../icons/EraserIcon";
import { PencilIcon } from "../icons/PencilIcon";
import { ShapeIcon } from "../icons/ShapeIcon";
import { TextIcon } from "../icons/TextIcon";
import { ToolButton } from "./ToolButton";
import { ColorPalette } from "../commons/ColorPalette";
import { getPenColorImg, getPenStrokeWidthImg } from "../../utils/getImage";

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  penStrokeWidth: number;
  handlePenStrokeWidth: (value: number) => void;
  penStrokeColor: string;
  handlePenStrokeColor: (value: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
  penStrokeWidth,
  handlePenStrokeWidth,
  penStrokeColor,
  handlePenStrokeColor,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [colorPaletteOpen, setColorPaletteOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setColorPaletteOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const tools = [
    { tool: "mouse", icon: <ClickIcon /> },
    { tool: "pen", icon: <PencilIcon /> },
    { tool: "eraser", icon: <EraserIcon /> },
    { tool: "diagram", icon: <DiagramIcon /> },
    { tool: "shape", icon: <ShapeIcon /> },
    { tool: "text", icon: <TextIcon /> },
  ];
  const penStrokeWidths = [2, 3, 5, 6];
  const displayColors = ["#E7000B", "#155DFC", "#FFD230", "empty"];

  const onClickColorOption = (value: string) => {
    if (value === "empty") {
      setColorPaletteOpen(true);
      return;
    }
    handlePenStrokeColor(value);
  };

  return (
    <div className="flex flex-col gap-[7px] items-center mt-[40px] mb-[40px]">
      <div className="flex justify-around w-[584px] p-[14px_18px] bg-white rounded-[24px] border border-[#90A1B9] shadow-md">
        {tools.map((el) => (
          <ToolButton
            key={el.tool}
            toolName={el.tool}
            activeTool={activeTool}
            icon={el.icon}
            label={el.tool}
            onToolChange={onToolChange}
          />
        ))}
      </div>
      {(activeTool === "pen" || activeTool === "eraser") && (
        <div
          ref={wrapperRef}
          className="relative border flex items-center gap-[12px] border-[#90A1B9] p-[8px_10px] rounded-[6px] bg-[#F1F5F9]"
        >
          {penStrokeWidths.map((el) => (
            <button
              key={el}
              className={`w-[34px] h-[34px] flex items-center justify-center cursor-pointer ${penStrokeWidth === el && "bg-[#CAD5E2] rounded-[6px]"}`}
              onClick={() => handlePenStrokeWidth(el)}
            >
              <img src={getPenStrokeWidthImg(el)} />
            </button>
          ))}
          {activeTool == "pen" && (
            <>
              <div className="w-[2.5px] h-[25px] bg-[#45556C]" />
              {displayColors.map((el) => {
                const isPresetColor = displayColors.includes(penStrokeColor);

                const isActive =
                  penStrokeColor === el || (el === "empty" && !isPresetColor);
                return (
                  <button
                    key={el}
                    className={`w-[30px] h-[30px] p-[5px] flex items-center justify-center cursor-pointer ${isActive && "bg-[#CAD5E2] rounded-[20px]"}`}
                    onClick={() => onClickColorOption(el)}
                  >
                    <img src={getPenColorImg(el)} />
                  </button>
                );
              })}
            </>
          )}
          {colorPaletteOpen && (
            <div className="absolute top-[5px] right-[-180px] mt-[20px] z-50">
              <ColorPalette
                colorCode={penStrokeColor}
                handleColorCode={handlePenStrokeColor}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
