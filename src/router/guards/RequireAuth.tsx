/**
 * @file RequireAuth — route guard that redirects unauthenticated users.
 *
 * PATTERN: Wrapper component for route-level auth protection.
 * Used in route config, not manually in every page component.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { ROUTES } from '@/constants';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const location = useLocation();

  // While the session check is in-flight, show a centred spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" role="status">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <span className="sr-only">Checking session…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
