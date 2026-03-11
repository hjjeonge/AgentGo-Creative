import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import ArrowDown from '../../assets/arrow_down.svg';
import { listUploaders, type UploaderInfo } from '../../services/dam';

export interface FilterState {
  fileType: string | null;
  person: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  status: string | null;
  mimeTypes: string[];
}

const FILE_TYPES = [
  { label: '폴더', value: 'folder' },
  { label: '동영상', value: 'video' },
  { label: 'PDFs', value: 'pdf' },
  { label: '압축파일', value: 'zip' },
  { label: '이미지', value: 'image' },
  { label: '기타', value: 'other' },
];

const FILE_TYPE_ICONS: Record<string, React.ReactNode> = {
  folder: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 3.5C1 3.22 1.22 3 1.5 3H4.8L5.8 4H12.5C12.78 4 13 4.22 13 4.5V11C13 11.28 12.78 11.5 12.5 11.5H1.5C1.22 11.5 1 11.28 1 11V3.5Z"
        fill="#3B82F6"
      />
    </svg>
  ),
  video: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="3" width="12" height="8" rx="1.5" fill="#64748B" />
      <path d="M5.5 5.5L9.5 7L5.5 8.5V5.5Z" fill="white" />
    </svg>
  ),
  pdf: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="1" width="10" height="12" rx="1.5" fill="#64748B" />
      <text x="3.5" y="10" fontSize="4" fill="white" fontWeight="bold">
        PDF
      </text>
    </svg>
  ),
  zip: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="1" width="10" height="12" rx="1.5" fill="#475569" />
      <rect x="5.5" y="1" width="3" height="1.5" fill="#94A3B8" />
      <rect x="5.5" y="4" width="3" height="1.5" fill="#94A3B8" />
      <rect x="5.5" y="7" width="3" height="1.5" fill="#94A3B8" />
    </svg>
  ),
  image: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="3" width="12" height="8" rx="1.5" fill="#64748B" />
      <circle cx="4.5" cy="5.5" r="1" fill="#CBD5E1" />
      <path
        d="M1 10L4 7L6.5 9.5L9 7L13 10"
        stroke="#CBD5E1"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  ),
  other: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" fill="#64748B" />
      <circle cx="4" cy="7" r="1" fill="white" />
      <circle cx="7" cy="7" r="1" fill="white" />
      <circle cx="10" cy="7" r="1" fill="white" />
    </svg>
  ),
};

const DATE_PRESETS = [
  '오늘',
  '지난 7일',
  '지난 30일',
  '올해 (2026)',
  '지난해 (2025)',
];

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function getInitials(name: string): string {
  return name.charAt(0);
}

