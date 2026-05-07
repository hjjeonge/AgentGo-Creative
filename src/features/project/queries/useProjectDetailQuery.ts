import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { getProjectDetail } from '@/features/project/api';
import type { ProjectDetailRes } from '@/features/project/types';

import { projectQueryKeys } from './queryKeys';

type ProjectDetailQueryOptions = Omit<
  UseQueryOptions<
    ProjectDetailRes,
    Error,
    ProjectDetailRes,
    ReturnType<typeof projectQueryKeys.detail>
  >,
  'queryKey' | 'queryFn'
>;

export const useProjectDetailQuery = (
  projectId: string,
  options?: ProjectDetailQueryOptions,
): UseQueryResult<ProjectDetailRes, Error> => {
  return useQuery({
    queryKey: projectQueryKeys.detail(projectId),
    queryFn: async () => {
      const res = await getProjectDetail(projectId);
      return res.data;
    },
    enabled: !!projectId,
    ...options,
  });
};
