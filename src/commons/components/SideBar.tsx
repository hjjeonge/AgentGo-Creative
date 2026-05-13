import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { useLocation } from 'react-router-dom';

import { CreatePannel } from '@/commons/components/CreatePannel';
import { Menu } from '@/commons/components/Menu';
import { sidebarMenus } from '@/commons/constants/sidebarMenus';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setIsCreatePanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapRef} className="fixed inset-y-0 left-0 top-[52px] z-10">
      <div className="h-full w-[80px] border-r border-border-neutral bg-[#F1F5F9] px-3 py-6">
        <div className="flex flex-col gap-3">
          {sidebarMenus.map(({ Icon, id, label, to, isActive }) => (
            <div
              key={id}
              onMouseEnter={
                id === 'create' ? () => setIsCreatePanelOpen(true) : undefined
              }
              onMouseLeave={
                id === 'create' ? () => setIsCreatePanelOpen(false) : undefined
              }
              className="relative"
            >
              <Menu
                Icon={Icon}
                label={label}
                to={id === 'create' ? undefined : to}
                onClick={
                  id === 'create'
                    ? undefined
                    : () => setIsCreatePanelOpen(false)
                }
                isActive={isActive(pathname)}
              />
              {id === 'create' && isCreatePanelOpen ? (
                <div className="absolute left-full top-0 w-[324px] pl-7">
                  <CreatePannel
                    onNavigate={() => setIsCreatePanelOpen(false)}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
