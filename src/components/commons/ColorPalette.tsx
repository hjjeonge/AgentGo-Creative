import type React from "react";
import { ColorPicker, useColor, type IColor } from "react-color-palette";
import "react-color-palette/css";
import Arrow from "./../../assets/arrow_down.svg";

interface Props {
  colorCode: string;
  handleColorCode: (value: string) => void;
  onBack: () => void;
}

export const ColorPalette: React.FC<Props> = ({
  colorCode,
  handleColorCode,
  onBack,
}: Props) => {
  const [color, setColor] = useColor(colorCode);

  const handleColor = (value: IColor) => {
    setColor(value);
    handleColorCode(value.hex);
  };

  return (
    <div className="flex flex-col bg-white border p-[10px] rounded-[8px] shadow-md gap-[10px]">
      <div className="border-b border-[#E2E8F0] flex items-center pb-[5px] text-[#0F172B] text-[16px] font-bold leading-[20px]">
        <button onClick={onBack}>
          <img src={Arrow} className="rotate-90" />
        </button>
        <span>직접 조정</span>
      </div>
      <ColorPicker
        color={color}
        onChange={handleColor}
        hideInput={["rgb", "hsv"]}
      />
    </div>
  );
};
