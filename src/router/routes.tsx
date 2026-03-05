/**
 * @file Route definitions as data — array of route objects, not JSX.
 *
 * ARCHITECTURE:
 *   - All page-level components are lazy-loaded via React.lazy + Suspense.
 *   - Route guards (RequireAuth, RequireRole) wrap protected routes.
 *   - Nested routes use layout components for shared chrome (sidebar, header).
 *
 * PERFORMANCE: Code splitting per route keeps the initial bundle small.
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { RequireAuth } from './guards/RequireAuth';
import { RequireRole } from './guards/RequireRole';

// ── Lazy-loaded pages ─────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// ── Layouts ───────────────────────────────────────────────
const AuthLayout = lazy(() => import('@/components/AuthLayout/AuthLayout'));
const DashboardLayout = lazy(() => import('@/components/DashboardLayout/DashboardLayout'));

// ── Suspense wrapper ──────────────────────────────────────
function Suspended({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen" role="status">
          <span className="sr-only">Loading…</span>
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

// ── Route config ──────────────────────────────────────────
export const routes: RouteObject[] = [
  // ── Root redirect ── / → /dashboard (RequireAuth handles → /login if not authed)
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },

  // ── Public (auth) routes ──────────────────────────────
  {
    element: (
      <Suspended>
        <AuthLayout />
      </Suspended>
    ),
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <Suspended>
            <LoginPage />
          </Suspended>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <Suspended>
            <RegisterPage />
          </Suspended>
        ),
      },
    ],
  },

  // ── Protected (dashboard) routes ──────────────────────
  {
    element: (
      <RequireAuth>
        <Suspended>
          <DashboardLayout />
        </Suspended>
      </RequireAuth>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: (
          <Suspended>
            <DashboardPage />
          </Suspended>
        ),
      },
      {
        path: ROUTES.DASHBOARD_SETTINGS,
        element: (
          <RequireRole roles={['admin', 'editor']}>
            <Suspended>
              <SettingsPage />
            </Suspended>
          </RequireRole>
        ),
      },
    ],
  },

  // ── Catch-all 404 ─────────────────────────────────────
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Suspended>
        <NotFoundPage />
      </Suspended>
    ),
  },
];
