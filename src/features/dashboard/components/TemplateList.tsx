import type React from 'react';

import { CustomSwitch } from '@/commons/components/CustomSwitch';

import { Template } from './Template';
import { useTemplateList } from '../hooks/useTemplateList';

export const TemplateList: React.FC = () => {
  const { filteredTemplates, isFavoriteOnly, handleChangeFavoriteOnly } =
    useTemplateList();

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-5 font-bold text-text-primary">템플릿</span>
        <div className="flex items-center gap-1">
          <CustomSwitch
            checked={isFavoriteOnly}
            onCheckedChange={handleChangeFavoriteOnly}
          />
          <span className="text-sm text-text-secondary">즐겨찾기만 보기</span>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto pr-2">
        <div className="grid grid-cols-3 gap-2">
          {filteredTemplates.map((el) => (
            <Template key={el.id} template={el} />
          ))}
        </div>
      </div>
    </div>
  );
};
