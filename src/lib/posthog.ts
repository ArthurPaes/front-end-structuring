/**
 * @file PostHog singleton — re-exported for use outside React components.
 *
 * INITIALISATION:
 *   PostHog is now initialised by <PostHogProvider> in AppProviders.tsx,
 *   following the official @posthog/react integration pattern.
 *   The provider calls posthog.init() once when the app mounts and
 *   makes the instance available via React context.
 *
 * WHY THIS FILE STILL EXISTS:
 *   Some code runs outside the React tree (API interceptors, Zustand actions,
 *   utility functions). Those places can't call React hooks, so they import
 *   the posthog singleton directly from here.
 *   Since PostHogProvider initialises the same singleton, calls like
 *   posthog.capture() and posthog.identify() work correctly even when
 *   invoked outside a component.
 *
 * INSIDE COMPONENTS:
 *   Prefer the React hooks from @posthog/react:
 *     - usePostHog()              → access the instance
 *     - useFeatureFlagEnabled()   → reactive flag value (re-renders on remote change)
 *     - useActiveFeatureFlags()   → all currently enabled flags
 */
import posthog from 'posthog-js';

// Single import point — analytics.ts and featureFlags.ts import from here.
export { posthog };
