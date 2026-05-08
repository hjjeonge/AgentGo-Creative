import type React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/commons/components/Button';
import { StarIcon } from '@/commons/components/icons/StarIcon';
import type { FavoriteTemplateRes } from '@/features/template/types';

interface Props {
  template: FavoriteTemplateRes;
}

export const Template: React.FC<Props> = ({ template }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/template?template=${template.id}`)}
      className="min-h-27 flex flex-col justify-between gap-2 px-4 py-3 rounded-md border border-border-neutral bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={template.imgUrl} alt={template.title} />
          <div className="text-md text-text-primary font-bold">
            {template.title}
          </div>
        </div>
        <Button variant="primary-plain">
          <StarIcon />
        </Button>
      </div>
      <div className="text-sm text-text-tertiary text-left">
        {template.summary}
      </div>
    </button>
  );
};
