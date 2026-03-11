import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { getFavoriteTemplates } from '../../services/template/api';
import type { FavoriteTemplateRes } from '../../services/template/type';
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
