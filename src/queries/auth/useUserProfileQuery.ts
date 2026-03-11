import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { getUserProfile } from '../../services/auth/api';
import type { UserProfileRes } from '../../services/auth/type';
import { authQueryKeys } from './queryKeys';

type UserProfileQueryOptions = Omit<
  UseQueryOptions<
    UserProfileRes,
    Error,
    UserProfileRes,
    ReturnType<typeof authQueryKeys.userProfile>
  >,
  'queryKey' | 'queryFn'
>;

export const useUserProfileQuery = (
  options?: UserProfileQueryOptions,
): UseQueryResult<UserProfileRes, Error> => {
  return useQuery({
    queryKey: authQueryKeys.userProfile(),
    queryFn: async () => {
      const res = await getUserProfile();
      return res.data;
    },
    ...options,
  });
};
