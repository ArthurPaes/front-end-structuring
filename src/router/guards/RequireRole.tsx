/**
 * @file RequireRole — route guard for role-based access control (RBAC).
 *
 * USAGE (in route config):
 *   element: <RequireRole roles={['admin', 'editor']}><AdminPage /></RequireRole>
 *
 * SOLID: Open/Closed — add new roles without modifying this component.
 */
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { ROUTES } from '@/constants';
import type { UserRole } from '@/api/types';

interface RequireRoleProps {
  /** Allowed roles — user must have at least one */
  roles: UserRole[];
  children: React.ReactNode;
  /** Where to redirect if role check fails (default: dashboard) */
  fallback?: string;
}

export function RequireRole({ roles, children, fallback = ROUTES.DASHBOARD }: RequireRoleProps) {
  const user = useAuthStore((s) => s.user);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
