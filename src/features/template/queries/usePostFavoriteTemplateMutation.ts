import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import { postFavoriteTemplate } from '@/features/template/api';

import { templateQueryKeys } from './queryKeys';

type PostFavoriteTemplateMutationOptions = UseMutationOptions<
  unknown,
  Error,
  string
>;

export const usePostFavoriteTemplateMutation = (
  options?: PostFavoriteTemplateMutationOptions,
): UseMutationResult<unknown, Error, string> => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: async (templateId: string) => {
      const res = await postFavoriteTemplate(templateId);
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
