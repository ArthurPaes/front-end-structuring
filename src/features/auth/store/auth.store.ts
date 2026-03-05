/**
 * @file Auth Zustand store — manages authentication state.
 *
 * WHY ZUSTAND (not Context)?
 *   - Auth state is read frequently from many places (navbars, guards, etc.)
 *   - Zustand causes zero re-renders for non-subscribers
 *   - Context would re-render every consumer on any auth state change
 *
 * TOKEN STRATEGY:
 *   - Access token is stored in-memory (this store) — XSS safe
 *   - Refresh token is an httpOnly cookie managed by the backend
 */
import { create } from 'zustand';
import { setAccessToken } from '@/api';
import type { AuthenticatedUser } from '../types';
import { setErrorMonitoringUser, identifyUser, resetAnalytics } from '@/lib';

interface AuthStoreState {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthStoreActions {
  setUser: (user: AuthenticatedUser, accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStoreState & AuthStoreActions>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // true initially while we check for existing session

  setUser: (user, accessToken) => {
    setAccessToken(accessToken);
    setErrorMonitoringUser({ id: user.id, email: user.email });
    identifyUser(user.id, { email: user.email, name: user.name, role: user.role });
    set({ user, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    setAccessToken(null);
    setErrorMonitoringUser(null);
    resetAnalytics();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
