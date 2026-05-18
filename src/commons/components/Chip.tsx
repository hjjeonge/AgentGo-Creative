import type { ReactNode } from 'react';
import type React from 'react';

interface ChipProps {
  label: string;
  startDecorator?: ReactNode | string;
  endDecorator?: ReactNode | string;
  variant?: 'outlined' | 'soft';
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  startDecorator,
  endDecorator,
  variant = 'outlined',
  onClick,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-0.5 px-1.5 rounded-3xl cursor-pointer font-bold text-xs leading-4.5 ${
        variant === 'outlined'
          ? 'border border-[#51A2FF] text-[#1447E6] bg-white hover:bg-[#DBEAFE]'
          : 'bg-[#DBEAFE] text-[#193CB8] hover:bg-[#BEDBFF]'
      }`}
      onClick={onClick}
    >
      {startDecorator && <span>{startDecorator}</span>}
      <span>{label}</span>
      {endDecorator && <span>{endDecorator}</span>}
    </div>
  );
};
