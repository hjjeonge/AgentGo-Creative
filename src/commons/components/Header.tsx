import { useNavigate } from 'react-router-dom';

import Logo from '@/assets/logo.svg';

import { UserCard } from './UserCard';

import type React from 'react';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[72px] fixed left-0 top-0 right-0 bg-[#fff]/95 p-[24px_32px] flex items-center justify-between border-b border-[#569DFF]/20">
      <button onClick={() => navigate('/')}>
        <img src={Logo} />
      </button>
      <UserCard />
    </div>
  );
};
