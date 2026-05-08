import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { getTemplates } from '@/features/template/api';
import type { TemplateRes } from '@/features/template/types';

import { templateQueryKeys } from './queryKeys';

type TemplatesQueryOptions = Omit<
  UseQueryOptions<
    TemplateRes[],
    Error,
    TemplateRes[],
    ReturnType<typeof templateQueryKeys.list>
  >,
  'queryKey' | 'queryFn'
>;

export const useTemplatesQuery = (
  options?: TemplatesQueryOptions,
): UseQueryResult<TemplateRes[], Error> => {
  return useQuery({
    queryKey: templateQueryKeys.list(),
    queryFn: async () => {
      const res = await getTemplates();
      return res.data;
    },
    ...options,
  });
};
