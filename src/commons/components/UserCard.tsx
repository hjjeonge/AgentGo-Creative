import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { clearTokens, getAccessToken } from '@/commons/utils/tokenManager';
import { useLogoutMutation } from '@/features/auth/queries/useLogoutMutation';
import { useUserProfileQuery } from '@/features/auth/queries/useUserProfileQuery';

export const UserCard: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: logoutMutateAsync } = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(!!getAccessToken());
  const wrapRef = useRef<HTMLDivElement>(null);
  const token = getAccessToken();

  const { data: userProfile, isError } = useUserProfileQuery({
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (!isError) return;
    clearTokens();
    setIsAuthed(false);
    navigate('/login');
  }, [isError, navigate]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAction = async (action: string) => {
    setMenuOpen(false);
    if (action === 'logout') {
      await logoutMutateAsync();
      clearTokens();
      setIsAuthed(false);
      navigate('/login');
    }
    if (action === 'admin') navigate('/dam');
  };

  if (!isAuthed) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="h-[42px] px-[16px] rounded-[8px] border border-[#569DFF]/20 bg-[#F8FAFF] text-[13px] font-semibold text-[#0F172B]"
      >
        로그인
      </button>
    );
  }

  const menuItems = [
    ...(userProfile?.is_admin
      ? [{ label: 'AgentGo DAM으로 이동', action: 'admin' }]
      : []),
    { label: '로그아웃', action: 'logout' },
  ];

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={`flex items-center gap-1.5 p-[3px_9px] rounded-xs hover:bg-[#E2E8F0] cursor-pointer ${menuOpen && 'bg-[#E2E8F0]'}`}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <div className="border border-border-neutral w-8 h-8 rounded-full flex items-center justify-center text-[#1D293D] text-sm bg-white">
          {userProfile?.name.charAt(0) ?? ''}
        </div>
        <div className="text-text-secondary font-bold text-sm">
          {userProfile?.name ?? ''}
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-10 right-0 z-[100] bg-white border border-border-neutral rounded-xs py-1 min-w-[216px]">
          {menuItems.map((item) => (
            <button
              key={item.action}
              onClick={() => handleAction(item.action)}
              className={`w-full text-left px-3 py-1.5 text-[14px] hover:bg-[#F1F5F9] text-[#1D293D] `}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
