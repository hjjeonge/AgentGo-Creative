import type React from "react";
import { ColorPicker, useColor, type IColor } from "react-color-palette";
import "react-color-palette/css";

interface Props {
  colorCode: string;
  handleColorCode: (value: string) => void;
}

export const ColorPalette: React.FC<Props> = ({
  colorCode,
  handleColorCode,
}: Props) => {
  const [color, setColor] = useColor(colorCode);

  const handleColor = (value: IColor) => {
    setColor(value);
    handleColorCode(value.hex);
  };

  return (
    <ColorPicker
      color={color}
      onChange={handleColor}
      hideInput={["rgb", "hsv"]}
    />
  );
};
