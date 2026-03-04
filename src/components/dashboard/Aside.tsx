import type React from "react";
import { useEffect, useState } from "react";
import Arrow from "./../../assets/arrow_down.svg";
import Collapse from "./../../assets/Collapse.svg";
import { RecentProjectItem, type RecentProject } from "./RecentProjectItem";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { getRecentProjects } from "../../services/projects";

const MOCK_PROJECTS: RecentProject[] = [
  {
    id: "1",
    title: "카탈로그 이미지 생성",
    date: "2026-01-27 19:15:42",
    thumbnail:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    title: "SNS/마케팅 광고소재",
    date: "2026-01-27 06:05:10",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    title: "인스타그램 피드 광고 이미지 제작",
    date: "2026-01-15 09:27:40",
    thumbnail:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "4",
    title: "애견팬션 촬영 이미지",
    date: "2026-01-10 10:30:15",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "5",
    title: "크리스마스 이벤트 일러스트",
    date: "2025-12-20 16:54:33",
    thumbnail:
      "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "6",
    title: "크리스마스 제품 상세 페이지",
    date: "2025-12-05 18:42:00",
    thumbnail:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&auto=format&fit=crop&q=60",
  },
];

interface Props {
  asideOpen: boolean;
  handleAside: () => void;
}

export const Aside: React.FC<Props> = ({ asideOpen, handleAside }: Props) => {
  const [projects, setProjects] = useState<RecentProject[]>(MOCK_PROJECTS);
  const [deleteTarget, setDeleteTarget] = useState<RecentProject | null>(null);

  useEffect(() => {
    let alive = true;
    getRecentProjects()
      .then((items) => {
        if (!alive || items.length == 0) return;
        setProjects(items);
      })
      .catch(() => {
        // keep mock data
      });
    return () => {
      alive = false;
    };
  }, []);

  const handleDeleteRequest = (id: string) => {
    const target = projects.find((p) => p.id === id) ?? null;
    setDeleteTarget(target);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  return (
    <>
      {asideOpen ? (
        <div className="py-[20px] flex flex-col gap-[14px] border-r border-[#569DFF]/20 box-border bg-white opacity-95">
          <div className="flex justify-between items-center px-[20px]">
            <span className="text-[#9CA3AF] text-[11px] font-semibold">
              최근 프로젝트
            </span>
            <button
              onClick={handleAside}
              className="w-[28px] h-[28px] rounded-[6px] border border-[#569DFF]/20 bg-[#F8FAFF] flex items-center justify-center"
            >
              <img src={Collapse} />
            </button>
          </div>
          <div className="px-[12px] flex flex-col gap-[8px]">
            {projects.map((project) => (
              <RecentProjectItem
                key={project.id}
                project={project}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={handleAside}
          className="absolute left-0 top-[50%] p-[24px_7px] border border-[#62748E] border-[0.8px] border-l-0 rounded-[7px] rounded-l-none bg-[#F8FAFC] shadow-md"
        >
          <img src={Arrow} className="-rotate-90" />
        </button>
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          projectTitle={deleteTarget.title}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};
