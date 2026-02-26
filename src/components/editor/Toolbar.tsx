import React, { useEffect, useRef, useState } from "react";
import { getPenColorImg, getPenStrokeWidthImg } from "../../utils/getImage";
import { ColorPalette } from "../commons/ColorPalette";
import { ColorPickerPopup } from "../commons/ColorPickerPopup";
import { useColorHistoryStore } from "../../store/colorHistoryStore";
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
import type { TextObject } from "./EditorCanvas";
import { LassoIcon } from "../icons/LassoIcon";

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  penStrokeWidth: number;
  handlePenStrokeWidth: (value: number) => void;
  penStrokeColor: string;
  handlePenStrokeColor: (value: string) => void;
  shapeType: string;
  setShapeType: (value: string) => void;
  shapeSelectMode: "rect" | "lasso";
  setShapeSelectMode: (mode: "rect" | "lasso") => void;
  isTextEditorVisible: boolean;
  selectedTextObject?: TextObject;
  handleUpdateTextObject: (id: string, updates: Partial<TextObject>) => void;
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
  shapeSelectMode,
  setShapeSelectMode,
  isTextEditorVisible,
  selectedTextObject,
  handleUpdateTextObject,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [colorPopupMode, setColorPopupMode] = useState<
    "picker" | "palette" | null
  >(null);
  const recentColors = useColorHistoryStore((state) => state.recentColors);
  const addRecentColor = useColorHistoryStore((state) => state.addRecentColor);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setColorPopupMode(null);
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
      setColorPopupMode("picker");
      return;
    }
    handlePenStrokeColor(value);
  };

  return (
    <div className="relative mt-[40px] mb-[40px] flex flex-col items-center">
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

      {/* 하단 서브 바 - absolute 로 캔버스 영역에 영향 없이 표시 */}
      {(activeTool === "pen" || activeTool === "eraser") && (
        <div
          ref={wrapperRef}
          className="absolute top-full mt-[7px] border flex items-center gap-[12px] border-[#90A1B9] p-[8px_10px] rounded-[6px] bg-[#F1F5F9] z-20"
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
          {colorPopupMode && (
            <div className="absolute top-full right-0 mt-[6px] z-50">
              {colorPopupMode === "picker" ? (
                <ColorPickerPopup
                  onClose={() => setColorPopupMode(null)}
                  onOpenPalette={() => setColorPopupMode("palette")}
                  currentColor={penStrokeColor}
                  recentlyUseColorList={recentColors}
                  onSelectColor={(value) => {
                    handlePenStrokeColor(value);
                    addRecentColor(value);
                  }}
                />
              ) : (
                <ColorPalette
                  colorCode={penStrokeColor}
                  handleColorCode={(value) => {
                    handlePenStrokeColor(value);
                    addRecentColor(value);
                  }}
                  onBack={() => setColorPopupMode("picker")}
                />
              )}
            </div>
          )}
        </div>
      )}
      {activeTool === "diagram" && (
        <div className="absolute top-full mt-[7px] z-20">
          <DiagramPopup shapeType={shapeType} setShapeType={setShapeType} />
        </div>
      )}
      {activeTool === "shape" && (
        <div className="absolute top-full mt-[7px] z-20 flex items-center gap-[6px] border border-[#90A1B9] p-[6px_10px] rounded-[6px] bg-[#F1F5F9]">
          <button
            onClick={() => setShapeSelectMode("rect")}
            className={`flex items-center gap-[4px] px-[8px] py-[4px] rounded-[4px] text-[13px] transition-colors ${
              shapeSelectMode === "rect"
                ? "bg-[#1447E6] text-white"
                : "text-[#45556C] hover:bg-[#E2E8F0]"
            }`}
          >
            <ShapeIcon />
            정사형
          </button>
          <button
            onClick={() => setShapeSelectMode("lasso")}
            className={`flex items-center gap-[4px] px-[8px] py-[4px] rounded-[4px] text-[13px] transition-colors ${
              shapeSelectMode === "lasso"
                ? "bg-[#1447E6] text-white"
                : "text-[#45556C] hover:bg-[#E2E8F0]"
            }`}
          >
            <LassoIcon />
            자유형
          </button>
        </div>
      )}
      {isTextEditorVisible && selectedTextObject && (
        <div className="absolute top-full mt-[7px] z-20">
          <TextEditor
            selectedTextObject={selectedTextObject}
            handleUpdateTextObject={handleUpdateTextObject}
          />
        </div>
      )}
    </div>
  );
};
