/**
 * @file Axios instance with auth header injection and 401 refresh-token interceptor.
 *
 * ARCHITECTURE:
 *   - Dependency Inversion: feature code never calls axios directly.
 *   - All requests flow through this client, ensuring consistent
 *     auth headers, error handling, and logging.
 *
 * TOKEN STRATEGY DECISION:
 *   This template stores tokens in memory (via Zustand) for XSS protection.
 *   - Access token  → in-memory (Zustand store)
 *   - Refresh token → httpOnly cookie (set by backend, never JS-accessible)
 *
 *   TRADEOFF:
 *   | Strategy          | XSS safe | Persists refresh | Complexity |
 *   |-------------------|----------|------------------|------------|
 *   | httpOnly cookie   | ✅       | ✅               | Backend    |
 *   | Memory + cookie   | ✅       | ✅               | Medium     |  ← chosen
 *   | localStorage      | ❌       | ✅               | Low        |
 *
 *   If your backend cannot set httpOnly cookies, fall back to localStorage
 *   and accept the XSS risk (mitigate with CSP headers).
 */

import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/config';
import { logger } from '@/lib/logger';
import { captureException } from '@/lib/errorMonitoring';

// ── Create instance ───────────────────────────────────────
export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send httpOnly refresh cookie automatically
});

// ── Token management (in-memory) ──────────────────────────
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// ── Request interceptor: inject auth header ───────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Allow skipping auth for public endpoints
    // Usage: apiClient.get('/public', { headers: { 'X-Skip-Auth': 'true' } })
    const skipAuth = config.headers?.['X-Skip-Auth'];
    if (skipAuth) {
      delete config.headers['X-Skip-Auth'];
      return config;
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ── Response interceptor: handle 401 refresh flow ─────────
//
// PROBLEM THIS SOLVES:
//   Access tokens are short-lived (e.g. 15 minutes). When one expires mid-session,
//   the next API call returns 401. Without this interceptor, the user would get
//   a error or be kicked to /login. With it, the renewal happens invisibly.
//
// MODULE-LEVEL STATE (lives for the entire page session):

// Flag: is a refresh call already in-flight?
// Prevents firing multiple simultaneous refresh requests if several API calls
// all get 401s at the same moment (e.g. dashboard loads 3 queries at once).
let isRefreshing = false;

// Queue of requests that arrived while a refresh was already in-flight.
// Each entry holds the resolve/reject of a Promise wrapping that request.
// Once the refresh completes, every queued request is replayed or rejected.
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

// Drains the queue after a refresh attempt.
// If refresh succeeded: resolves every queued promise with the new token
//   → each queued request retries with the updated Authorization header.
// If refresh failed: rejects every queued promise with the error
//   → each queued request surfaces the error to its caller (component/hook).
function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = []; // clear so the next cycle starts fresh
}

apiClient.interceptors.response.use(
  // SUCCESS path — 2xx responses pass straight through, nothing to do.
  (response: AxiosResponse) => response,

  // ERROR path — runs for any non-2xx response.
  async (error: AxiosError) => {
    // Grab the original request config so we can replay it later.
    // We augment it with `_retry` — a custom flag we add ourselves.
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // GATE 1: Only handle 401s. Any other error (400, 403, 500, network) gets
    // rejected immediately and bubbles up to React Query / the component.
    // GATE 2: _retry prevents an infinite loop. If we already retried this
    // exact request once and it's still 401, give up — the token refresh
    // itself probably failed or the user genuinely lacks permission.
    if (error.response?.status !== 401 || originalRequest._retry) {
      throw error;
    }

    if (isRefreshing) {
      // A refresh is already in-flight (triggered by a different concurrent request).
      // Instead of firing ANOTHER refresh, park this request in the queue.
      // It returns a Promise that stays pending until processQueue() is called.
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject }); // park it
      }).then((token) => {
        // processQueue resolved us with the new token — update header and replay.
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    // FIRST 401 — we own the refresh.
    originalRequest._retry = true;  // mark so a second 401 on replay doesn't recurse
    isRefreshing = true;             // signal to concurrent requests: queue up, don't race

    try {
      // Use bare axios (NOT apiClient) to call the refresh endpoint.
      // If we used apiClient, this request would also pass through THIS
      // interceptor. A 401 on the refresh would trigger another refresh → infinite loop.
      // withCredentials: true tells the browser to include the httpOnly refresh
      // token cookie. The browser attaches it automatically — JS never reads it.
      const { data } = await axios.post<{ accessToken: string }>(
        `${env.API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      // Refresh succeeded — store the new access token in memory.
      setAccessToken(data.accessToken);

      // Unblock every request that was queued while we were refreshing.
      // They each get the new token and replay themselves.
      processQueue(null, data.accessToken);

      // Replay the original request that triggered the whole flow.
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest); // returns the response to the original caller
    } catch (refreshError) {
      // Refresh failed (the refresh token itself is expired or invalid).
      // Reject every queued request — they will all error out.
      processQueue(refreshError, null);

      // Wipe the in-memory token — it's useless now.
      setAccessToken(null);

      // The component/hook that made the original request will receive this rejection.
      // If it's wrapped in RequireAuth or a top-level error handler, it should
      // redirect to /login. (clearAuth + navigate happens in useAuth.logout or
      // a higher-level handler — not here, to keep this file framework-agnostic.)
      logger.warn('Token refresh failed — logging out', undefined, 'api');

      throw refreshError;
    } finally {
      // Always reset the flag — whether refresh succeeded or failed.
      // Without this, isRefreshing would stay true and every future 401
      // would get queued forever instead of triggering a new refresh.
      isRefreshing = false;
    }
  },
);

// ── Global error logging ──────────────────────────────────
apiClient.interceptors.response.use(undefined, (error: AxiosError) => {
  if (error.response?.status && error.response.status >= 500) {
    captureException(error, {
      tags: { layer: 'api' },
      extra: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
      },
    });
  }
  return Promise.reject(error);
});
