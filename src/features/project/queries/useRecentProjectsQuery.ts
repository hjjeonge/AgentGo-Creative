import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { getRecentProjects } from '@/features/project/api';
import type { RecentProjectItem } from '@/features/project/types';
import { projectQueryKeys } from './queryKeys';

type RecentProjectsQueryOptions = Omit<
  UseQueryOptions<
    RecentProjectItem[],
    Error,
    RecentProjectItem[],
    ReturnType<typeof projectQueryKeys.recent>
  >,
  'queryKey' | 'queryFn'
>;

export const useRecentProjectsQuery = (
  options?: RecentProjectsQueryOptions,
): UseQueryResult<RecentProjectItem[], Error> => {
  return useQuery({
    queryKey: projectQueryKeys.recent(),
    queryFn: async () => {
      const res = await getRecentProjects();
      return res.data;
    },
    ...options,
  });
};
