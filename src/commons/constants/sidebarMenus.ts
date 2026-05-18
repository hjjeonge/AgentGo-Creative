import type { ComponentType } from 'react';

import { CreateIcon } from '@/commons/components/icons/CreateIcon';
import { DashboardIcon } from '@/commons/components/icons/DashboardIcon';
import { HistoryIcon } from '@/commons/components/icons/HistoryIcon';

type SidebarMenu = {
  id: 'home' | 'create' | 'history';
  Icon: ComponentType;
  label: '홈' | '생성' | '기록';
  to?: string;
  isActive: (pathname: string) => boolean;
};

export const sidebarMenus: SidebarMenu[] = [
  {
    id: 'home',
    Icon: DashboardIcon,
    label: '홈',
    to: '/',
    isActive: (pathname: string) => pathname === '/',
  },
  {
    id: 'create',
    Icon: CreateIcon,
    label: '생성',
    isActive: (pathname: string) =>
      pathname === '/template' || pathname.startsWith('/editor/'),
  },
  {
    id: 'history',
    Icon: HistoryIcon,
    label: '기록',
    to: '/history',
    isActive: (pathname: string) =>
      pathname === '/history' || pathname.startsWith('/history/'),
  },
] as const;
