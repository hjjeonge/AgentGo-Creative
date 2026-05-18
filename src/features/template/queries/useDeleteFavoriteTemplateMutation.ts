import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import { deleteFavoriteTemplate } from '@/features/template/api';

import { templateQueryKeys } from './queryKeys';

type DeleteFavoriteTemplateMutationOptions = UseMutationOptions<
  unknown,
  Error,
  string
>;

export const useDeleteFavoriteTemplateMutation = (
  options?: DeleteFavoriteTemplateMutationOptions,
): UseMutationResult<unknown, Error, string> => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: async (templateId: string) => {
      const res = await deleteFavoriteTemplate(templateId);
      return res.data;
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({
        queryKey: templateQueryKeys.list(),
      });
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
