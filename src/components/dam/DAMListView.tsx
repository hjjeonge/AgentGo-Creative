import type React from "react";
import { useState } from "react";
import DotsIcon from "../../assets/dots.svg";
import { FileIcon } from "./DAMFileIcons";
import { type DAMFile } from "./DAMData";
import { DownloadIcon, RenameIcon } from "./DAMViewIcons";

interface Props {
  files: DAMFile[];
  onContextMenu: (e: React.MouseEvent, fileId: string) => void;
  onDotsClick: (e: React.MouseEvent, fileId: string) => void;
  onDownload: (fileId: string) => void;
  onRename: (fileId: string) => void;
}

export const DAMListView: React.FC<Props> = ({ files, onContextMenu, onDotsClick, onDownload, onRename }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const getStatusStyle = (status?: string) => {
    if (status === "approved") return { label: "Approved", dot: "bg-[#16A34A]", text: "text-[#166534]" };
    if (status === "rejected") return { label: "Rejected", dot: "bg-[#DC2626]", text: "text-[#991B1B]" };
    if (status === "pending") return { label: "Pending", dot: "bg-[#D97706]", text: "text-[#9A3412]" };
    return { label: "No status", dot: "bg-[#94A3B8]", text: "text-[#64748B]" };
  };

  return (
    <div className="px-[20px]">
      {/* 헤더 */}
      <div className="grid grid-cols-[40px_1fr_140px_100px_170px_120px_64px] gap-[8px] px-[8px] py-[10px] border-b border-[#E2E8F0] text-[12px] text-[#94A3B8] font-medium">
        <span>종류</span>
        <span>이름</span>
        <span>사람</span>
        <span>크기</span>
        <span>수정한 날짜</span>
        <span>상태</span>
        <span />
      </div>

      {/* 행 */}
      {files.map((file) => (
        <div
          key={file.id}
          onContextMenu={(e) => onContextMenu(e, file.id)}
          onMouseEnter={() => setHoveredId(file.id)}
          onMouseLeave={() => setHoveredId(null)}
          className={`group grid grid-cols-[40px_1fr_140px_100px_170px_120px_64px] gap-[8px] px-[8px] py-[12px] border-b border-[#F1F5F9] items-center cursor-pointer ${
            hoveredId === file.id ? "bg-[#F8FAFC]" : ""
          }`}
        >
          <div className="flex items-center justify-center">
            <FileIcon type={file.type} size={18} />
          </div>
          <span className="text-[13px] text-[#0F172B] truncate">{file.name}</span>
          <span className="text-[13px] text-[#475569] truncate">{file.person}</span>
          <span className="text-[13px] text-[#475569]">{file.size}</span>
          <span className="text-[13px] text-[#475569]">{file.modifiedAt}</span>
          <span className={`inline-flex items-center gap-[6px] text-[12px] font-medium ${getStatusStyle(file.status).text}`}>
            <span className={`w-[8px] h-[8px] rounded-full ${getStatusStyle(file.status).dot}`} />
            {getStatusStyle(file.status).label}
          </span>
          <div className="flex items-center gap-[4px] justify-end">
            {hoveredId === file.id ? (
              <>
                <div className="relative group/dl">
                  <button
                    onClick={() => onDownload(file.id)}
                    className="w-[24px] h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#E2E8F0]"
                  >
                    <DownloadIcon />
                  </button>
                  <span className="absolute bottom-[calc(100%+4px)] right-0 bg-[#0F172B] text-white text-[11px] px-[6px] py-[3px] rounded-[4px] whitespace-nowrap opacity-0 group-hover/dl:opacity-100 pointer-events-none">
                    다운로드
                  </span>
                </div>
                <div className="relative group/rn">
                  <button
                    onClick={() => onRename(file.id)}
                    className="w-[24px] h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#E2E8F0]"
                  >
                    <RenameIcon />
                  </button>
                  <span className="absolute bottom-[calc(100%+4px)] right-0 bg-[#0F172B] text-white text-[11px] px-[6px] py-[3px] rounded-[4px] whitespace-nowrap opacity-0 group-hover/rn:opacity-100 pointer-events-none">
                    이름수정
                  </span>
                </div>
              </>
            ) : (
              <button
                onClick={(e) => onDotsClick(e, file.id)}
                className="w-[24px] h-[24px] flex items-center justify-center rounded-[4px] opacity-0 group-hover:opacity-100 hover:bg-[#E2E8F0]"
              >
                <img src={DotsIcon} className="w-[14px] h-[14px]" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
