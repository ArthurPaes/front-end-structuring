/**
 * @file Dashboard feature — example of a second feature module.
 *
 * FEATURE-SLICED DESIGN: Each feature owns its own:
 *   api/       — API functions
 *   components/ — feature-specific components
 *   hooks/     — feature-specific hooks
 *   store/     — feature-specific Zustand slice (if needed)
 *   types/     — feature-specific types
 *   index.ts   — public barrel export
 */

// This file serves as a placeholder showing the pattern.
// Populate each sub-folder as the feature grows.

export { DashboardOverview } from './components/DashboardOverview';
export { DashboardOverviewV2 } from './components/DashboardOverviewV2';
