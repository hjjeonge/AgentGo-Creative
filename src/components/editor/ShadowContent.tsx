import type React from "react";
import { useState } from "react";
import { ColorPalette } from "../commons/ColorPalette";

interface Props {
  shadowColor?: string;
  shadowDirection?: number;
  shadowOpacity?: number;
  shadowDistance?: number;
  shadowBlur?: number;
  onChangeShadowColor: (value: string) => void;
  onChangeShadowDirection: (value: number) => void;
  onChangeShadowOpacity: (value: number) => void;
  onChangeShadowDistance: (value: number) => void;
  onChangeShadowBlur: (value: number) => void;
}

export const ShadowContent: React.FC<Props> = ({
  shadowColor,
  shadowDirection,
  shadowOpacity,
  shadowDistance,
  shadowBlur,
  onChangeShadowColor,
  onChangeShadowDirection,
  onChangeShadowOpacity,
  onChangeShadowDistance,
  onChangeShadowBlur,
}: Props) => {
  const [colorPaletteOpen, setColorPaletteOpen] = useState(false);

  return (
    <div className="flex flex-col p-[7px] border-b border-[#E2E8F0]  text-[16px] leading-[24px] text-[#0F172B]">
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>색상</span>
        <div className="relative">
          <button
            className="w-[24px] h-[24px] p-[1px] border border-[#90A1B9] rounded-[4px] box-border"
            onClick={() => setColorPaletteOpen((prev) => !prev)}
          >
            <div
              className="w-full h-full rounded-[3px]"
              style={{ backgroundColor: shadowColor ?? "#000000" }}
            />
          </button>
          {colorPaletteOpen && (
            <div className="absolute left-full top-0 ml-[8px] z-[100]">
              <ColorPalette
                colorCode={shadowColor ?? "#000000"}
                handleColorCode={onChangeShadowColor}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>방향</span>
        {/* shadow Offset */}
        <input
          type="number"
          min={0}
          max={360}
          step={1}
          value={shadowDirection ?? 45}
          onChange={(e) =>
            onChangeShadowDirection(
              Math.max(0, Math.min(360, parseFloat(e.target.value) || 0)),
            )
          }
          className="border border-[#CAD5E2] rounded-[6px] p-[7px] max-w-[100px]"
        />
      </div>
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>불투명도</span>
        {/* shadowOpacity */}
        <input
          type="number"
          min={0}
          max={1}
          step={0.05}
          value={shadowOpacity ?? 0}
          onChange={(e) =>
            onChangeShadowOpacity(
              Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)),
            )
          }
          className="border border-[#CAD5E2] rounded-[6px] p-[7px] max-w-[100px]"
        />
      </div>
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>거리</span>
        {/* offset 벡터길이 */}
        <input
          type="number"
          min={0}
          max={500}
          step={1}
          value={shadowDistance ?? 0}
          onChange={(e) =>
            onChangeShadowDistance(
              Math.max(0, Math.min(500, parseFloat(e.target.value) || 0)),
            )
          }
          className="border border-[#CAD5E2] rounded-[6px] p-[7px] max-w-[100px]"
        />
      </div>
      <div className="flex items-center justify-between p-[10px_7px]">
        <span>흐림</span>
        {/* shadowBlur */}
        <input
          type="number"
          min={0}
          max={100}
          step={1}
          value={shadowBlur ?? 0}
          onChange={(e) =>
            onChangeShadowBlur(
              Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)),
            )
          }
          className="border border-[#CAD5E2] rounded-[6px] p-[7px] max-w-[100px]"
        />
      </div>
    </div>
  );
};
