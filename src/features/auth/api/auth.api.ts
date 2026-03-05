/**
 * @file Auth API functions — no raw axios calls elsewhere.
 *
 * SOLID: Dependency Inversion — hooks receive these functions,
 * making them testable with mocked API functions.
 */
import { apiClient, ENDPOINTS } from '@/api';
import type { LoginRequest, LoginResponse, AuthUser } from '@/api/types';

/** POST /auth/login */
export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
  return data;
}

/** POST /auth/register */
export async function registerApi(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH.REGISTER, payload);
  return data;
}

/** GET /auth/me — fetch currently authenticated user */
export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>(ENDPOINTS.AUTH.ME);
  return data;
}

/** POST /auth/logout — revoke refresh token on backend */
export async function logoutApi(): Promise<void> {
  await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
}

/** POST /auth/refresh — obtain new access token (cookie-based) */
export async function refreshTokenApi(): Promise<{ accessToken: string }> {
  const { data } = await apiClient.post<{ accessToken: string }>(ENDPOINTS.AUTH.REFRESH);
  return data;
}
