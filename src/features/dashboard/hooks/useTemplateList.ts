import { useState } from 'react';

import { TEMPLATE_CONFIGS } from '@/features/template/constants/templateConfig';
import { useTemplatesQuery } from '@/features/template/queries';
import type { TemplateRes } from '@/features/template/types';

const fallbackTemplates: TemplateRes[] = TEMPLATE_CONFIGS.map((item) => ({
  id: item.key,
  imgUrl: item.imgSrc,
  title: item.title,
  summary: item.comment,
  isLike: item.isLike,
}));

export const useTemplateList = () => {
  const [isFavoriteOnly, setIsFavoriteOnly] = useState(false);
  const { data, isError } = useTemplatesQuery();

  const templates = data && data.length > 0 ? data : fallbackTemplates;
  const filteredTemplates = isFavoriteOnly
    ? templates.filter((template) => template.isLike)
    : templates;

  const handleChangeFavoriteOnly = (checked: boolean) => {
    setIsFavoriteOnly(checked);
  };

  return {
    filteredTemplates,
    isError,
    isFavoriteOnly,
    handleChangeFavoriteOnly,
  };
};
