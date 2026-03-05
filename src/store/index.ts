/**
 * @file Global app store — re-exports all slices.
 *
 * WHY NOT A SINGLE MEGA-STORE?
 * Zustand recommends multiple small stores (slices) rather than one
 * monolithic store. Each slice is independently subscribable, which
 * prevents unnecessary re-renders.
 *
 * For server state (API data), use React Query — not Zustand.
 */
export { useUiStore } from './slices/uiSlice';
