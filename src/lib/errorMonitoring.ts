/**
 * @file Error monitoring adapter — wraps Sentry (or any error service).
 *
 * ARCHITECTURE: Never import Sentry directly in feature code.
 * This adapter can be swapped for Bugsnag, Datadog, etc.
 */

import { env } from '@/config';

interface ErrorContext {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  user?: { id: string; email?: string };
}

/** Initialise error monitoring (call once at app startup) */
export function initErrorMonitoring(): void {
  if (!env.SENTRY_DSN) return;

  // Sentry.init({
  //   dsn: env.SENTRY_DSN,
  //   environment: env.MODE,
  //   release: `${env.APP_NAME}@${import.meta.env.VITE_APP_VERSION ?? '0.0.0'}`,
  //   tracesSampleRate: env.IS_PROD ? 0.2 : 1.0,
  // });

  if (env.IS_DEV) {
    console.debug('[sentry] initialised (dev stub)');
  }
}

/** Capture an exception */
export function captureException(error: unknown, context?: ErrorContext): void {
  if (!env.SENTRY_DSN) {
    console.error('[error-monitor]', error, context);
    return;
  }

  // Sentry.captureException(error, {
  //   tags: context?.tags,
  //   extra: context?.extra,
  //   user: context?.user,
  // });
  console.error('[sentry] captured', error);
}

/** Capture a message (non-error) */
export function captureMessage(message: string, level: 'info' | 'warning' = 'info'): void {
  if (!env.SENTRY_DSN) return;

  // Sentry.captureMessage(message, level);
  if (env.IS_DEV) {
    console.debug(`[sentry] ${level}:`, message);
  }
}

/** Set user context for error reports */
export function setErrorMonitoringUser(user: { id: string; email?: string } | null): void {
  // Sentry.setUser(user);
  if (env.IS_DEV) {
    console.debug('[sentry] setUser', user);
  }
}
