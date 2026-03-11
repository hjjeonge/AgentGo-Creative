import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearTokens, getAccessToken } from '../../utils/tokenManager';
import { useLogoutMutation } from '../../queries/auth/useLogoutMutation';
import { useUserProfileQuery } from '../../queries/auth/useUserProfileQuery';
import Dots from './../../assets/dots.svg';

export const UserCard: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: logoutMutateAsync } = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState('User');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthed, setIsAuthed] = useState(!!getAccessToken());
  const wrapRef = useRef<HTMLDivElement>(null);
  const token = getAccessToken();
  const isDevToken = import.meta.env.DEV && token === 'dev-token';

  const { data: userProfile, isError } = useUserProfileQuery({
    enabled: Boolean(token) && !isDevToken,
  });

  useEffect(() => {
    if (!token) return;
    if (isDevToken) {
      setName('테스트');
      setEmail('test@itcen.com');
      setIsAdmin(true);
    }
  }, [isDevToken, token]);

  useEffect(() => {
    if (!userProfile) return;
    setName(userProfile.name);
    setEmail(userProfile.email);
    setIsAdmin(!!userProfile.is_admin);
  }, [userProfile]);

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
    ...(isAdmin ? [{ label: '관리자', action: 'admin' }] : []),
    { label: '로그아웃', action: 'logout' },
  ];

  return (
    <div ref={wrapRef} className="relative">
      <div className="w-[270px] h-[42px] p-[14px] rounded-[8px] border border-[#569DFF]/20 bg-[#F8FAFF] flex items-center justify-between">
        <div className="w-[28px] h-[28px] bg-[linear-gradient(135deg,#0055E9_0%,#6A14D9_100%)] flex items-center justify-center rounded-full text-[12px] text-white leading-[18px] font-bold shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex-1 flex items-center gap-[3px] justify-center">
          <span className="text-[#1E1E1E] text-[13px] font-semibold leading-tight truncate">
            {name}
          </span>
          <span className="text-[#9CA3AF] text-[11px] leading-tight truncate">
            {email}
          </span>
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
                item.action === 'logout' ? 'text-[#E11D48]' : 'text-[#0F172B]'
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
