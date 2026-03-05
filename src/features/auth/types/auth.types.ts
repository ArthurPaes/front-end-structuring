/**
 * @file Auth types — feature-owned type definitions.
 *
 * ARCHITECTURE (Feature-Sliced Design): Each feature owns its own types.
 * Shared types go in src/types/. Feature types stay here.
 */
import type { UserRole } from '@/api/types';

export interface AuthState {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

/** Permissions map — extend per feature */
export type Permission = 'users:read' | 'users:write' | 'admin:access';

/** Role → permissions mapping */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['users:read', 'users:write', 'admin:access'],
  editor: ['users:read', 'users:write'],
  viewer: ['users:read'],
};
