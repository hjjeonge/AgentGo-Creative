import React from "react";
import { PencilIcon } from "../icons/PencilIcon";
import { ClickIcon } from "../icons/ClickIcon";
import { EraserIcon } from "../icons/EraserIcon";
import { ShapeIcon } from "../icons/ShapeIcon";
import { DiagramIcon } from "../icons/DiagramIcon";
import { TextIcon } from "../icons/TextIcon";

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
}) => {
  const tools = [
    { name: "mouse", label: "마우스", icon: <ClickIcon /> },
    { name: "pen", label: "펜", icon: <PencilIcon /> },
    { name: "eraser", label: "지우개", icon: <EraserIcon /> },
    { name: "shape", label: "도형", icon: <ShapeIcon /> },
    { name: "diagram", label: "객체", icon: <DiagramIcon /> },
    { name: "text", label: "텍스트", icon: <TextIcon /> },
  ];

  return (
    <div className="border border-[#90A1B9] rounded-[24px] p-[14px_18px] w-[584px] flex justify-evenly bg-white">
      {tools.map((tool) => (
        <button
          key={tool.name}
          onClick={() => onToolChange(tool.name)}
          className={`w-[54px] h-[54px] p-[10px] cursor-pointer ${
            activeTool === tool.name &&
            "border border-[#1447E6] bg-[#EFF6FF] text-[#155DFC] rounded-[6px]"
          }`}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
};
