/**
 * @file useAuth — primary auth hook consumed by components.
 *
 * PATTERN: Custom hook extraction — all auth logic is encapsulated here.
 * Components get a clean API: `const { user, login, logout } = useAuth();`
 *
 * SOLID: Single Responsibility — this hook orchestrates auth flow.
 * Interface Segregation — callers only see what they need.
 */
import { useCallback } from 'react';
import { useAuthStore } from '../store';
import { loginApi, logoutApi, fetchCurrentUser, refreshTokenApi } from '../api';
import { setAccessToken } from '@/api';
import type { LoginRequest } from '@/api/types';
import { logger } from '@/lib';
import type { UserRole } from '@/api/types';
import { ROLE_PERMISSIONS, type Permission } from '../types';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, clearAuth, setLoading } = useAuthStore();

  /** Login with email + password */
  const login = useCallback(
    async (credentials: LoginRequest) => {
      const { accessToken, user: loggedInUser } = await loginApi(credentials);
      setUser(loggedInUser, accessToken);
      logger.info('User logged in', { userId: loggedInUser.id }, 'auth');
    },
    [setUser],
  );

  /** Logout and revoke refresh token */
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Best-effort — clear local state even if backend call fails
      logger.warn('Logout API call failed — clearing local auth state', undefined, 'auth');
    }
    clearAuth();
  }, [clearAuth]);

  /** Check for existing session on app startup */
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { accessToken } = await refreshTokenApi();
      console.log('accessToken: ', accessToken);
      setAccessToken(accessToken);
      const currentUser = await fetchCurrentUser();
      setUser(currentUser, accessToken);
    } catch {
      clearAuth();
    }
  }, [setUser, clearAuth, setLoading]);

  /** Check if user has a specific role */
  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return user?.role === role;
    },
    [user],
  );

  /** Check if user has a specific permission */
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
    },
    [user],
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    hasRole,
    hasPermission,
  } as const;
}
