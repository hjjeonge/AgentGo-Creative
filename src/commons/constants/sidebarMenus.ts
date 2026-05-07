import { CreateIcon } from '@/commons/components/icons/CreateIcon';
import { DashboardIcon } from '@/commons/components/icons/DashboardIcon';
import { HistoryIcon } from '@/commons/components/icons/HistoryIcon';

export const sidebarMenus = [
  {
    Icon: DashboardIcon,
    label: '홈',
    to: '/',
    isActive: (pathname: string) => pathname === '/',
  },
  {
    Icon: CreateIcon,
    label: '생성',
    to: '/template',
    isActive: (pathname: string) =>
      pathname === '/template' || pathname.startsWith('/editor/'),
  },
  {
    Icon: HistoryIcon,
    label: '기록',
    to: '/history',
    isActive: (pathname: string) => pathname === '/history',
  },
] as const;
