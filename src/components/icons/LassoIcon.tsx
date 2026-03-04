import type React from 'react';

export const LassoIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 4C7.5 4 4 7 4 10.5C4 14.5 7 17 11 17.5L11.5 20L12.5 20L13 17.5C17 17 20 14.5 20 10.5C20 7 16.5 4 12 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeDasharray="3 2"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
};
