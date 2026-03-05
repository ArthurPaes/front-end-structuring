/**
 * @file Route path constants — single source of truth for all route paths.
 * Never hardcode "/dashboard" in components; import ROUTES.DASHBOARD instead.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  DASHBOARD: '/dashboard',
  DASHBOARD_OVERVIEW: '/dashboard/overview',
  DASHBOARD_SETTINGS: '/dashboard/settings',

  PROFILE: '/profile',
  NOT_FOUND: '*',
} as const;
