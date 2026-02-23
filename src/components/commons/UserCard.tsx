import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dots from "./../../assets/dots.svg";

const MENU_ITEMS = [
  { label: "관리자",  action: "admin" },
  { label: "로그아웃", action: "logout" },
];

export const UserCard: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAction = (action: string) => {
    setMenuOpen(false);
    if (action === "logout") navigate("/login");
    if (action === "admin")  navigate("/dam");
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="w-[270px] h-[42px] p-[14px] rounded-[8px] border border-[#569DFF]/20 bg-[#F8FAFF] flex items-center justify-between">
        <div className="w-[28px] h-[28px] bg-[linear-gradient(135deg,#0055E9_0%,#6A14D9_100%)] flex items-center justify-center rounded-full text-[12px] text-white leading-[18px] font-bold shrink-0">
          클
        </div>
        <div className="flex items-center gap-[2px]">
          <span className="text-[#1E1E1E] text-[14px] font-semibold">클로잇</span>
          <span className="text-[#9CA3AF] text-[12px]">
            cloit.genai@itcen.com
          </span>
        </div>
        <button onClick={() => setMenuOpen((prev) => !prev)}>
          <img src={Dots} />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-[calc(100%+4px)] right-0 z-[100] bg-white border border-[#E2E8F0] rounded-[8px] shadow-lg py-[4px] min-w-[120px]">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.action}
              onClick={() => handleAction(item.action)}
              className={`w-full text-left px-[16px] py-[10px] text-[14px] hover:bg-[#F1F5F9] ${
                item.action === "logout" ? "text-[#E11D48]" : "text-[#0F172B]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};