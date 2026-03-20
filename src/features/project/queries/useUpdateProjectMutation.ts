import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import { putProject } from '@/features/project/api';
import type { SaveProjectReq, SaveProjectRes } from '@/features/project/types';
import { projectQueryKeys } from './queryKeys';

interface UpdateProjectVariables {
  projectId: string;
  data: SaveProjectReq;
}

type UpdateProjectMutationOptions = UseMutationOptions<
  SaveProjectRes,
  Error,
  UpdateProjectVariables
>;

export const useUpdateProjectMutation = (
  options?: UpdateProjectMutationOptions,
): UseMutationResult<SaveProjectRes, Error, UpdateProjectVariables> => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: async ({ projectId, data }: UpdateProjectVariables) => {
      const res = await putProject(projectId, data);
      return res.data;
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectQueryKeys.recent(),
        }),
        queryClient.invalidateQueries({
          queryKey: projectQueryKeys.detail(variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: projectQueryKeys.history(variables.projectId),
        }),
      ]);
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
