/**
 * @file useRegister — React Query mutation wrapper for the register flow.
 */
import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api';
import { useAuthStore } from '../store';
import type { RegisterRequest } from '@/api/types';

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: RegisterRequest) => registerApi(payload),
    onSuccess: ({ accessToken, user }) => {
      setUser(user, accessToken);
    },
  });
}
