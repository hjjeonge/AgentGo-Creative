import React from "react";
import { ClickIcon } from "../icons/ClickIcon";
import { DiagramIcon } from "../icons/DiagramIcon";
import { EraserIcon } from "../icons/EraserIcon";
import { PencilIcon } from "../icons/PencilIcon";
import { ShapeIcon } from "../icons/ShapeIcon";
import { TextIcon } from "../icons/TextIcon";
import PenSize_2 from "./../../assets/pen_size_2.svg";
import PenSize_3 from "./../../assets/pen_size_3.svg";
import PenSize_4 from "./../../assets/pen_size_4.svg";
import PenSize_5 from "./../../assets/pen_size_5.svg";
import { ToolButton } from "./ToolButton";

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  penStrokeWidth: number;
  handlePenStrokeWidth: (value: number) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
  penStrokeWidth,
  handlePenStrokeWidth,
}) => {
  const tools = [
    { tool: "click", icon: <ClickIcon /> },
    { tool: "pen", icon: <PencilIcon /> },
    { tool: "eraser", icon: <EraserIcon /> },
    { tool: "diagram", icon: <DiagramIcon /> },
    { tool: "shape", icon: <ShapeIcon /> },
    { tool: "text", icon: <TextIcon /> },
  ];
  const penStrokeWidths = [2, 3, 5, 6];

  const getPenStrokeWidthImg = (value: number) => {
    switch (value) {
      case 2:
        return PenSize_2;
      case 3:
        return PenSize_3;
      case 5:
        return PenSize_4;
      case 6:
        return PenSize_5;
    }
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
      {activeTool === "pen" && (
        <div className="border flex gap-[12px] border-[#90A1B9] p-[8px_10px] rounded-[6px] bg-[#F1F5F9]">
          {penStrokeWidths.map((el) => (
            <button
              key={el}
              className={`w-[34px] h-[34px] flex items-center justify-center cursor-pointer ${penStrokeWidth === el && "bg-[#CAD5E2] rounded-[6px]"}`}
              onClick={() => handlePenStrokeWidth(el)}
            >
              <img src={getPenStrokeWidthImg(el)} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
