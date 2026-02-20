import type React from "react";
import { useMemo } from "react";
import { ColorPalette } from "../commons/ColorPalette";
import { ColorPickerPopup } from "../commons/ColorPickerPopup";
import { useColorHistoryStore } from "../../store/colorHistoryStore";

interface Props {
  stroke?: string;
  strokeWidth?: number;
  onChangeStroke: (value: string) => void;
  onChangeStrokeWidth: (value: number) => void;
  colorPopupMode: "picker" | "palette" | null;
  onOpenPicker: () => void;
  onOpenPalette: () => void;
  onBackToPicker: () => void;
  onClosePicker: () => void;
}

export const StrokeContent: React.FC<Props> = ({
  stroke,
  strokeWidth,
  onChangeStroke,
  onChangeStrokeWidth,
  colorPopupMode,
  onOpenPicker,
  onOpenPalette,
  onBackToPicker,
  onClosePicker,
}: Props) => {
  const recentColors = useColorHistoryStore((state) => state.recentColors);
  const addRecentColor = useColorHistoryStore((state) => state.addRecentColor);

  const normalizedCurrent = useMemo(() => {
    if (!stroke) return "#000000";
    return stroke.startsWith("#") ? stroke.toUpperCase() : `#${stroke}`.toUpperCase();
  }, [stroke]);


  return (
    <div className="flex flex-col p-[7px] border-b border-[#E2E8F0]  text-[16px] leading-[24px] text-[#0F172B]">
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>색상</span>
        <div className="relative">
          <button
            className="w-[24px] h-[24px] p-[1px] border border-[#90A1B9] rounded-[4px] box-border"
            onClick={onOpenPicker}
          >
            <div
              className="w-full h-full rounded-[3px]"
              style={{ backgroundColor: stroke ?? "#000000" }}
            />
          </button>
          {colorPopupMode && (
            <div className="absolute left-full top-0 ml-[8px] z-[100]">
              {colorPopupMode === "picker" ? (
                <ColorPickerPopup
                  onClose={onClosePicker}
                  onOpenPalette={onOpenPalette}
                  currentColor={normalizedCurrent}
                  recentlyUseColorList={recentColors}
                  onSelectColor={(value) => {
                    onChangeStroke(value);
                    addRecentColor(value);
                  }}
                />
              ) : (
                <ColorPalette
                  colorCode={normalizedCurrent}
                  handleColorCode={(value) => {
                    onChangeStroke(value);
                    addRecentColor(value);
                  }}
                  onBack={onBackToPicker}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>두께</span>
        <input
          type="number"
          value={strokeWidth ?? 0}
          min={0}
          onChange={(e) => onChangeStrokeWidth(parseFloat(e.target.value) || 0)}
          className="border border-[#CAD5E2] rounded-[6px] p-[7px] max-w-[100px]"
        />
      </div>
    </div>
  );
};
