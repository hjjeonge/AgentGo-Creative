import type React from 'react';
import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';

type MenuProps = {
  Icon: ComponentType;
  label: string;
  isActive: boolean;
  to?: string;
  onClick?: () => void;
};

export const Menu: React.FC<MenuProps> = ({
  Icon,
  label,
  isActive,
  onClick,
  to,
}) => {
  const labelColorClass = isActive ? 'text-[#1447E6]' : 'text-[#314158]';
  const iconColorClass = isActive ? 'text-[#1447E6]' : 'text-[#314158]';
  const className = `flex w-full flex-col items-center justify-center gap-2 rounded-[4px] border-0 bg-transparent p-2.5 text-left ${
    isActive
      ? 'border-l-3 border-[#3B82F6] bg-white'
      : 'border-l-3 border-transparent'
  }`;

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={className}>
        <span className={iconColorClass}>
          <Icon />
        </span>
        <span className={`text-sm font-bold ${labelColorClass}`}>{label}</span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <span className={iconColorClass}>
        <Icon />
      </span>
      <span className={`text-sm font-bold ${labelColorClass}`}>{label}</span>
    </button>
  );
};
