import type React from "react";
import { useNavigate } from "react-router-dom";
import RemoveIcon from "../../assets/remove.svg";

export interface RecentProject {
  id: string;
  title: string;
  date: string;
  thumbnail?: string | null;
}

interface Props {
  project: RecentProject;
  onDelete: (id: string) => void;
}

export const RecentProjectItem: React.FC<Props> = ({ project, onDelete }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className="group overflow-hidden rounded-[10px] flex items-center justify-center p-[1px] bg-[linear-gradient(135deg,rgba(86,157,255,0.3)_0%,rgba(0,85,233,0.2)_50%,rgba(106,20,217,0.25)_100%)] box-border cursor-pointer"
      onClick={() => navigate("/editor")}
    >
      <div className="relative bg-[#F8FAFF] p-[12px] flex items-center gap-[12px] w-full rounded-[9px]">
        {project.thumbnail ? (
          <img
            className="w-[58px] h-[58px] rounded-[8px] object-cover shrink-0"
            src={project.thumbnail}
            alt={project.title}
          />
        ) : (
          <div className="w-[58px] h-[58px] rounded-[8px] bg-[#E2E8F0] flex items-center justify-center text-[10px] text-[#64748B]">
            No Image
          </div>
        )}
        <div className="flex-1 flex flex-col gap-[4px] overflow-hidden">
          <span className="text-[#1E1E1E] text-[14px] leading-[19.88px] truncate">
            {project.title}
          </span>
          <span className="text-[#90A1B9] text-[12px] leading-[18px]">
            {project.date}
          </span>
        </div>
        {/* 마우스 오버 시 삭제 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="absolute right-[8px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-[24px] h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#FEE2E2]"
        >
          <img src={RemoveIcon} className="w-[14px] h-[14px]" />
        </button>
      </div>
    </div>
  );
};