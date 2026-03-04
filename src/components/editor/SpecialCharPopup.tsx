import React from "react";

const SPECIAL_CHARS: { category: string; chars: string[] }[] = [
  {
    category: "기호",
    chars: ["©", "®", "™", "§", "¶", "†", "‡", "°", "×", "÷", "±", "√", "∞", "≈", "≠", "≤", "≥"],
  },
  {
    category: "화살표",
    chars: ["←", "→", "↑", "↓", "↔", "↕", "⇐", "⇒", "⇑", "⇓", "↗", "↘", "↙", "↖"],
  },
  {
    category: "통화",
    chars: ["€", "£", "¥", "¢", "₩", "₪", "₫", "₺", "₿", "฿", "₦", "₹"],
  },
  {
    category: "도형",
    chars: ["▲", "▼", "◆", "■", "●", "○", "★", "☆", "♠", "♣", "♥", "♦", "△", "▷"],
  },
  {
    category: "기타",
    chars: ["✓", "✗", "☎", "✉", "✂", "☁", "☀", "☂", "♪", "♫", "✨", "❤", "⚡", "❄"],
  },
];

interface SpecialCharPopupProps {
  onInsert: (char: string) => void;
  onClose: () => void;
}

export const SpecialCharPopup: React.FC<SpecialCharPopupProps> = ({
  onInsert,
  onClose,
}) => {
  return (
    <div
      className="absolute top-full left-0 mt-[6px] z-[100] bg-white border border-[#90A1B9] rounded-[8px] p-[12px] shadow-lg w-[270px]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {SPECIAL_CHARS.map((group) => (
        <div key={group.category} className="mb-[10px] last:mb-0">
          <div className="text-[11px] text-[#64748B] mb-[5px] font-medium">
            {group.category}
          </div>
          <div className="flex flex-wrap gap-[3px]">
            {group.chars.map((char) => (
              <button
                key={char}
                className="w-[28px] h-[28px] flex items-center justify-center text-[15px] rounded-[4px] hover:bg-[#EFF6FF] hover:text-[#1447E6] border border-transparent hover:border-[#1447E6] transition-colors cursor-pointer"
                onClick={() => {
                  onInsert(char);
                  onClose();
                }}
                title={char}
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};