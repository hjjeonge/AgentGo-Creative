import type React from "react";
import { useEffect, useMemo, useState } from "react";
import NONE_COLOR from "./../../assets/none.svg";
import Close from "./../../assets/close-line.svg";
import Picker from "./../../assets/colorize.svg";

const DEFAULT_COLOR_LIST = [
  "#000000",
  "#595959",
  "#787878",
  "#9E9E9E",
  "#C2C2C2",
  "#EEEEEE",
  "#FFFFFF",
  "#FFCABC",
  "#FFEFC0",
  "#E1F0D3",
  "#ACE7E0",
  "#AAEBFF",
  "#CBD2F4",
  "#E7BDEA",
  "#FF8261",
  "#FFCB19",
  "#A6D57C",
  "#6ACDC4",
  "#00D0FF",
  "#9DA9DC",
  "#C766CB",
  "#FF3D13",
  "#FF9A00",
  "#6EB435",
  "#00A899",
  "#00ACF8",
  "#596FC5",
  "#A823B5",
  "#EB3A07",
  "#FF6400",
  "#438C24",
  "#008B7A",
  "#008AD5",
  "#354EAE",
  "#721E9F",
  "#BD2D09",
  "#DA5000",
  "#376F1D",
  "#007062",
  "#006FAB",
  "#2A3E8C",
  "#5D1980",
];

interface Props {
  onClose: () => void;
  recentlyUseColorList?: string[];
  currentColor: string;
  onSelectColor: (value: string) => void;
  onOpenPalette: () => void;
}

export const ColorPickerPopup: React.FC<Props> = ({
  onClose,
  recentlyUseColorList,
  currentColor,
  onSelectColor,
  onOpenPalette,
}: Props) => {
  const normalizeHex = (value: string) => {
    if (!value) return "#000000";
    if (value === "transparent") return "transparent";
    return value.startsWith("#")
      ? value.toUpperCase()
      : `#${value}`.toUpperCase();
  };

  const [hexInput, setHexInput] = useState<string>("");
  const normalizedCurrent = useMemo(
    () => normalizeHex(currentColor),
    [currentColor],
  );

  useEffect(() => {
    if (normalizedCurrent === "transparent") {
      setHexInput("");
      return;
    }
    setHexInput(normalizedCurrent.replace("#", ""));
  }, [normalizedCurrent]);

  const handleSelect = (value: string) => {
    onSelectColor(normalizeHex(value));
  };

  const isActive = (value: string) => normalizeHex(value) === normalizedCurrent;

  return (
    <div className="flex flex-col bg-white p-[7px] rounded-[8px] shadow-md min-w-[220px]">
      <div>
        <div className="flex items-center justify-between text-[#0F172B] text-[12px] font-bold leading-[18px] p-[7px_4px]">
          <span>최근 사용한 색상</span>
          <button onClick={onClose}>
            <img src={Close} />
          </button>
        </div>
        <div className="flex items-center gap-[4px] px-[4px]">
          {recentlyUseColorList?.slice(0, 7)?.map((el) => (
            <button
              key={el}
              className={`border rounded-[4px] overflow-hidden box-border w-[20px] h-[20px] ${isActive(el) ? "border-[#0F172B]" : "border-[#90A1B9]"}`}
              onClick={() => handleSelect(el)}
            >
              <div className="w-full h-full" style={{ backgroundColor: el }} />
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col pb-[14px]">
        <div className="text-[#0F172B] text-[12px] font-bold leading-[18px] p-[7px_4px]">
          기본 팔레트
        </div>
        <div className="flex flex-col gap-[14px] px-[4px]">
          <button
            className={`border rounded-[5px] box-border w-[20px] h-[20px] ${normalizedCurrent === "transparent" ? "border-[#0F172B]" : "border-[#90A1B9]"}`}
            onClick={() => handleSelect("transparent")}
          >
            <img src={NONE_COLOR} />
          </button>
          <div className="grid grid-cols-7 gap-[8px]">
            {DEFAULT_COLOR_LIST.map((el) => (
              <button
                key={el}
                className={`border rounded-[4px] overflow-hidden box-border w-[20px] h-[20px] ${isActive(el) ? "border-[#0F172B]" : "border-[#90A1B9]"}`}
                onClick={() => handleSelect(el)}
              >
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: el }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[#E2E8F0] flex items-center justify-between p-[14px]">
        <div
          className="w-[26px] h-[26px] border border-[#E2E8F0] rounded-[4px]"
          style={{ background: normalizedCurrent }}
        />
        <div className="flex items-center gap-[7px]">
          <div className="border flex border-[#CAD5E2] p-[7px] rounded-[4px] max-w-[100px] text-[12px] leading-[18px] text-[#0F172B]">
            <span>#</span>
            <input
              maxLength={6}
              value={hexInput}
              onChange={(e) => {
                const next = e.target.value.replace(/[^0-9a-fA-F]/g, "");
                setHexInput(next);
                if (next.length === 6) handleSelect(next);
              }}
              className="w-full outline-none border-none"
            />
          </div>
          <button onClick={onOpenPalette}>
            <img src={Picker} />
          </button>
        </div>
      </div>
    </div>
  );
};
