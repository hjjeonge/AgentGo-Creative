import type React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import { Sidebar } from './SideBar';

export const Layout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex pt-[52px]">
        <Sidebar />
        <main className="flex-1 overflow-hidden h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
