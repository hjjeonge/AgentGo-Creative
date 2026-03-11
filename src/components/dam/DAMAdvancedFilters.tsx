import type React from 'react';
import { useState } from 'react';
import ArrowDown from '../../assets/arrow_down.svg';
import type { FilterState } from './DAMFilters';

interface Props {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ASSET_STATUS = [
  { label: 'All', value: 'all' },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'No Status', value: 'none' },
];

const FILE_TYPES = [
  { label: 'Images', value: 'image' },
  { label: 'Documents', value: 'pdf' },
  { label: 'Video', value: 'video' },
  { label: 'Folder', value: 'folder' },
];

const MIME_TYPES = ['JPG', 'PNG', 'TIFF', 'GIF', 'MP4', 'PDF', 'ZIP', 'CSV'];

export const DAMAdvancedFilters: React.FC<Props> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
}: Props) => {
  const [expanded, setExpanded] = useState<string[]>([
    'STATUS',
    'TYPE',
    'MIME',
  ]);

  const toggleSection = (section: string) => {
    setExpanded((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const handleMimeChange = (mime: string) => {
    const next = filters.mimeTypes.includes(mime)
      ? filters.mimeTypes.filter((m) => m !== mime)
      : [...filters.mimeTypes, mime];
    onFiltersChange({ ...filters, mimeTypes: next });
  };

  if (!isOpen) return null;

  return (
    <aside className="w-[220px] shrink-0 bg-white border-r border-[#E2E8F0] overflow-y-auto flex flex-col">
      <div className="px-[16px] py-[14px] border-b border-[#E2E8F0] flex items-center justify-between">
        <span className="text-[14px] font-semibold text-[#0F172B]">
          FILTERS
        </span>
        <button
          onClick={onToggle}
          className="text-[#94A3B8] text-[12px] hover:text-[#0F172B]"
        >
          Hide
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ASSET STATUS */}
        <div className="border-b border-[#F1F5F9]">
          <button
            onClick={() => toggleSection('STATUS')}
            className="w-full px-[16px] py-[12px] flex items-center justify-between group"
          >
            <span className="text-[12px] font-semibold text-[#475569] tracking-tight">
              ASSET STATUS
            </span>
            <img
              src={ArrowDown}
              className={`w-[10px] h-[10px] transition-transform ${
                expanded.includes('STATUS') ? '' : '-rotate-90'
              }`}
            />
          </button>
          {expanded.includes('STATUS') && (
            <div className="px-[16px] pb-[16px] flex flex-col gap-[8px]">
              {ASSET_STATUS.map((s) => (
                <label
                  key={s.value}
                  className="flex items-center gap-[8px] cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="status"
                      checked={
                        filters.status === s.value ||
                        (!filters.status && s.value === 'all')
                      }
                      onChange={() =>
                        onFiltersChange({
                          ...filters,
                          status: s.value === 'all' ? null : s.value,
                        })
                      }
                      className="peer appearance-none w-[16px] h-[16px] border border-[#CBD5E1] rounded-full checked:border-[#155DFC] transition-all"
                    />
                    <div className="absolute w-[8px] h-[8px] bg-[#155DFC] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-[13px] text-[#475569] group-hover:text-[#0F172B]">
                    {s.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* FILE TYPE */}
        <div className="border-b border-[#F1F5F9]">
          <button
            onClick={() => toggleSection('TYPE')}
            className="w-full px-[16px] py-[12px] flex items-center justify-between group"
          >
            <span className="text-[12px] font-semibold text-[#475569] tracking-tight">
              FILE TYPE
            </span>
            <img
              src={ArrowDown}
              className={`w-[10px] h-[10px] transition-transform ${
                expanded.includes('TYPE') ? '' : '-rotate-90'
              }`}
            />
          </button>
          {expanded.includes('TYPE') && (
            <div className="px-[16px] pb-[16px] flex flex-col gap-[8px]">
              {FILE_TYPES.map((t) => (
                <label
                  key={t.value}
                  className="flex items-center gap-[8px] cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={filters.fileType === t.value}
                      onChange={() =>
                        onFiltersChange({
                          ...filters,
                          fileType:
                            filters.fileType === t.value ? null : t.value,
                        })
                      }
                      className="peer appearance-none w-[16px] h-[16px] border border-[#CBD5E1] rounded-[4px] checked:bg-[#155DFC] checked:border-[#155DFC] transition-all"
                    />
                    <svg
                      className="absolute w-[10px] h-[10px] text-white scale-0 peer-checked:scale-100 transition-transform"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 5L4 7L8 3" />
                    </svg>
                  </div>
                  <span className="text-[13px] text-[#475569] group-hover:text-[#0F172B]">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* MIME TYPE */}
        <div>
          <button
            onClick={() => toggleSection('MIME')}
            className="w-full px-[16px] py-[12px] flex items-center justify-between group"
          >
            <span className="text-[12px] font-semibold text-[#475569] tracking-tight">
              MIME TYPE
            </span>
            <img
              src={ArrowDown}
              className={`w-[10px] h-[10px] transition-transform ${
                expanded.includes('MIME') ? '' : '-rotate-90'
              }`}
            />
          </button>
          {expanded.includes('MIME') && (
            <div className="px-[16px] pb-[16px] grid grid-cols-2 gap-[8px]">
              {MIME_TYPES.map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-[6px] cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      checked={filters.mimeTypes.includes(m)}
                      onChange={() => handleMimeChange(m)}
                      className="peer appearance-none w-[14px] h-[14px] border border-[#CBD5E1] rounded-[3px] checked:bg-[#155DFC] checked:border-[#155DFC] transition-all"
                    />
                    <svg
                      className="absolute w-[8px] h-[8px] text-white scale-0 peer-checked:scale-100 transition-transform"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M2 5L4 7L8 3" />
                    </svg>
                  </div>
                  <span className="text-[12px] text-[#475569] group-hover:text-[#0F172B]">
                    {m}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-[16px] border-t border-[#E2E8F0]">
        <button
          onClick={() =>
            onFiltersChange({
              fileType: null,
              person: null,
              dateFrom: null,
              dateTo: null,
              status: null,
              mimeTypes: [],
            })
          }
          className="w-full py-[8px] border border-[#CBD5E1] rounded-[8px] text-[13px] text-[#475569] hover:bg-[#F1F5F9]"
        >
          필터 초기화
        </button>
      </div>
    </aside>
  );
};
