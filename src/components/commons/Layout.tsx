import type React from "react";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-[72px] overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
