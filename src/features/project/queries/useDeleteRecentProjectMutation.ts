import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import { deleteRecentProject } from '@/features/project/api';
import { projectQueryKeys } from './queryKeys';

type DeleteRecentProjectMutationOptions = UseMutationOptions<
  void,
  Error,
  string
>;

export const useDeleteRecentProjectMutation = (
  options?: DeleteRecentProjectMutationOptions,
): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: async (projectId: string) => {
      await deleteRecentProject(projectId);
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({
        queryKey: projectQueryKeys.recent(),
      });
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
