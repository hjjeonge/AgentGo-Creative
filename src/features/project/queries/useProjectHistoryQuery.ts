import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { getProjectHistory } from '@/features/project/api';
import type { HistoryItemRes } from '@/features/project/types';
import { projectQueryKeys } from './queryKeys';

type ProjectHistoryQueryOptions = Omit<
  UseQueryOptions<
    HistoryItemRes[],
    Error,
    HistoryItemRes[],
    ReturnType<typeof projectQueryKeys.history>
  >,
  'queryKey' | 'queryFn'
>;

export const useProjectHistoryQuery = (
  projectId: string,
  options?: ProjectHistoryQueryOptions,
): UseQueryResult<HistoryItemRes[], Error> => {
  return useQuery({
    queryKey: projectQueryKeys.history(projectId),
    queryFn: async () => {
      const res = await getProjectHistory(projectId);
      return res.data;
    },
    enabled: !!projectId,
    ...options,
  });
};
