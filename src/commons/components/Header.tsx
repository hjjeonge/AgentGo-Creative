import type React from 'react';
import { useNavigate } from 'react-router-dom';

import Logo from '@/assets/logo.svg';

import { UserCard } from './UserCard';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[52px] fixed left-0 top-0 right-0 bg-white p-[24px_32px] flex items-center justify-between border-b border-[#CAD5E2]">
      <button onClick={() => navigate('/')}>
        <img src={Logo} />
      </button>
      <UserCard />
    </div>
  );
};
