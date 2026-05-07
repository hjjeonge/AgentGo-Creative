import type React from 'react';
import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';

type MenuProps = {
  Icon: ComponentType;
  label: string;
  to: string;
  isActive: boolean;
};

export const Menu: React.FC<MenuProps> = ({ Icon, label, to, isActive }) => {
  const labelColorClass = isActive ? 'text-[#1447E6]' : 'text-[#314158]';
  const iconColorClass = isActive ? 'text-[#1447E6]' : 'text-[#314158]';

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center gap-2 rounded-[4px] p-2.5 ${
        isActive
          ? 'border-l-3 border-[#3B82F6] bg-white'
          : 'border-l-3 border-transparent'
      }`}
    >
      <span className={iconColorClass}>
        <Icon />
      </span>
      <span className={`text-sm font-bold ${labelColorClass}`}>{label}</span>
    </Link>
  );
};
