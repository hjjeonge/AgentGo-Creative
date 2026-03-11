import type React from 'react';
import { useEffect, useState } from 'react';
import Arrow from './../../assets/arrow_down.svg';
import Collapse from './../../assets/Collapse.svg';
import { RecentProjectItem } from './RecentProjectItem';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useDeleteRecentProjectMutation } from '../../queries/project/useDeleteRecentProjectMutation';
import { useRecentProjectsQuery } from '../../queries/project/useRecentProjectsQuery';
import { useNavigate } from 'react-router-dom';
import type { RecentProjectItem as RecentProject } from '../../services/project/type';

const MOCK_PROJECTS: RecentProject[] = [
  {
    id: '1',
    title: '카탈로그 이미지 생성',
    updated_at: '2026-01-27 19:15:42',
    thumbnail_url:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    title: 'SNS/마케팅 광고소재',
    updated_at: '2026-01-27 06:05:10',
    thumbnail_url:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    title: '인스타그램 피드 광고 이미지 제작',
    updated_at: '2026-01-15 09:27:40',
    thumbnail_url:
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=200&auto=format&fit=crop&q=60',
  },
  {
    id: '4',
    title: '애견팬션 촬영 이미지',
    updated_at: '2026-01-10 10:30:15',
    thumbnail_url:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60',
  },
  {
    id: '5',
    title: '크리스마스 이벤트 일러스트',
    updated_at: '2025-12-20 16:54:33',
    thumbnail_url:
      'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=200&auto=format&fit=crop&q=60',
  },
  {
    id: '6',
    title: '크리스마스 제품 상세 페이지',
    updated_at: '2025-12-05 18:42:00',
    thumbnail_url:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&auto=format&fit=crop&q=60',
  },
];

interface Props {
  asideOpen: boolean;
  handleAside: () => void;
}

export const Aside: React.FC<Props> = ({ asideOpen, handleAside }: Props) => {
  const { data, isError } = useRecentProjectsQuery();
  const { mutateAsync } = useDeleteRecentProjectMutation();
  const [projects, setProjects] = useState<RecentProject[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<RecentProject | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      console.log('최근 프로젝트 목록 조회에 실패했습니다.');
      setProjects(MOCK_PROJECTS); // todo mockdata 삽입 부분 제거해야 함
      return;
    }

    if (!data) return;
    if (!data.length) {
      setProjects(MOCK_PROJECTS); // todo mockdata 삽입 부분 제거해야 함
      return;
    }

    setProjects(data);
  }, [isError, data]);

  const handleDeleteRequest = (id: string) => {
    const target = projects.find((p) => p.id === id) ?? null;
    setDeleteTarget(target);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    await mutateAsync(deleteTarget.id);
  };

  const onClickRecentProjectItem = (projectId: string) => {
    navigate(`/editor/${projectId}`);
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
                onClick={() => onClickRecentProjectItem(project.id)}
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
