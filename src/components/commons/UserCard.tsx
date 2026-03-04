import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";
import { authStorage } from "../../services/apiClient";
import { getMyProfile } from "../../services/users";
import Dots from "./../../assets/dots.svg";

export const UserCard: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthed, setIsAuthed] = useState(!!authStorage.getAccessToken());
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authStorage.getAccessToken()) return;

    if (import.meta.env.DEV && authStorage.getAccessToken() === "dev-token") {
      setName("테스트");
      setEmail("test@itcen.com");
      setIsAdmin(true);
      return;
    }

    getMyProfile()
      .then((profile) => {
        setName(profile.name);
        setEmail(profile.email);
        setIsAdmin(!!profile.is_admin);
      })
      .catch(() => {
        authStorage.clear();
        setIsAuthed(false);
        navigate("/login");
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
      setIsAuthed(false);
      navigate("/login");
    }
    if (action === "admin") navigate("/dam");
  };

  if (!isAuthed) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="h-[42px] px-[16px] rounded-[8px] border border-[#569DFF]/20 bg-[#F8FAFF] text-[13px] font-semibold text-[#0F172B]"
      >
        로그인
      </button>
    );
  }

  const menuItems = [
    ...(isAdmin ? [{ label: "관리자", action: "admin" }] : []),
    { label: "로그아웃", action: "logout" },
  ];

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
          {menuItems.map((item) => (
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
