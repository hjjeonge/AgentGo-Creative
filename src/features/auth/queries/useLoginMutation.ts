import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import { postLogin } from '@/features/auth/api';
import type { LoginReq, LoginRes } from '@/features/auth/types';

type LoginMutationOptions = UseMutationOptions<LoginRes, Error, LoginReq>;

export const useLoginMutation = (
  options?: LoginMutationOptions,
): UseMutationResult<LoginRes, Error, LoginReq> => {
  return useMutation({
    mutationFn: async (payload: LoginReq) => {
      const res = await postLogin(payload);
      return res.data;
    },
    ...options,
  });
};
