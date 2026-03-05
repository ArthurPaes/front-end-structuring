/**
 * @file MSW request handlers — define mock API responses here.
 *
 * TESTING: MSW intercepts actual network requests at the service worker level.
 * This gives realistic integration tests without a running backend.
 *
 * @see https://mswjs.io/docs/
 */
import { http, HttpResponse } from 'msw';
import { env } from '@/config';

const BASE = env.API_BASE_URL;

export const handlers = [
  // ── Auth ────────────────────────────────────────────────
  // Refresh token — returns 401 so checkAuth() resolves to "not logged in"
  // on fresh page loads (no existing session in this mock environment).
  http.post(`${BASE}/auth/refresh`, async () => {
    return new HttpResponse(null, { status: 401 });
  }),

  http.post(`${BASE}/auth/login`, async () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
      },
    });
  }),

  http.get(`${BASE}/auth/me`, async () => {
    return HttpResponse.json({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
    });
  }),

  http.post(`${BASE}/auth/register`, async () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      user: {
        id: '2',
        email: 'newuser@example.com',
        name: 'New User',
        role: 'viewer',
      },
    });
  }),

  http.post(`${BASE}/auth/logout`, async () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // ── Users ───────────────────────────────────────────────
  http.get(`${BASE}/users`, async () => {
    return HttpResponse.json({
      data: [
        { id: '1', name: 'Alice', email: 'alice@example.com' },
        { id: '2', name: 'Bob', email: 'bob@example.com' },
      ],
      meta: { page: 1, perPage: 20, total: 2, totalPages: 1 },
    });
  }),
];
