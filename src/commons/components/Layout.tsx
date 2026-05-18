import type React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import { Sidebar } from './SideBar';

export const Layout: React.FC = () => {
  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <div className="flex h-full pt-[52px]">
        <Sidebar />
        <main className="h-full flex-1 overflow-y-auto pl-[80px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
