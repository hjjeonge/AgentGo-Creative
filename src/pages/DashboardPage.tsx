import type React from "react";
import { Link } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-[30px]">
      <span className="text-[20px] font-bold">This is Dashboard Page</span>
      <div className="flex gap-[10px] items-center justify-center rounded-2xl">
        <Link to="/template" className="rounded-xl p-[10px] bg-pink-200">
          Go To Template Page
        </Link>
        <Link to="/editor" className="rounded-xl p-[10px] bg-pink-200">
          Go To Editor Page
        </Link>
      </div>
    </div>
  );
};
