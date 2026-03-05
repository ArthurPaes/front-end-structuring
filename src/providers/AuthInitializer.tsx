/**
 * @file AuthInitializer — calls checkAuth once on app mount.
 *
 * This component silently attempts to restore an existing session via the
 * refresh-token cookie. It has no visible output; it simply ensures the
 * auth store transitions out of `isLoading: true` before any route guard
 * makes a redirect decision.
 *
 * Flow:
 *   1. App mounts → isLoading: true
 *   2. checkAuth called → POST /auth/refresh
 *      a. Success → setUser() → isLoading: false, isAuthenticated: true
 *      b. Failure → clearAuth() → isLoading: false, isAuthenticated: false
 *   3. RequireAuth now has a definitive answer and can redirect/allow
 */
import { useEffect } from 'react';
import { useAuth } from '@/features/auth';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuth();

  useEffect(() => {
    void checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  return <>{children}</>;
}