function getAvatarColor(name: string): string {
  const colors = ['#155DFC', '#7C3AED', '#059669', '#D97706', '#DC2626'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash;
  return colors[Math.abs(hash) % colors.length];
}

interface CalendarProps {
  value: string;
  onChange: (date: string) => void;
}

const MiniCalendar: React.FC<CalendarProps> = ({
  value,
  onChange,
}: CalendarProps) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    value ? new Date(value).getFullYear() : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    value ? new Date(value).getMonth() : today.getMonth(),
  );

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = (firstDay + 6) % 7; // 월요일 시작

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selected = value ? new Date(value) : null;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-md p-[12px] w-[200px]">
      <div className="flex items-center justify-between mb-[8px]">
        <button
          onClick={() => {
            if (viewMonth === 0) {
              setViewMonth(11);
              setViewYear((y) => y - 1);
            } else setViewMonth((m) => m - 1);
          }}
          className="w-[20px] h-[20px] text-[#64748B] flex items-center justify-center hover:text-[#0F172B]"
        >
          ‹
        </button>
        <span className="text-[12px] font-medium text-[#0F172B]">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button
          onClick={() => {
            if (viewMonth === 11) {
              setViewMonth(0);
              setViewYear((y) => y + 1);
            } else setViewMonth((m) => m + 1);
          }}
          className="w-[20px] h-[20px] text-[#64748B] flex items-center justify-center hover:text-[#0F172B]"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-[2px] mb-[4px]">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] text-[#94A3B8] py-[2px]"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[2px]">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = selected && dateStr === value;
          return (
            <button
              key={idx}
              onClick={() => onChange(dateStr)}
              className={`w-[24px] h-[24px] rounded-full text-[11px] mx-auto flex items-center justify-center ${
                isSelected
                  ? 'bg-[#155DFC] text-white'
                  : 'text-[#0F172B] hover:bg-[#F1F5F9]'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface Props {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

type DropdownType = 'fileType' | 'person' | 'date' | null;

export const DAMFilters: React.FC<Props> = ({
  filters,
  onFiltersChange,
}: Props) => {
  const [open, setOpen] = useState<DropdownType>(null);
  const [dateCalendarMode, setDateCalendarMode] = useState<
    'from' | 'to' | null
  >(null);
  const [uploaders, setUploaders] = useState<UploaderInfo[]>([]);

  useEffect(() => {
    listUploaders()
      .then(setUploaders)
      .catch(() => {});
  }, []);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(null);
        setDateCalendarMode(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (type: DropdownType) =>
    setOpen((prev) => (prev === type ? null : type));

  const isDateActive = filters.dateFrom !== null || filters.dateTo !== null;

  return (
    <div ref={wrapRef} className="flex items-center gap-[8px] relative">
      {/* 파일 유형 */}
      <div className="relative">
        <button
          onClick={() => toggle('fileType')}
          className={`flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border text-[13px] ${
            filters.fileType
              ? 'border-[#155DFC] text-[#155DFC] bg-[#EFF6FF]'
              : 'border-[#CBD5E1] text-[#475569] bg-white'
          }`}
        >
          파일 유형
          <img
            src={ArrowDown}
            className={`w-[10px] h-[10px] transition-transform ${open === 'fileType' ? 'rotate-180' : ''}`}
          />
        </button>
        {open === 'fileType' && (
          <div className="absolute top-[calc(100%+4px)] left-0 z-[50] bg-white border border-[#E2E8F0] rounded-[8px] shadow-lg py-[4px] min-w-[120px]">
            {FILE_TYPES.map((ft) => (
              <button
                key={ft.value}
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    fileType: filters.fileType === ft.value ? null : ft.value,
                  });
                  setOpen(null);
                }}
                className={`w-full flex items-center gap-[8px] px-[14px] py-[8px] text-[13px] hover:bg-[#F1F5F9] ${
                  filters.fileType === ft.value
                    ? 'text-[#155DFC] bg-[#EFF6FF]'
                    : 'text-[#0F172B]'
                }`}
              >
                {FILE_TYPE_ICONS[ft.value]}
                {ft.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 사람 */}
      <div className="relative">
        <button
          onClick={() => toggle('person')}
          className={`flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border text-[13px] ${
            filters.person
              ? 'border-[#155DFC] text-[#155DFC] bg-[#EFF6FF]'
              : 'border-[#CBD5E1] text-[#475569] bg-white'
          }`}
        >
          사람
          <img
            src={ArrowDown}
            className={`w-[10px] h-[10px] transition-transform ${open === 'person' ? 'rotate-180' : ''}`}
          />
        </button>
        {open === 'person' && (
          <div className="absolute top-[calc(100%+4px)] left-0 z-[50] bg-white border border-[#E2E8F0] rounded-[8px] shadow-lg py-[4px] min-w-[220px]">
            {uploaders.length === 0 ? (
              <div className="px-[14px] py-[10px] text-[13px] text-[#94A3B8]">
                업로더 없음
              </div>
            ) : (
              uploaders.map((person) => (
                <button
                  key={person.id}
                  onClick={() => {
                    onFiltersChange({
                      ...filters,
                      person:
                        filters.person === person.name ? null : person.name,
                    });
                    setOpen(null);
                  }}
                  className={`w-full flex items-center gap-[10px] px-[14px] py-[8px] text-left hover:bg-[#F1F5F9] ${
                    filters.person === person.name ? 'bg-[#EFF6FF]' : ''
                  }`}
                >
                  <div
                    className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-white text-[12px] font-medium shrink-0"
                    style={{ backgroundColor: getAvatarColor(person.name) }}
                  >
                    {getInitials(person.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] text-[#0F172B]">
                      {person.name}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {person.email}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* 수정 날짜 */}
      <div className="relative">
        <button
          onClick={() => toggle('date')}
          className={`flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border text-[13px] ${
            isDateActive
              ? 'border-[#155DFC] text-[#155DFC] bg-[#EFF6FF]'
              : 'border-[#CBD5E1] text-[#475569] bg-white'
          }`}
        >
          수정 날짜
          <img
            src={ArrowDown}
            className={`w-[10px] h-[10px] transition-transform ${open === 'date' ? 'rotate-180' : ''}`}
          />
        </button>
        {open === 'date' && (
          <div className="absolute top-[calc(100%+4px)] left-0 z-[50] flex">
            {/* 프리셋 목록 */}
            <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-lg py-[4px] min-w-[130px]">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    const now = new Date();
                    let from: string | null = null;
                    if (preset === '오늘')
                      from = now.toISOString().slice(0, 10);
                    else if (preset === '지난 7일') {
                      const d = new Date(now);
                      d.setDate(d.getDate() - 7);
                      from = d.toISOString().slice(0, 10);
                    } else if (preset === '지난 30일') {
                      const d = new Date(now);
                      d.setDate(d.getDate() - 30);
                      from = d.toISOString().slice(0, 10);
                    } else if (preset.startsWith('올해')) {
                      from = `${now.getFullYear()}-01-01`;
                    } else if (preset.startsWith('지난해')) {
                      from = `${now.getFullYear() - 1}-01-01`;
                    }
                    onFiltersChange({
                      ...filters,
                      dateFrom: from,
                      dateTo: now.toISOString().slice(0, 10),
                    });
                    setOpen(null);
                  }}
                  className="w-full text-left px-[16px] py-[8px] text-[13px] text-[#0F172B] hover:bg-[#F1F5F9]"
                >
                  {preset}
                </button>
              ))}
              <button
                onClick={() => setDateCalendarMode('from')}
                className="w-full flex items-center justify-between px-[16px] py-[8px] text-[13px] text-[#0F172B] hover:bg-[#F1F5F9]"
              >
                맞춤 기간
                <span className="text-[#94A3B8]">›</span>
              </button>
            </div>

            {/* 날짜 범위 입력 + 캘린더 */}
            {dateCalendarMode && (
              <div className="ml-[4px] bg-white border border-[#E2E8F0] rounded-[8px] shadow-lg p-[12px]">
                <div className="flex flex-col gap-[8px] mb-[10px]">
                  {(['from', 'to'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDateCalendarMode(mode)}
                      className={`flex items-center gap-[8px] border rounded-[6px] px-[10px] py-[6px] text-[12px] ${
                        dateCalendarMode === mode
                          ? 'border-[#155DFC]'
                          : 'border-[#CBD5E1]'
                      }`}
                    >
                      <span className="text-[#94A3B8]">
                        {mode === 'from' ? '이후' : '이전'}
                      </span>
                      <span className="flex-1 text-left text-[#0F172B]">
                        {mode === 'from'
                          ? (filters.dateFrom ?? '')
                          : (filters.dateTo ?? '')}
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <rect
                          x="1"
                          y="2"
                          width="12"
                          height="11"
                          rx="1.5"
                          stroke="#94A3B8"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M4 1V3M10 1V3"
                          stroke="#94A3B8"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                        <path d="M1 6H13" stroke="#94A3B8" strokeWidth="1.2" />
                      </svg>
                    </button>
                  ))}
                </div>
                <MiniCalendar
                  value={
                    dateCalendarMode === 'from'
                      ? (filters.dateFrom ?? '')
                      : (filters.dateTo ?? '')
                  }
                  onChange={(date) => {
                    if (dateCalendarMode === 'from')
                      onFiltersChange({ ...filters, dateFrom: date });
                    else onFiltersChange({ ...filters, dateTo: date });
                  }}
                />
                <div className="flex justify-end gap-[8px] mt-[10px]">
                  <button
                    onClick={() => {
                      onFiltersChange({
                        ...filters,
                        dateFrom: null,
                        dateTo: null,
                      });
                      setOpen(null);
                      setDateCalendarMode(null);
                    }}
                    className="px-[12px] py-[6px] text-[12px] text-[#64748B]"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      setOpen(null);
                      setDateCalendarMode(null);
                    }}
                    className="px-[12px] py-[6px] text-[12px] text-[#155DFC] font-medium"
                  >
                    적용
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
