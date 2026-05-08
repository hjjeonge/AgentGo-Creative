import type React from 'react';
import { useLocation } from 'react-router-dom';

import { Menu } from '@/commons/components/Menu';
import { sidebarMenus } from '@/commons/constants/sidebarMenus';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="fixed top-[52px] left-0 bottom-0 z-10 w-[80px] border-r border-border-neutral bg-[#F1F5F9] px-3 py-6">
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
