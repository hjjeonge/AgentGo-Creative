import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import { postLogout } from '@/features/auth/api';
import { getRefreshToken } from '@/commons/utils/tokenManager';

type LogoutMutationOptions = UseMutationOptions<void, Error, void>;

export const useLogoutMutation = (
  options?: LogoutMutationOptions,
): UseMutationResult<void, Error, void> => {
  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return;

      await postLogout({ refresh_token: refreshToken });
    },
    ...options,
  });
};
