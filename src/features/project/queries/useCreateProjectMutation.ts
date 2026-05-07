import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import { postNewProject } from '@/features/project/api';
import type { CreateProjectRes } from '@/features/project/types';

type CreateProjectMutationOptions = UseMutationOptions<
  CreateProjectRes,
  Error,
  void
>;

export const useCreateProjectMutation = (
  options?: CreateProjectMutationOptions,
): UseMutationResult<CreateProjectRes, Error, void> => {
  return useMutation({
    ...options,
    mutationFn: async () => {
      const res = await postNewProject();
      return res.data;
    },
  });
};
