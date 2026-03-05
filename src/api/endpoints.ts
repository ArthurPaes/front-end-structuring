/**
 * @file API endpoint URL constants.
 *
 * WHY: Centralised URLs prevent typos and make refactoring painless.
 * If the backend changes `/users` to `/v2/users`, update once here.
 */

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  USERS: {
    BASE: '/users',
    DETAIL: (id: string) => `/users/${id}`,
  },

  // Add more endpoint groups as your API grows:
  // POSTS: { ... },
  // COMMENTS: { ... },
} as const;
