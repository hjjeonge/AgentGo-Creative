import React, { useState } from "react";
import { PencilIcon } from "../icons/PencilIcon";
import { ClickIcon } from "../icons/ClickIcon";
import { EraserIcon } from "../icons/EraserIcon";
import { ShapeIcon } from "../icons/ShapeIcon";
import { DiagramIcon } from "../icons/DiagramIcon";
import { TextIcon } from "../icons/TextIcon";

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  drawingColor?: string;
  drawingLineWidth?: number;
  setDrawingColor?: (color: string) => void;
  setDrawingLineWidth?: (width: number) => void;
  onAddText?: () => void;
  onTriggerFileUpload?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
  drawingColor,
  drawingLineWidth,
  setDrawingColor,
  setDrawingLineWidth,
  onAddText,
  onTriggerFileUpload,
}) => {
  const presetColors = [
    "#000000",
    "#FF0000",
    "#FFFF00",
    "#0000FF",
    "#008000",
    "#FFFFFF",
  ];

  const [isFreeDrawMenuOpen, setIsFreeDrawMenuOpen] = useState(false);
  const [isShapesMenuOpen, setIsShapesMenuOpen] = useState(false);

  const ToolButton: React.FC<{
    toolName: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    isActive?: boolean;
  }> = ({ toolName, icon, label, onClick, isActive }) => (
    <button
      title={label}
      onClick={onClick || (() => onToolChange(toolName))}
      className={`w-[54px] h-[54px] p-[10px] cursor-pointer flex items-center justify-center ${
        isActive || activeTool === toolName
          ? "border border-[#1447E6] bg-[#EFF6FF] text-[#155DFC] rounded-[6px]"
          : "hover:bg-gray-100 rounded-[6px]"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex justify-around w-[584px] p-[14px_18px] bg-white rounded-[24px] border border-[#90A1B9] shadow-md mt-[40px] mb-[40px]">
      <ToolButton toolName="select" label="select" icon={<ClickIcon />} />
      <div className="relative">
        <ToolButton
          toolName="pen"
          label="pen"
          icon={<PencilIcon />}
          onClick={() => {
            onToolChange("pen");
            setIsFreeDrawMenuOpen(!isFreeDrawMenuOpen);
          }}
          isActive={activeTool === "pen"}
        />
        {/* {isFreeDrawMenuOpen && (
          <div className="absolute left-full top-0 ml-2 p-2 bg-white rounded-lg shadow-md z-10">
            <div className="font-bold mb-2 text-sm">Color</div>
            <div className="flex gap-1 mb-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  title={color}
                  className={`w-5 h-5 rounded-full ${
                    drawingColor === color ? "border-2 border-blue-500" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setDrawingColor(color)}
                ></button>
              ))}
            </div>
            <div className="font-bold mb-2 text-sm">Line Width</div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={drawingLineWidth}
              onChange={(e) => setSetDrawingLineWidth(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-right text-xs mt-1">{drawingLineWidth} px</div>
          </div>
        )} */}
      </div>
      <ToolButton toolName="eraser" label="eraser" icon={<EraserIcon />} />
      <ToolButton toolName="diagram" label="diagram" icon={<DiagramIcon />} />
      {/* Shapes */}
      <div className="relative">
        <ToolButton
          toolName="shape"
          label="shape"
          icon={<ShapeIcon />}
          onClick={() => {
            onToolChange("shape");
            setIsShapesMenuOpen(!isShapesMenuOpen);
          }}
          isActive={
            activeTool === "rectangle" ||
            activeTool === "circle" ||
            activeTool === "polygon-lasso"
          }
        />
        {/* {isShapesMenuOpen && (
          <div className="absolute left-full top-0 ml-2 p-2 bg-white rounded-lg shadow-md z-10 w-40">
            <button
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
              onClick={() => onToolChange("rectangle")}
            >
              Rectangle
            </button>
            <button
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
              onClick={() => onToolChange("circle")}
            >
              Circle
            </button>
            <button
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
              onClick={() => onToolChange("polygon-lasso")}
            >
              Polygonal Lasso
            </button>
          </div>
        )} */}
      </div>
      <ToolButton
        toolName="text"
        label="text"
        icon={<TextIcon />}
        onClick={onAddText}
      />
    </div>
  );
};
