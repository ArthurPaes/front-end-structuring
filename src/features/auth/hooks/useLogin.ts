/**
 * @file useLogin — React Query mutation wrapper for the login flow.
 *
 * PATTERN: Each API call gets its own React Query hook.
 * This separates mutation state (loading, error) from the auth store.
 */
import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api';
import { useAuthStore } from '../store';
import type { LoginRequest } from '@/api/types';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: ({ accessToken, user }) => {
      setUser(user, accessToken);
    },
    // onError is handled by the component or a global error boundary
  });
}
