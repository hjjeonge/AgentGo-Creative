import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import { postLogout } from '../../services/auth/api';

type LogoutMutationOptions = UseMutationOptions<void, Error, void>;

export const useLogoutMutation = (
  options?: LogoutMutationOptions,
): UseMutationResult<void, Error, void> => {
  return useMutation({
    mutationFn: async () => {
      await postLogout();
    },
    ...options,
  });
};
