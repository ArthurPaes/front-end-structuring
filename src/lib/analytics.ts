/**
 * @file Analytics adapter — powered by PostHog.
 *
 * ARCHITECTURE: Dependency Inversion — components never call the PostHog SDK
 * directly. They call these named functions. If we ever swap PostHog for
 * Mixpanel or Amplitude, only this file changes.
 */

import { posthog } from './posthog';
import { env } from '@/config';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

/** True when PostHog is configured (VITE_POSTHOG_KEY is set) */
function isEnabled(): boolean {
  return Boolean(env.POSTHOG_KEY);
}

/**
 * Identify a user after login.
 * PostHog ties all subsequent events to this user ID in its dashboard.
 * You'll see their full event history, session recordings, etc.
 */
export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (!isEnabled()) return;
  posthog.identify(userId, traits);
}

/**
 * Track a custom event.
 * Shows up in PostHog → Activity → Events.
 * Example: trackEvent({ name: 'export_clicked', properties: { format: 'csv' } })
 */
export function trackEvent({ name, properties }: AnalyticsEvent): void {
  if (!isEnabled()) return;
  posthog.capture(name, properties);
}

/**
 * Track a page view.
 * Call this on every React Router navigation since PostHog's auto-capture
 * is disabled (SPAs don't do full page reloads).
 */
export function trackPageView(path: string): void {
  if (!isEnabled()) return;
  posthog.capture('$pageview', { $current_url: path });
}

/**
 * Reset analytics state on logout.
 * Clears the PostHog distinct ID so the next user's events aren't
 * accidentally tied to the previous user's profile.
 */
export function resetAnalytics(): void {
  if (!isEnabled()) return;
  posthog.reset();
}
