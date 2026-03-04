import type React from "react";

interface Props {
  ratio: string;
  active: boolean;
}

export const SizePreviewIcon: React.FC<Props> = ({ ratio, active }) => {
  const dims: Record<string, { w: number; h: number }> = {
    "1:1":  { w: 28, h: 28 },
    "4:5":  { w: 22, h: 28 },
    "16:9": { w: 36, h: 20 },
    "9:16": { w: 20, h: 36 },
  };
  const d = dims[ratio] ?? { w: 28, h: 28 };
  const color = active ? "#155DFC" : "#94A3B8";
  return (
    <svg width={d.w} height={d.h} viewBox={`0 0 ${d.w} ${d.h}`} fill="none">
      <rect
        x="1" y="1" width={d.w - 2} height={d.h - 2}
        rx="2" ry="2"
        stroke={color} strokeWidth="1.5" strokeDasharray="3 2"
      />
      <circle cx={d.w * 0.33} cy={d.h * 0.35} r="2" fill={color} />
      <path
        d={`M3 ${d.h - 3} L${d.w * 0.28} ${d.h * 0.55} L${d.w * 0.5} ${d.h * 0.72} L${d.w * 0.68} ${d.h * 0.55} L${d.w - 3} ${d.h - 3}`}
        stroke={color} strokeWidth="1.2" strokeLinejoin="round"
      />
    </svg>
  );
};
