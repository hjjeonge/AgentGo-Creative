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
      return;
    }

    if (!data || !data.length) return;

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
