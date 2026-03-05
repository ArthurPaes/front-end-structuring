/**
 * @file AppProviders — composes all context providers in the correct order.
 *
 * ARCHITECTURE: Centralised provider tree prevents deeply nested JSX
 * in main.tsx. Order matters — outermost providers are available to inner ones.
 */
import { type ReactNode } from 'react';
import { PostHogProvider } from '@posthog/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthInitializer } from './AuthInitializer';

// ── React Query client (singleton) ────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

interface AppProvidersProps {
  readonly children: ReactNode;
}

/**
 * Wrap the entire app with this component in main.tsx.
 * Provider order (outermost → innermost):
 *   1. PostHogProvider  — initialises PostHog analytics + feature flags
 *   2. ErrorBoundary    — catches any unhandled render errors
 *   3. QueryClientProvider — React Query
 *   4. ThemeProvider    — theme context
 *   5. AuthInitializer  — restores auth session on startup
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    // PostHogProvider initialises posthog-js once and makes the PostHog
    // instance available to the entire tree via React context.
    // Hooks like useFeatureFlagEnabled() and usePostHog() only work inside this provider.
    <PostHogProvider
      apiKey={import.meta.env.VITE_POSTHOG_KEY ?? ''}
      options={{
        api_host: import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com',
        // Opt into PostHog's stable defaults baseline (recommended by PostHog docs)
        defaults: '2026-01-30',
        // Don't auto-capture pageviews — React Router navigates without full reloads,
        // so PostHog's auto-capture only fires once on initial load and misses all
        // subsequent navigation. We call posthog.capture('$pageview') manually instead.
        capture_pageview: false,
        // Disable event capture in development so local testing doesn't pollute
        // your PostHog analytics dashboard with fake data.
        loaded: (ph) => {
          if (import.meta.env.DEV) ph.opt_out_capturing();
        },
      }}
    >
      <ErrorBoundary scope="root">
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthInitializer>
              {children}
            </AuthInitializer>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </PostHogProvider>
  );
}
