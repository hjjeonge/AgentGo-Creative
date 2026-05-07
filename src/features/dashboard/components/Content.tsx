import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserProfileQuery } from '@/features/auth/queries/useUserProfileQuery';
import { useCreateProjectMutation } from '@/features/project/queries';
import {
  DEFAULT_TEMPLATE_KEY,
  TEMPLATE_CONFIGS,
} from '@/features/template/constants/templateConfig';
import { useFavoriteTemplatesQuery } from '@/features/template/queries';
import type { FavoriteTemplateRes } from '@/features/template/types';

import { Template } from './Template';

import type React from 'react';

export const Content: React.FC = () => {
  const navigate = useNavigate();
  const { data: userProfile } = useUserProfileQuery();
  const { data, isError } = useFavoriteTemplatesQuery();
  const { mutateAsync: createProject, isPending: isCreatingProject } =
    useCreateProjectMutation();

  // todo 즐겨찾는 템플릿 목록 조회 res 있다면 해당 코드 제거
  const fallbackTemplates: FavoriteTemplateRes[] = TEMPLATE_CONFIGS.map(
    (item) => ({
      id: item.key,
      imgUrl: item.icon,
      title: item.title,
      summary: item.comment,
    }),
  );

  const templates = data && data.length > 0 ? data : fallbackTemplates;

  useEffect(() => {
    if (isError) {
      console.log('즐겨찾는 템플릿 조회에 실패했습니다.');
    }
  }, [isError]);

  const onClickCreateNewProject = async () => {
    const res = await createProject();
    const id = res.projectId;
    navigate(`/editor/${id}`);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-[40px]">
      <div className="flex flex-col gap-[24px] items-center justify-center">
        <div className="flex flex-col gap-[14px] items-center justify-center">
          <span className="text-[#0F172B] text-[64px] font-medium leading-[85.12px]">
            <span className="text-[#155DFC] font-bold">
              {userProfile?.name ?? '클로잇'}
            </span>
            님 안녕하세요
          </span>
          <span className="text-[#0F172B] text-[36px] font-bold leading-[47.88px]">
            무엇을 도와드릴까요?
          </span>
        </div>
        <button
          onClick={onClickCreateNewProject}
          disabled={isCreatingProject}
          className="bg-[linear-gradient(135deg,#0055E9_0%,#6A14D9_100%)] p-[14px_24px] rounded-[8px] flex items-center gap-[4px] text-[#F8FAFC] text-[17px] font-bold leading-[29.88px] w-fit"
        >
          <span>+</span>
          <span>Create Now</span>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-[24px]">
        {templates.map((el) => (
          <Template key={el.id} template={el} />
        ))}
        <div className="flex items-center justify-center w-[168px] h-[190px]">
          <button
            onClick={() =>
              navigate(`/template?template=${DEFAULT_TEMPLATE_KEY}`)
            }
            className="flex items-center justify-center w-[80px] h-[80px] bg-[#155DFC] rounded-full text-white text-[32px]"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
