export interface SizeOption {
  ratio: string;
  priority: 'core' | 'optional' | 'special';
  recommendedFor: string[];
  note: string;
}

export const SIZE_OPTIONS: SizeOption[] = [
  {
    ratio: '1:1',
    priority: 'core',
    recommendedFor: ['Social Feed', 'Display Ad', 'Commerce Thumbnail'],
    note: '범용 피드/썸네일',
  },
  {
    ratio: '3:2',
    priority: 'optional',
    recommendedFor: ['Web Content', 'Blog', 'PR Image'],
    note: '콘텐츠 대표 이미지',
  },
  {
    ratio: '2:3',
    priority: 'optional',
    recommendedFor: ['Pinterest', 'Vertical Content', 'Product Detail'],
    note: '세로형 콘텐츠',
  },
  {
    ratio: '3:4',
    priority: 'optional',
    recommendedFor: ['Mobile Content', 'App Card', 'Commerce Detail'],
    note: '모바일 카드/상세',
  },
  {
    ratio: '4:3',
    priority: 'optional',
    recommendedFor: ['Web Banner', 'Newsletter', 'Presentation'],
    note: '웹/CRM 범용 이미지',
  },
  {
    ratio: '4:5',
    priority: 'core',
    recommendedFor: ['Instagram Feed', 'Facebook Feed', 'LinkedIn Feed'],
    note: '모바일 피드',
  },
  {
    ratio: '5:4',
    priority: 'optional',
    recommendedFor: ['Desktop Card', 'Product Image', 'Brand Content'],
    note: '데스크톱 카드형',
  },
  {
    ratio: '9:16',
    priority: 'core',
    recommendedFor: ['Instagram Stories/Reels', 'TikTok', 'YouTube Shorts'],
    note: '모바일 풀스크린',
  },
  {
    ratio: '16:9',
    priority: 'core',
    recommendedFor: ['YouTube', 'Web Hero', 'Video Thumbnail'],
    note: '가로형 영상/웹',
  },
  {
    ratio: '1:4',
    priority: 'special',
    recommendedFor: ['Mobile Vertical Banner', 'Long Scroll Content'],
    note: '초세로 배너',
  },
  {
    ratio: '4:1',
    priority: 'special',
    recommendedFor: ['Wide Web Banner', 'Email Header', 'Logo-like Banner'],
    note: '와이드 헤더',
  },
  {
    ratio: '1:8',
    priority: 'special',
    recommendedFor: ['Long Infographic', 'Vertical Scroll Asset'],
    note: '긴 세로형',
  },
  {
    ratio: '8:1',
    priority: 'special',
    recommendedFor: ['Ultra Wide Banner', 'OOH Display', 'Event Header'],
    note: '초와이드 배너',
  },
  {
    ratio: '21:9',
    priority: 'special',
    recommendedFor: ['Cinematic Hero', 'Wide Landing Banner', 'Large Display'],
    note: '시네마틱 와이드',
  },
];

export const SIZE_OPTION_MAP: Record<string, SizeOption> = Object.fromEntries(
  SIZE_OPTIONS.map((o) => [o.ratio, o]),
);

export const COMMON_SIZE_RATIOS = SIZE_OPTIONS.map((o) => o.ratio);
