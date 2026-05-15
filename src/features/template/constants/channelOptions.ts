export type ChannelId =
  | 'ig_feed'
  | 'ig_story'
  | 'youtube'
  | 'banner'
  | 'blog'
  | 'naver'
  | 'crm_email'
  | 'kakao'
  | 'poster';

export type FunnelGroup = 'awareness' | 'trust' | 'convert';

export interface Channel {
  id: ChannelId;
  group: FunnelGroup;
  label: string;
  size: string;
  role: string;
  desc: string;
  icon: string;
}

export interface ChannelPolicy {
  maxChars: number;
  format: string;
  toneShift: string;
  rules: string;
  compliance: string;
}

export const FUNNEL_META: Record<FunnelGroup, { num: string; title: string }> =
  {
    awareness: { num: '01', title: '인지 단계' },
    trust: { num: '02', title: '신뢰 형성' },
    convert: { num: '03', title: '전환 직전' },
  };

export const CHANNELS: Channel[] = [
  {
    id: 'ig_feed',
    group: 'awareness',
    label: '인스타그램 피드',
    size: '1:1',
    role: 'REACH',
    desc: '정사각 비주얼 + 짧은 캡션',
    icon: '📷',
  },
  {
    id: 'ig_story',
    group: 'awareness',
    label: '인스타그램 스토리/릴스',
    size: '9:16',
    role: 'REACH',
    desc: '세로형 후킹 영상 / 슬라이드',
    icon: '📱',
  },
  {
    id: 'youtube',
    group: 'awareness',
    label: '유튜브 썸네일',
    size: '16:9',
    role: 'SEARCH',
    desc: '클릭유도형 텍스트 오버레이',
    icon: '▶',
  },
  {
    id: 'banner',
    group: 'awareness',
    label: '디스플레이 배너',
    size: '가로',
    role: 'REACH',
    desc: '728×90 또는 300×250 배너',
    icon: '🖼',
  },
  {
    id: 'blog',
    group: 'trust',
    label: '브랜드 블로그',
    size: 'LONG',
    role: 'TRUST',
    desc: '썸네일 + 헤더 + 본문 구조',
    icon: '📝',
  },
  {
    id: 'naver',
    group: 'trust',
    label: '네이버 카페/지식인',
    size: 'PC',
    role: 'TRUST',
    desc: 'Q&A형 / 후기형 게시글',
    icon: '🔍',
  },
  {
    id: 'crm_email',
    group: 'trust',
    label: 'CRM 이메일',
    size: '600px',
    role: 'RETAIN',
    desc: '헤더 이미지 + 본문 + 푸터',
    icon: '✉',
  },
  {
    id: 'kakao',
    group: 'convert',
    label: '카카오톡 채널/알림톡',
    size: 'MSG',
    role: 'BOOK',
    desc: '1,000자 이내 · 버튼형 CTA',
    icon: '💬',
  },
  {
    id: 'poster',
    group: 'convert',
    label: '옥외 광고/포스터',
    size: 'A4',
    role: 'LOCAL',
    desc: '원내 포스터 / 현수막 소재',
    icon: '📋',
  },
];

export const CHANNEL_POLICIES: Record<ChannelId, ChannelPolicy> = {
  ig_feed: {
    maxChars: 220,
    format: '1:1 정사각 + 캡션',
    toneShift: '친근형 후킹',
    rules: '해시태그 5~7개 · CTA 캡션 끝',
    compliance: 'Before/After 자제 · 면책 1줄',
  },
  ig_story: {
    maxChars: 80,
    format: '9:16 세로 슬라이드 3컷',
    toneShift: '임팩트형 · 짧은 한 줄',
    rules: '스와이프업 CTA · 24h 한정',
    compliance: '과장 표현 금지 · 면책 자막',
  },
  youtube: {
    maxChars: 30,
    format: '16:9 썸네일 + 짧은 텍스트',
    toneShift: '후킹형',
    rules: '텍스트 ≤8자 굵게 · 색대비',
    compliance: '사전 심의 대상 매체 확인',
  },
  banner: {
    maxChars: 25,
    format: '728×90 / 300×250 디스플레이',
    toneShift: '직접 CTA',
    rules: '한 줄 헤드라인 + CTA 버튼',
    compliance: '사전 심의 대상 · 가격 표기',
  },
  blog: {
    maxChars: 800,
    format: '썸네일 + H2 + 본문 + CTA',
    toneShift: '신뢰형 서술',
    rules: '서론-본론-결론 · FAQ 3건',
    compliance: '효과 단정 금지 · 출처 인용',
  },
  naver: {
    maxChars: 500,
    format: 'Q&A형 또는 후기형 게시글',
    toneShift: '정보형',
    rules: '키워드 자연 노출 · 해시태그 4~5개',
    compliance: '후기 직접 인용 금지',
  },
  crm_email: {
    maxChars: 600,
    format: '헤더 이미지 + 본문 + CTA + 푸터',
    toneShift: '공식형 · 신뢰형',
    rules: '수신거부 · 개인정보처리방침 푸터',
    compliance: '광고 [표기] · 가격 기준일',
  },
  kakao: {
    maxChars: 200,
    format: '카드뷰 + 버튼형 CTA',
    toneShift: '정중형',
    rules: '수신거부 명시 · 정해진 시간 발송',
    compliance: '광고 [채널] 표기 · 가격 명시',
  },
  poster: {
    maxChars: 120,
    format: 'A4 세로 / 옥외',
    toneShift: '공식형',
    rules: '면책 자막 · 정상가↔이벤트가 비교',
    compliance: '심의 번호 · 사진 보정 금지',
  },
};
