import type React from 'react';

import { Button } from '@/commons/components/Button';
import { StarIcon } from '@/commons/components/icons/StarIcon';
import type { TemplateRes } from '@/features/template/types';

import { useTemplateCard } from '../hooks/useTemplateCard';

interface Props {
  template: TemplateRes;
}

export const Template: React.FC<Props> = ({ template }: Props) => {
  const {
    isPending,
    handleClickFavorite,
    handleClickTemplate,
    handleKeyDownTemplate,
  } = useTemplateCard({ template });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClickTemplate}
      onKeyDown={handleKeyDownTemplate}
      className="min-h-27 flex cursor-pointer flex-col justify-between gap-2 rounded-md border border-border-neutral bg-white px-4 py-3 text-left hover:bg-[#F1F5F9]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={template.imgUrl} alt={template.title} />
          <div className="text-md text-text-primary font-bold">
            {template.title}
          </div>
        </div>
        <Button
          variant="primary-plain"
          size="sm"
          disabled={isPending}
          onClick={handleClickFavorite}
        >
          <StarIcon isActive={template.isLike} />
        </Button>
      </div>
      <div className="text-sm text-text-tertiary text-left">
        {template.summary}
      </div>
    </div>
  );
};
