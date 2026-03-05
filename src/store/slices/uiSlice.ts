/**
 * @file UI state slice — sidebar, theme, toasts, etc.
 *
 * ARCHITECTURE: Each Zustand slice owns one concern.
 * For server-state, use React Query instead of Zustand.
 *
 * SOLID: Single Responsibility — this slice only manages UI state.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';

interface UiState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
}

interface UiActions {
  toggleSidebar: () => void;
  setTheme: (theme: UiState['theme']) => void;
}

export const useUiStore = create<UiState & UiActions>()(
  persist(
    (set) => ({
      // ── State ─────────────────────────────────────────
      sidebarCollapsed: false,
      theme: 'system',

      // ── Actions ───────────────────────────────────────
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: STORAGE_KEYS.SIDEBAR_COLLAPSED,
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    },
  ),
);
