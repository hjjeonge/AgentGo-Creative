import type React from 'react';
import { useLocation } from 'react-router-dom';

import { Menu } from '@/commons/components/Menu';
import { sidebarMenus } from '@/commons/constants/sidebarMenus';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="w-[80px] bg-[#F1F5F9] border-r border-border-neutral h-full py-6 px-3">
      <div className="flex flex-col gap-3">
        {sidebarMenus.map(({ Icon, label, to, isActive }) => (
          <Menu
            key={to}
            Icon={Icon}
            label={label}
            to={to}
            isActive={isActive(pathname)}
          />
        ))}
      </div>
    </div>
  );
};
