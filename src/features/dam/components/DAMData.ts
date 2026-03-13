import type { FileType } from './DAMFileIcons';

export interface AITag {
  category: string;
  value: string;
  reason: string;
}

export interface WorkfrontInfo {
  projectName: string;
  projectId: string;
  documentId: string;
  taskName: string;
  taskDescription: string;
}

export interface DAMFile {
  id: string;
  type: FileType;
  name: string;
  person: string;
  size: string;
  modifiedAt: string;
  createdAt?: string;
  thumbnail?: string;
  url?: string;
  folder?: string;
  referenceImages?: string[];
  metadata?: Record<string, string>;

  // New fields for detail tabs
  title?: string;
  description?: string;
  author?: string;
  status?: 'approved' | 'rejected' | 'pending' | 'none';
  resolution?: string;

  // Advanced
  make?: string;
  model?: string;
  gps?: {
    lat: string;
    lng: string;
    alt: string;
  };
  lens?: string;
  expirationDate?: string;

  // Tags (AI)
  aiTags?: AITag[];
  aiSummary?: string;

  // Workfront
  workfront?: WorkfrontInfo;
}

export interface DAMTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  creator: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  dueDate: string;
}

export interface DAMCollection {
  id: string;
  name: string;
  assetCount: number;
}

export const MOCK_FILES: DAMFile[] = [
  {
    id: '1',
    type: 'folder',
    name: '2026',
    person: 'James Rodriguez',
    size: '-',
    modifiedAt: '2026.01.02 오전 11:30',
  },
  {
    id: '3',
    type: 'image',
    name: 'Natalie Clark.jpg',
    person: 'Natalie Clark',
    size: '328.5MB',
    modifiedAt: '2026.03.03 14:30',
    createdAt: '2026.03.03 10:00',
    thumbnail:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=60',
    title: '2026 S/S 신상 수납장 화보',
    description:
      '내추럴 우드 톤의 거실 인테리어 화보입니다. 따뜻한 무드와 수납장의 질감을 강조했습니다.',
    status: 'approved',
    author: 'AgentGo Creative Team',
    resolution: '3840 x 2160',
    make: 'Sony',
    model: 'ILCE-7RM4',
    gps: { lat: '37.5665', lng: '126.9780', alt: '12.5m' },
    lens: 'FE 24-70mm F2.8 GM',
    expirationDate: '2027-12-31',
    aiTags: [
      {
        category: '유형',
        value: '수납장',
        reason: '이미지 중앙의 가구 형태 분석',
      },
      {
        category: '소재',
        value: '우드톤',
        reason: '표면 질감과 색상 데이터 기반',
      },
      { category: '무드', value: '따뜻함', reason: '조명 색온도 및 색조 분석' },
      {
        category: '색상',
        value: '베이지',
        reason: '전체 픽셀의 우세 색상 추출',
      },
    ],
    aiSummary:
      '본 이미지는 내추럴 우드 소재의 수납장을 주인공으로 한 인테리어 화보입니다. 따뜻한 색조와 부드러운 조명이 특징이며, 거실이나 침실 가구 마케팅 소재로 적합합니다.',
    workfront: {
      projectName: '2026 Spring Collection Campaign',
      projectId: 'PRJ-9988-AX',
      documentId: 'DOC-2026-0303',
      taskName: '화보 이미지 최종 검토',
      taskDescription:
        '시즌 카탈로그 삽입용 이미지의 메타데이터와 품질을 최종 확인합니다.',
    },
    referenceImages: [
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&auto=format&fit=crop&q=60',
    ],
  },
  {
    id: '6',
    type: 'video',
    name: 'David Garcia.mp4',
    person: 'Isabella Anderson',
    size: '7.2GB',
    modifiedAt: '2026.01.02 오전 11:30',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    status: 'pending',
    aiTags: [
      {
        category: '유형',
        value: '브랜드 필름',
        reason: '영상 시퀀스 분석 결과',
      },
    ],
  },
];
