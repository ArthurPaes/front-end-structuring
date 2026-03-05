/**
 * @file API response type contracts — mirror your backend DTOs here.
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
