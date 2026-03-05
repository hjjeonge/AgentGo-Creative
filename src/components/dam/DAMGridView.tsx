import type React from 'react';
import { useState } from 'react';
import DotsIcon from '../../assets/dots.svg';
import { FileIcon } from './DAMFileIcons';
import { type DAMFile } from './DAMData';

interface Props {
  files: DAMFile[];
  onContextMenu: (e: React.MouseEvent, fileId: string) => void;
  onDotsClick: (e: React.MouseEvent, fileId: string) => void;
  onDownload?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
}

export const DAMGridView: React.FC<Props> = ({
  files,
  onContextMenu,
  onDotsClick,
  onDownload,
  onDelete,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    if (status === 'approved') return 'bg-[#16A34A]';
    if (status === 'rejected') return 'bg-[#DC2626]';
    if (status === 'pending') return 'bg-[#D97706]';
    return 'bg-[#64748B]';
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-[24px] p-[24px]">
      {files.map((file) => (
        <div
          key={file.id}
          onContextMenu={(e) => onContextMenu(e, file.id)}
          onMouseEnter={() => setHoveredId(file.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative flex flex-col gap-[12px] p-[12px] bg-white rounded-[12px] border border-[#E2E8F0] hover:border-[#155DFC] hover:shadow-lg transition-all cursor-pointer"
        >
          {/* 썸네일 & 퀵액션 오버레이 */}
          <div className="relative aspect-square bg-[#F8FAFC] rounded-[8px] flex items-center justify-center overflow-hidden">
            {file.thumbnail ? (
              <img
                src={file.thumbnail}
                alt={file.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <FileIcon type={file.type} size={48} />
            )}

            {/* 호버 시 퀵액션 오버레이 */}
            <div
              className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-[10px] transition-opacity duration-200 ${hoveredId === file.id ? 'opacity-100' : 'opacity-0'}`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload?.(file.id);
                }}
                className="w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#155DFC] group/btn transition-colors"
                title="다운로드"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-[#475569] group-hover/btn:text-white"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(file.id);
                }}
                className="w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#DC2626] group/btn transition-colors"
                title="삭제"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-[#475569] group-hover/btn:text-white"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>

            {/* 승인 상태 뱃지 (우측 하단) */}
            {file.status && file.status !== 'none' && (
              <div
                className={`absolute bottom-[8px] right-[8px] inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-[4px] text-[10px] font-bold uppercase text-white shadow-sm ${getStatusColor(file.status)}`}
              >
                <span className="w-[5px] h-[5px] rounded-full bg-white/90" />
                {file.status}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center justify-between gap-[8px]">
              <span className="flex-1 text-[13px] font-bold text-[#0F172B] truncate">
                {file.name}
              </span>
              <button
                onClick={(e) => onDotsClick(e, file.id)}
                className="w-[24px] h-[24px] flex items-center justify-center rounded-[4px] opacity-0 group-hover:opacity-100 hover:bg-[#F1F5F9] transition-opacity"
              >
                <img src={DotsIcon} className="w-[14px] h-[14px]" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span>{file.size}</span>
              <span>{file.modifiedAt.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
