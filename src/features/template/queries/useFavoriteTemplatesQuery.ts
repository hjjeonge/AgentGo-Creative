import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { getFavoriteTemplates } from '@/features/template/api';
import type { FavoriteTemplateRes } from '@/features/template/types';
import { templateQueryKeys } from './queryKeys';

type FavoriteTemplatesQueryOptions = Omit<
  UseQueryOptions<
    FavoriteTemplateRes[],
    Error,
    FavoriteTemplateRes[],
    ReturnType<typeof templateQueryKeys.favorite>
  >,
  'queryKey' | 'queryFn'
>;

export const useFavoriteTemplatesQuery = (
  options?: FavoriteTemplatesQueryOptions,
): UseQueryResult<FavoriteTemplateRes[], Error> => {
  return useQuery({
    queryKey: templateQueryKeys.favorite(),
    queryFn: async () => {
      const res = await getFavoriteTemplates();
      return res.data;
    },
    ...options,
  });
};
