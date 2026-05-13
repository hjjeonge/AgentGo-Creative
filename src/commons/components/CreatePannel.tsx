import type React from 'react';
import { useNavigate } from 'react-router-dom';

import ai from '@/assets/ai.svg';
import { Button } from '@/commons/components/Button';
import { TEMPLATE_CONFIGS } from '@/features/template/constants/templateConfig';
import { useTemplatesQuery } from '@/features/template/queries';
import type { TemplateRes } from '@/features/template/types';

const fallbackFavoriteTemplates: TemplateRes[] = TEMPLATE_CONFIGS.map(
  (item) => ({
    id: item.key,
    imgUrl: item.imgSrc,
    title: item.title,
    summary: item.comment,
    isLike: item.isLike,
  }),
).filter((template) => template.isLike);

type CreatePannelProps = {
  onNavigate?: () => void;
};

export const CreatePannel: React.FC<CreatePannelProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { data } = useTemplatesQuery();

  const templateList =
    data && data.length > 0 ? data : fallbackFavoriteTemplates;
  const favoriteTemplateList = templateList
    .filter((template) => template.isLike)
    .slice(0, 10);

  const handleClickEditor = () => {
    onNavigate?.();
    navigate('/editor/new');
  };

  const handleClickTemplate = (templateId: string) => {
    onNavigate?.();
    navigate(`/template?template=${templateId}`);
  };

  return (
    <div className="relative">
      <div className="absolute left-[-9px] top-7">
        <div className="absolute border-y-[9px] border-y-transparent border-r-[10px] border-r-border-neutral" />
        <div className="absolute left-[1px] top-0 border-y-[9px] border-y-transparent border-r-[10px] border-r-[#F1F5F9]" />
      </div>
      <div className="flex w-[296px] flex-col gap-3 rounded-xs border border-border-neutral bg-[#F1F5F9] px-6 py-5">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold text-text-primary">
            새로운 이미지 생성
          </span>
          <Button
            onClick={handleClickEditor}
            startDecorator={<img src={ai} className="h-5.5 w-5.5" />}
            className="w-full!"
          >
            이미지 생성
          </Button>
        </div>
        <div className="h-[1px] w-[248px] bg-[#D9D9D9]" />
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold text-text-primary">
            즐겨찾는 템플릿
          </span>
          <div className="grid grid-cols-2 gap-2">
            {favoriteTemplateList.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleClickTemplate(template.id)}
                className="flex flex-col items-center gap-2 rounded-xs py-2 text-sm text-text-primary hover:bg-[#E2E8F0]"
              >
                <img src={template.imgUrl} alt={template.title} />
                <span>{template.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
