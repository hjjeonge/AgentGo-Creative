import React, { useEffect, useRef, useState } from "react";
import { getPenColorImg, getPenStrokeWidthImg } from "../../utils/getImage";
import { ColorPalette } from "../commons/ColorPalette";
import { ClickIcon } from "../icons/ClickIcon";
import { DiagramIcon } from "../icons/DiagramIcon";
import { EraserIcon } from "../icons/EraserIcon";
import { PencilIcon } from "../icons/PencilIcon";
import { ShapeIcon } from "../icons/ShapeIcon";
import { TextIcon } from "../icons/TextIcon";
import { DiagramPopup } from "./DiagramPopup";
import { TextEditor } from "./TextEditor";
import { ToolButton } from "./ToolButton";
import { ToolbarButton } from "./ToolbarButton";

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  penStrokeWidth: number;
  handlePenStrokeWidth: (value: number) => void;
  penStrokeColor: string;
  handlePenStrokeColor: (value: string) => void;
  shapeType: string;
  setShapeType: (value: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
  penStrokeWidth,
  handlePenStrokeWidth,
  penStrokeColor,
  handlePenStrokeColor,
  shapeType,
  setShapeType,
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
          className={`absolute z-[50] top-[140px] ${activeTool === "pen" && "left-[415px]"} ${activeTool === "eraser" && "right-[455px]"} border flex items-center gap-[12px] border-[#90A1B9] p-[8px_10px] rounded-[6px] bg-[#F1F5F9]`}
        >
          {penStrokeWidths.map((el) => (
            <ToolbarButton
              key={el}
              tooltip={`${el}px`}
              icon={getPenStrokeWidthImg(el)}
              onClick={() => handlePenStrokeWidth(el)}
              isActive={penStrokeWidth === el}
              className="w-[34px] h-[34px] rounded-[6px]"
            />
          ))}
          {activeTool == "pen" && (
            <>
              <div className="w-[2.5px] h-[25px] bg-[#45556C]" />
              {displayColors.map((el) => {
                const isPresetColor = displayColors.includes(penStrokeColor);
                const isActive =
                  penStrokeColor === el || (el === "empty" && !isPresetColor);
                return (
                  <ToolbarButton
                    key={el}
                    tooltip={el}
                    icon={getPenColorImg(el)}
                    onClick={() => onClickColorOption(el)}
                    isActive={isActive}
                    className="w-[30px] h-[30px] p-[5px] rounded-[20px]"
                  />
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
      {activeTool === "diagram" && (
        <DiagramPopup shapeType={shapeType} setShapeType={setShapeType} />
      )}
      {activeTool === "text" && <TextEditor />}
    </div>
  );
};
