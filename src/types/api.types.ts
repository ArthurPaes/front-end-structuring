/**
 * @file API-layer-specific types (request/response generics).
 */

/** Wrap any successful API call */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

/** Standard mutation result */
export interface MutationResult {
  success: boolean;
  message: string;
}

/** Axios interceptor config extras */
export interface RequestConfig {
  /** Skip the auth header injection for public endpoints */
  skipAuth?: boolean;
  /** Custom retry count */
  retries?: number;
}
