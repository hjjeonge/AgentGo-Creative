import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";
import { getMyProfile } from "../../services/users";
import Dots from "./../../assets/dots.svg";

const MENU_ITEMS = [
  { label: "관리자",  action: "admin" },
  { label: "로그아웃", action: "logout" },
];

export const UserCard: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        setName(profile.name);
        setEmail(profile.email);
      })
      .catch(() => {
        // 조회 실패 시 기본값 유지
      });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAction = async (action: string) => {
    setMenuOpen(false);
    if (action === "logout") {
      await logout();
      navigate("/login");
    }
    if (action === "admin")  navigate("/dam");
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="w-[270px] h-[42px] p-[14px] rounded-[8px] border border-[#569DFF]/20 bg-[#F8FAFF] flex items-center justify-between">
        <div className="w-[28px] h-[28px] bg-[linear-gradient(135deg,#0055E9_0%,#6A14D9_100%)] flex items-center justify-center rounded-full text-[12px] text-white leading-[18px] font-bold shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex flex-col items-start min-w-0">
          <span className="text-[#1E1E1E] text-[13px] font-semibold leading-tight truncate w-full">{name}</span>
          <span className="text-[#9CA3AF] text-[11px] leading-tight truncate w-full">{email}</span>
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