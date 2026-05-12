import React from 'react';

const SPECIAL_CHARS: { category: string; chars: string[] }[] = [
  {
    category: '기호',
    chars: [
      '©',
      '®',
      '™',
      '§',
      '¶',
      '†',
      '‡',
      '°',
      '×',
      '÷',
      '±',
      '√',
      '∞',
      '≈',
      '≠',
      '≤',
      '≥',
    ],
  },
  {
    category: '화살표',
    chars: [
      '←',
      '→',
      '↑',
      '↓',
      '↔',
      '↕',
      '⇐',
      '⇒',
      '⇑',
      '⇓',
      '↗',
      '↘',
      '↙',
      '↖',
    ],
  },
  {
    category: '통화',
    chars: ['€', '£', '¥', '¢', '₩', '₪', '₫', '₺', '₿', '฿', '₦', '₹'],
  },
  {
    category: '도형',
    chars: [
      '▲',
      '▼',
      '◆',
      '■',
      '●',
      '○',
      '★',
      '☆',
      '♠',
      '♣',
      '♥',
      '♦',
      '△',
      '▷',
    ],
  },
  {
    category: '기타',
    chars: [
      '✓',
      '✗',
      '☎',
      '✉',
      '✂',
      '☁',
      '☀',
      '☂',
      '♪',
      '♫',
      '✨',
      '❤',
      '⚡',
      '❄',
    ],
  },
];

interface SpecialCharPopupProps {
  onInsert: (char: string) => void;
}

export const SpecialCharPopup: React.FC<SpecialCharPopupProps> = ({
  onInsert,
}) => {
  return (
    <div className="rounded-[8px] bg-white p-[12px] shadow-lg max-h-100 overflow-y-auto">
      {SPECIAL_CHARS.map((group) => (
        <div key={group.category} className="mb-[10px] last:mb-0">
          <div className="text-sm text-text-tertiary mb-[5px] font-medium">
            {group.category}
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {group.chars.map((char) => (
              <button
                key={char}
                className=" w-7 h-7 flex items-center justify-center rounded-[4px] text-lg hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                onClick={() => {
                  onInsert(char);
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
