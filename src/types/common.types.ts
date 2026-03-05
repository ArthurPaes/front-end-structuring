/**
 * @file Global TypeScript types used across the application.
 *
 * CONVENTION: Place domain-specific types in their feature folder
 * (e.g. features/auth/types/). Only truly shared types live here.
 */

/** Standard paginated API response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

/** Standard API error shape */
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

/** Generic ID type — use branded types for stricter safety */
export type Id = string;

/** Utility: Make specific keys required */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/** Utility: Make all properties nullable */
export type Nullable<T> = { [K in keyof T]: T[K] | null };
