import type React from 'react';
import { useEffect } from 'react';

import { CustomSwitch } from '@/commons/components/CustomSwitch';
import { TEMPLATE_CONFIGS } from '@/features/template/constants/templateConfig';
import { useFavoriteTemplatesQuery } from '@/features/template/queries';
import type { FavoriteTemplateRes } from '@/features/template/types';

import { Template } from './Template';

export const TemplateList: React.FC = () => {
  const { data, isError } = useFavoriteTemplatesQuery();

  // todo 즐겨찾는 템플릿 목록 조회 res 있다면 해당 코드 제거
  const fallbackTemplates: FavoriteTemplateRes[] = TEMPLATE_CONFIGS.map(
    (item) => ({
      id: item.key,
      imgUrl: item.imgSrc,
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-5 font-bold text-text-primary">템플릿</span>
        <div className="flex items-center gap-1">
          <CustomSwitch />
          <span className="text-sm text-text-secondary">즐겨찾기만 보기</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {templates.map((el) => (
          <Template key={el.id} template={el} />
        ))}
      </div>
    </div>
  );
};
