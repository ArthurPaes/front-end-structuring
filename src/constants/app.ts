/**
 * @file Application-wide constants. No magic strings in components!
 *
 * SOLID: Single Responsibility — constants are defined once, referenced everywhere.
 */

/** Maximum file upload size in bytes (10 MB) */
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/** Debounce timing (ms) */
export const DEBOUNCE_MS = 300;

/** Toast auto-dismiss (ms) */
export const TOAST_DURATION_MS = 5_000;

/** Local Storage keys */
export const STORAGE_KEYS = {
  THEME: 'app:theme',
  LOCALE: 'app:locale',
  SIDEBAR_COLLAPSED: 'app:sidebar-collapsed',
} as const;
