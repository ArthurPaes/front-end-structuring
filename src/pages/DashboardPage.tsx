/**
 * @file Dashboard page — composes feature-owned components.
 *
 * FEATURE FLAG DEMO:
 *   This page reads the 'new-dashboard' flag from PostHog using the
 *   useFeatureFlagEnabled() hook from @posthog/react.
 *   - Flag ON  → renders DashboardOverviewV2 (violet redesign, "✨ New Dashboard" badge)
 *   - Flag OFF → renders DashboardOverview   (original indigo version)
 *
 *   WHY A HOOK instead of isFeatureEnabled()?
 *   The hook is reactive — if a flag changes remotely (e.g. you flip it in the
 *   PostHog dashboard), the component re-renders automatically with the new value,
 *   without a page reload. Perfect for gradual rollouts and instant roll-backs.
 *
 *   To toggle locally: change 'new-dashboard' in src/lib/featureFlags.ts LOCAL_FLAGS.
 *   In production:     flip the flag in your PostHog dashboard — no redeploy needed.
 */
import { useFeatureFlagEnabled } from '@posthog/react';
import { DashboardOverview, DashboardOverviewV2 } from '@/features/dashboard';

export default function DashboardPage() {
  // useFeatureFlagEnabled returns true | false | undefined.
  // undefined = flags haven't loaded yet from PostHog → treat as false.
  const showNewDashboard = useFeatureFlagEnabled('new-dashboard') ?? false;

  return (
    <div className="p-6">
      {showNewDashboard ? (
        // NEW: violet gradient header, badge, updated metric cards
        <DashboardOverviewV2 />
      ) : (
        // OLD: original indigo version
        <DashboardOverview />
      )}
    </div>
  );
}

