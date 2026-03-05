/**
 * @file Feature flags — powered by PostHog.
 *
 * ARCHITECTURE: This file is the only place that knows about PostHog feature flags
 * for non-React contexts (store actions, API interceptors, utilities).
 *
 * INSIDE COMPONENTS: Use the reactive hook from @posthog/react instead:
 *   const isEnabled = useFeatureFlagEnabled('new-dashboard');
 *   // The hook re-renders the component when the flag changes remotely —
 *   // no page reload needed to roll a flag out or back.
 *
 * HOW POSTHOG FLAGS WORK:
 *   1. You define a flag in the PostHog dashboard (e.g. 'new-dashboard')
 *   2. You set rollout rules (100% of users, 10% of users, specific emails, etc.)
 *   3. On app load, PostHogProvider fetches the flag state for the current user
 *   4. isFeatureEnabled('new-dashboard') returns true/false based on that
 *
 * LOCAL FALLBACK:
 *   When VITE_POSTHOG_KEY is not set (local dev without a PostHog account),
 *   flags fall back to LOCAL_FLAGS so development still works.
 */
import { posthog } from './posthog';
import { env } from '@/config';

/** Known feature flag names — add new flags here as you create them in PostHog */
export type FeatureFlag =
  | 'new-dashboard'  // shows the redesigned dashboard (our demo flag)
  | 'dark-mode'
  | 'beta-export'
  | (string & {}); // allow arbitrary strings but still suggest known ones in autocomplete

/**
 * Local fallback values used when PostHog is not configured.
 * Change these to test flag behaviour locally without a PostHog account.
 */
const LOCAL_FLAGS: Record<string, boolean> = {
  'new-dashboard': true, // ← flip this to false to see the old dashboard locally
  'dark-mode': true,
  'beta-export': false,
};

/**
 * Check if a feature flag is enabled for the current user.
 *
 * With PostHog configured: returns the value PostHog resolved for this user
 *   based on the rollout rules you set in the dashboard.
 * Without PostHog (no key): falls back to LOCAL_FLAGS above.
 *
 * Usage:
 *   if (isFeatureEnabled('new-dashboard')) {
 *     return <NewDashboard />;
 *   }
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  if (env.POSTHOG_KEY) {
    // posthog.isFeatureEnabled returns boolean | undefined
    // undefined means the flags haven't loaded yet — default to false
    return posthog.isFeatureEnabled(flag) ?? false;
  }

  // No PostHog key — use local hardcoded fallback
  return LOCAL_FLAGS[flag] ?? false;
}
