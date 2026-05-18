import type React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useDeleteFavoriteTemplateMutation,
  usePostFavoriteTemplateMutation,
} from '@/features/template/queries';
import type { TemplateRes } from '@/features/template/types';

interface UseTemplateCardParams {
  template: TemplateRes;
}

export const useTemplateCard = ({ template }: UseTemplateCardParams) => {
  const navigate = useNavigate();
  const {
    mutateAsync: postFavoriteTemplateMutateAsync,
    isPending: isPostPending,
  } = usePostFavoriteTemplateMutation();
  const {
    mutateAsync: deleteFavoriteTemplateMutateAsync,
    isPending: isDeletePending,
  } = useDeleteFavoriteTemplateMutation();
  const isPending = isPostPending || isDeletePending;

  const handleClickTemplate = () => {
    navigate(`/template?template=${template.id}`);
  };

  const handleKeyDownTemplate = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    handleClickTemplate();
  };

  const handleClickFavorite = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (isPending) return;

    if (template.isLike) {
      await deleteFavoriteTemplateMutateAsync(template.id);
      return;
    }

    await postFavoriteTemplateMutateAsync(template.id);
  };

  return {
    isPending,
    handleClickFavorite,
    handleClickTemplate,
    handleKeyDownTemplate,
  };
};
