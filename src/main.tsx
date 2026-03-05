import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/providers';
import { router } from '@/router';
import { initErrorMonitoring, reportWebVitals } from '@/lib';
import { env } from '@/config';

// ── Global styles (Tailwind + reset + tokens) ─────────────
import '@/styles/globals.css';

// ── Initialise external services ──────────────────────────
initErrorMonitoring();
// Note: PostHog (analytics + feature flags) is initialised by <PostHogProvider>
// in AppProviders.tsx — no manual init call needed here.

// ── Mount app (optionally after MSW worker starts) ────────
//
// MSW — Mock Service Worker
// ─────────────────────────
// MSW is a library that intercepts real HTTP requests inside the browser
// (or Node.js for tests) and returns fake responses you define — without
// any real backend server running.
//
// WHY we need it:
//   This app has a full auth flow (login, session refresh, logout) that all
//   require API calls. During development there is no real backend. Without
//   MSW, every API call would either fail with a network error or require
//   spinning up a separate server just to return dummy JSON.
//   MSW lets you work on the entire frontend — including auth, loading states,
//   and error states — completely independently of the backend.
//
// HOW it works in the browser:
//   MSW uses the browser's built-in Service Worker API. A service worker is
//   a script the browser runs in a separate background thread, sitting between
//   your page and the network. MSW's worker script (/public/mockServiceWorker.js)
//   registers itself as that intermediary. When your app calls fetch('/auth/login'),
//   the request passes through the service worker first. MSW matches it against
//   your handler definitions (src/tests/mocks/handlers.ts) and returns the mock
//   response — the real network is never touched.
//
// HOW it works in tests:
//   In Node.js (Vitest), there is no browser / service worker. MSW switches to
//   a Node-compatible HTTP interception layer instead. The exact same handlers.ts
//   file is reused, so mock behaviour is identical between browser and tests.
//
// WHY it must start BEFORE rendering:
//   The moment React renders, AuthInitializer fires checkAuth() → POST /auth/refresh.
//   If MSW isn't registered yet, that request escapes to the real network and
//   fails. By awaiting worker.start() first, we guarantee MSW is in place before
//   any component even mounts.
//
// async because we may need to await the MSW service worker registration
// before rendering — see reasoning above.
async function mount() {
  if (env.ENABLE_MSW) {
    // Dynamic import — only evaluated when ENABLE_MSW is true.
    // Because env.ENABLE_MSW is a compile-time constant (set in .env files and
    // validated by src/config/env.ts), Vite's tree-shaker removes this entire
    // branch in the production build. MSW and all handler code are completely
    // absent from what real users download.
    const { worker } = await import('@/tests/mocks/browser');

    // Registers /public/mockServiceWorker.js as a real browser Service Worker.
    // The file was generated once by running: npx msw init public/ --save
    // After this resolves, every fetch() the page makes passes through the
    // service worker and is matched against handlers.ts before hitting the network.
    await worker.start({
      // Don't warn/error on requests with no matching handler
      // (fonts, images, Vite HMR websocket, etc.) — just pass them through.
      // Without this, the console would flood with warnings for every asset load.
      //why woukd it warn: Because MSW's default behavior is to log a warning for any request 
      // that doesn't match a defined handler. In a typical React app, 
      // there are many requests for static assets (like fonts and images) and 
      // development tools (like Vite's hot module replacement) that aren't relevant to the API mocking.
      //  By setting onUnhandledRequest to 'bypass', we tell MSW to ignore these unmatched requests and
      //  let them proceed to the network without logging warnings, keeping the console clean and
      //  focused on relevant API interactions.
      onUnhandledRequest: 'bypass',
    });
  }

  // getElementById('root') matches <div id="root"> in index.html.
  // The ! asserts it's never null — safe because we control index.html.
  // createRoot is the React 18+ API; it enables concurrent rendering features.
  createRoot(document.getElementById('root')!).render(
    // StrictMode double-invokes renders in development to surface side-effects
    // and deprecated API usage. Has zero effect in production builds.
    <StrictMode>
      {/* AppProviders stacks all context providers in the correct order:
          ErrorBoundary → QueryClientProvider → ThemeProvider → AuthInitializer */}
      <AppProviders>
        {/* RouterProvider hands rendering control to React Router.
            It reads the current URL and renders the matching route tree. */}
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  );
}

// void discards the returned Promise intentionally — nothing needs to happen
// after the app mounts, and this silences the "floating promise" lint rule.

void mount();

// ── Report Web Vitals (async, non-blocking) ───────────────
reportWebVitals();
