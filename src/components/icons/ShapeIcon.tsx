import type React from 'react';

export const ShapeIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* 점선 사각형 선택 영역 아이콘 */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeDasharray="3 2"
        fill="none"
      />
      {/* 좌상단 핸들 */}
      <circle cx="2" cy="2" r="1.5" fill="currentColor" />
      {/* 우상단 핸들 */}
      <circle cx="22" cy="2" r="1.5" fill="currentColor" />
      {/* 좌하단 핸들 */}
      <circle cx="2" cy="22" r="1.5" fill="currentColor" />
      {/* 우하단 핸들 */}
      <circle cx="22" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
};
