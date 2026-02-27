import type React from "react";
import DotsIcon from "../../assets/dots.svg";
import { FileIcon } from "./DAMFileIcons";
import { type DAMFile } from "./DAMData";

interface Props {
  files: DAMFile[];
  onContextMenu: (e: React.MouseEvent, fileId: string) => void;
  onDotsClick: (e: React.MouseEvent, fileId: string) => void;
}

export const DAMGridView: React.FC<Props> = ({ files, onContextMenu, onDotsClick }) => (
  <div className="grid grid-cols-5 gap-[20px] p-[20px]">
    {files.map((file) => (
      <div
        key={file.id}
        onContextMenu={(e) => onContextMenu(e, file.id)}
        className="group relative bg-white border border-[#E2E8F0] rounded-[10px] overflow-hidden cursor-pointer hover:shadow-md"
      >
        {/* 3-dot 메뉴 */}
        <button
          onClick={(e) => onDotsClick(e, file.id)}
          className="absolute top-[8px] right-[8px] z-[10] opacity-0 group-hover:opacity-100 w-[24px] h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#F1F5F9]"
        >
          <img src={DotsIcon} className="w-[14px] h-[14px]" />
        </button>

        {/* 썸네일 */}
        <div className="h-[160px] flex items-center justify-center bg-[#F8FAFC]">
          {file.thumbnail ? (
            <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
          ) : (
            <FileIcon type={file.type} size={56} />
          )}
        </div>

        {/* 파일명 */}
        <div className="px-[10px] py-[8px]">
          <p className="text-[12px] text-[#0F172B] font-medium truncate">{file.name}</p>
        </div>
      </div>
    ))}
  </div>
);
