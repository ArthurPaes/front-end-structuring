# File Tree

Every file in the project, what it does, and why it exists.

---

## Root

```
/
├── index.html
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── lint-staged.config.js
├── .commitlintrc.json
├── .env.example
├── .env.development
├── .env.staging
├── .env.production
├── .gitignore
├── .dockerignore
├── Dockerfile
├── nginx.conf
├── vercel.json
├── netlify.toml
├── CHANGELOG.md
├── README.md
├── docs/
│   ├── FLOWCHART.md
│   └── FILE_TREE.md   ← you are here
├── public/
│   └── mockServiceWorker.js
├── e2e/
└── src/
```

---

### `index.html`
The one and only HTML file. The browser always loads this first, regardless of what URL was typed. Contains `<div id="root">` (React's mount target) and a `<script type="module">` tag pointing at `main.tsx`. In production every route is rewritten to this file by Nginx/Vercel/Netlify so React Router can handle navigation client-side.

### `package.json`
Lists all dependencies and defines every runnable script. Key scripts:
- `dev` — starts Vite dev server
- `build` — type-checks then bundles for production
- `test` — runs Vitest
- `test:e2e` — runs Playwright
- `lint` / `lint:fix` — runs ESLint
- `format` — runs Prettier
- `typecheck` — runs `tsc --noEmit`
- `prepare` — sets up Husky git hooks on `npm install`

### `vite.config.ts`
The build system configuration. Registers the React plugin (JSX transform), the Tailwind plugin (CSS generation), the `@/` path alias, and the production chunk-splitting strategy. In dev it also acts as the local server with Hot Module Replacement.

### `vitest.config.ts`
Test runner configuration. Sets the test environment to `jsdom` (simulated browser DOM in Node), enables global test functions (`describe`, `it`, `expect` without importing them), points to the setup file, and configures code coverage thresholds at 70%. Also defines the env variables Vitest injects so Zod validation in `env.ts` passes during tests.

### `playwright.config.ts`
End-to-end test configuration. Sets the base URL, configures which browsers to test in (Chromium by default), enables screenshots on failure, and sets retry counts for CI.

### `tsconfig.json`
Root TypeScript config — references the two child configs below. Does not contain compiler options itself; it just stitches them together.

### `tsconfig.app.json`
TypeScript config for your source code (`src/`). Strict mode on, target ES2022, includes the `@/` path alias so the type checker resolves the same imports as Vite. Also includes `vitest/globals` so global test functions are typed without explicit imports.

### `tsconfig.node.json`
TypeScript config for config files themselves (`vite.config.ts`, `vitest.config.ts`, etc.). These run in Node, not the browser, so they need different settings.

### `eslint.config.js`
Linting rules. Enforces TypeScript-aware rules, React Hooks rules, and a custom `no-restricted-imports` rule that prevents importing directly from deep feature paths (enforcing the barrel export architecture). Also integrates Prettier so formatting conflicts are caught as lint errors.

### `.prettierrc`
Code formatting config. Single quotes, no semicolons, 100-character line width, trailing commas. Prettier runs on save (editor) and on commit (lint-staged).

### `.prettierignore`
Files Prettier should skip — `dist/`, `node_modules/`, generated files.

### `lint-staged.config.js`
Defines what runs on staged files before a commit is allowed. On `.ts`/`.tsx` files: ESLint fix, then Prettier format. On `.json`/`.md`: Prettier only.

### `.commitlintrc.json`
Enforces Conventional Commits format: `feat:`, `fix:`, `chore:`, `docs:`, etc. Rejected commit messages won't be accepted by the git hook.

### `.env.example`
Template showing every available environment variable with placeholder values. This is the file you commit. The actual `.env.*` files are gitignored. New developers copy this and fill in their values.

### `.env.development`
Values used when running `npm run dev`. Has `VITE_ENABLE_MSW=true` so MSW intercepts requests. API base URL points to localhost.

### `.env.staging` / `.env.production`
Values used for those deployment environments. MSW disabled. API URLs point to real backends.

### `.gitignore`
Tells Git what not to track: `node_modules/`, `dist/`, `.env.*` (except `.env.example`), coverage reports, editor folders.

### `Dockerfile`
Multi-stage build. Stage 1 (Node): installs dependencies, runs `npm run build`, produces `dist/`. Stage 2 (Nginx alpine): copies only `dist/` and `nginx.conf` into a minimal Nginx image. Result: a small, self-contained container with no Node.js at runtime.

### `.dockerignore`
Files Docker should not copy into the build context: `node_modules/`, `.git/`, `.env.*` files that shouldn't be baked into the image.

### `nginx.conf`
Nginx server configuration for self-hosted deployments. Key directive: `try_files $uri $uri/ /index.html` — serves the real file if it exists, otherwise falls back to `index.html` so React Router handles the route client-side. Also enables gzip compression and sets cache headers for hashed assets.

### `vercel.json`
One rewrite rule: any path `/*` → `/index.html`. Vercel handles everything else automatically (CDN, HTTPS, preview deployments per PR).

### `netlify.toml`
Build command, publish directory (`dist/`), and the same SPA rewrite rule as Vercel. Netlify reads this file and applies the configuration on deploy.

### `CHANGELOG.md`
Tracks notable changes per version. Follows Keep a Changelog format. Updated manually or via `standard-version` / `release-it` automation.

---

## `public/`

### `public/mockServiceWorker.js`
Generated by `npx msw init public/`. This is the MSW service worker script the browser registers. It intercepts fetch requests and routes them to your MSW handlers. Never edit this file manually — regenerate it when upgrading MSW.

---

## `e2e/`

```
e2e/
├── auth.spec.ts
└── fixtures/
    └── test-user.ts
```

### `e2e/auth.spec.ts`
Playwright test suite for authentication. Tests the full login flow in a real browser: navigate to `/login`, fill in credentials, submit, assert redirect to `/dashboard`. Also tests redirect behaviour for unauthenticated users trying to access protected routes.

### `e2e/fixtures/test-user.ts`
Shared test data for E2E tests — email, password, name — so test credentials are defined in one place.

---

## `src/`

```
src/
├── main.tsx
├── App.tsx
├── api/
├── assets/
├── components/
├── config/
├── constants/
├── context/
├── features/
├── hooks/
├── lib/
├── pages/
├── providers/
├── router/
├── store/
├── styles/
├── tests/
├── types/
└── utils/
```

---

### `src/main.tsx`
The application entry point. The first file executed. Boots external services, conditionally starts the MSW browser worker, mounts the React app into `#root`, and kicks off Web Vitals reporting. Everything in the app flows from here.

### `src/App.tsx`
Minimal shell component — currently just a null return. The real app lives in `RouterProvider`. This file remains as a hook point if you ever need a component that wraps the router output.

---

## `src/api/`

```
src/api/
├── client.ts
├── endpoints.ts
├── types.ts
└── index.ts
```

### `src/api/client.ts`
The Axios instance used for every HTTP call in the app. Configured with the base URL from `env.ts`, a timeout, and `withCredentials: true` (so the browser sends the httpOnly refresh cookie).

Has two interceptors:
- **Request:** reads the in-memory access token and attaches it as an `Authorization: Bearer` header automatically. No component ever sets auth headers manually.
- **Response (401 handler):** when a 401 is received, it doesn't logout immediately. It queues the failed request, fires one `POST /auth/refresh` call, and on success replays all queued requests with the new token. If refresh also fails, it calls `clearAuth()` and resets.

Also exports `setAccessToken()` and `getAccessToken()` — the only way to write/read the in-memory token (never stored in localStorage for XSS safety).

### `src/api/endpoints.ts`
Every API URL string in one place. `ENDPOINTS.AUTH.LOGIN`, `ENDPOINTS.AUTH.REFRESH`, etc. No component or hook hardcodes a URL string.

### `src/api/types.ts`
TypeScript interfaces that mirror backend DTOs: `LoginRequest`, `LoginResponse`, `AuthUser`, `UserRole`, `RegisterRequest`. These are the data contracts between the frontend and the API.

### `src/api/index.ts`
Barrel — re-exports `apiClient`, `setAccessToken`, `getAccessToken`, and `ENDPOINTS` from a single import path.

---

## `src/assets/`

```
src/assets/
├── fonts/
├── icons/
└── images/
```

Static asset folders. Files here are processed by Vite (hashed filenames in production for cache busting). The `.gitkeep` files exist only to commit the empty folders to Git.

---

## `src/components/`

```
src/components/
├── AuthLayout/
├── Button/
├── DashboardLayout/
├── ErrorBoundary/
├── FormField/
├── Input/
├── LoginForm/
├── RegisterForm/
├── Select/
├── Spinner/
└── index.ts
```

Reusable UI components. Not tied to any specific route or business domain.

### `src/components/AuthLayout/AuthLayout.tsx`
The layout for auth pages (login, register). Dark gradient background with a centred card. Uses React Router's `<Outlet />` — child routes (LoginPage, RegisterPage) render inside the card automatically. The brand logo and app name come from `env.APP_NAME`.

### `src/components/Button/Button.tsx`
The primary interactive element. Accepts `variant` (primary / secondary / danger / ghost), `size` (sm / md / lg), and `isLoading`. When loading: spinner appears, button is disabled, `aria-busy="true"` is set. Extends native `ButtonHTMLAttributes` so all standard button props work. Uses CSS Modules for base styles + `cn()` for conditional Tailwind classes.

### `src/components/Button/Button.test.tsx`
Tests: renders text, fires onClick, disables when isLoading, applies the correct variant class.

### `src/components/Button/Button.stories.tsx`
Storybook stories showing each variant and size in isolation. Not in the production bundle.

### `src/components/Button/Button.module.css`
CSS Module for the base `.button` class — layout, font weight, border-radius. Tailwind handles colours and sizing.

### `src/components/DashboardLayout/DashboardLayout.tsx`
The shell for all authenticated pages. Collapsible dark sidebar with active-route highlighting, a top header bar showing the current user's name and a sign-out button, and `<Outlet />` for page content. Reads `sidebarCollapsed` from the Zustand UI store and `user` from the auth store.

### `src/components/ErrorBoundary/ErrorBoundary.tsx`
A React class component (error boundaries must be class components). Wraps the entire app. If any child throws an unhandled error during render, this catches it and shows a fallback UI instead of a white screen. Also calls `captureException()` from the error monitoring lib.

### `src/components/FormField/FormField.tsx`
A thin wrapper around `Input` that passes the `label` prop through. Exists as a named abstraction — form code reads `<FormField label="Email" />` rather than `<Input label="Email" />`, making it easy to add form-level behaviour (icons, character counts) later without changing `Input`.

### `src/components/Input/Input.tsx`
Accessible text input with built-in label support. Uses `forwardRef` so parent components can attach refs to the underlying `<input>` (needed for focus management, form libraries). When an `error` prop is passed: red border, error message below, `aria-invalid="true"`, `aria-describedby` wired to the error text for screen readers.

### `src/components/LoginForm/LoginForm.tsx`
The complete login form. Local state: email, password, showPassword. Calls `useLogin()` (React Query mutation) on submit. On success: navigates to the originally intended route (or `/dashboard` as fallback). On error: shows a styled alert. Includes a show/hide password toggle and "Remember me" checkbox.

### `src/components/LoginForm/LoginForm.test.tsx`
Tests: renders fields, password visibility toggle, success submission, error display on 401, button disabled state during loading.

### `src/components/RegisterForm/RegisterForm.tsx`
Full registration form with name, email, password, and confirm-password fields. Validates password length and match client-side before calling `useRegister()`. On success navigates to `/dashboard`.

### `src/components/Select/Select.tsx`
Compound component pattern example. `Select.Root`, `Select.Trigger`, `Select.Option` work together — internal state is shared via React Context without external consumers needing to manage it.

### `src/components/Spinner/Spinner.tsx`
A simple animated loading spinner SVG. Used in the `Button` component and the `RequireAuth` loading state.

### `src/components/index.ts`
Barrel file — re-exports every component so consumers import from `@/components` instead of deep paths.

---

## `src/config/`

### `src/config/env.ts`
Single source of truth for environment variables. At module load time, reads all `import.meta.env.VITE_*` values, validates them through a Zod schema, and exports a frozen `env` object. If any required variable is missing or wrong type, it throws immediately with a clear error before anything renders. Nothing in the codebase reads `import.meta.env` directly — everything goes through this file.

### `src/config/index.ts`
Barrel — re-exports `env`.

---

## `src/constants/`

```
src/constants/
├── app.ts
├── queryKeys.ts
├── routes.ts
└── index.ts
```

### `src/constants/app.ts`
Application-wide magic values: pagination defaults, date formats, timeouts, storage key names. Never scatter these as inline literals.

### `src/constants/queryKeys.ts`
TanStack Query cache key factories. Every `useQuery` call references keys from here so cache invalidations (e.g. `queryClient.invalidateQueries(QUERY_KEYS.user.me())`) are consistent.

### `src/constants/routes.ts`
Every route path string: `ROUTES.LOGIN = '/login'`, `ROUTES.DASHBOARD = '/dashboard'`, etc. No component ever has a path string as a literal. If a route changes, one file changes.

---

## `src/context/`

### `src/context/ThemeContext.tsx`
React Context for the theme system. `ThemeProvider` persists the selected theme (`'light' | 'dark' | 'system'`) to localStorage, watches the `prefers-color-scheme` media query, and writes `data-theme` to `<html>`. The `useTheme()` hook is the consumer API. Components never manually manipulate `document.documentElement` — they go through `useTheme()`.

---

## `src/features/`

Feature-Sliced Design: each feature owns its own api, hooks, store, types, and components. Nothing outside a feature imports from its internal paths — only from its `index.ts` barrel.

```
src/features/
├── auth/
│   ├── api/
│   │   ├── auth.api.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useLogin.ts
│   │   ├── useRegister.ts
│   │   └── index.ts
│   ├── store/
│   │   ├── auth.store.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── index.ts
│   └── index.ts
└── dashboard/
    ├── api/
    ├── components/
    │   └── DashboardOverview.tsx
    ├── hooks/
    ├── types/
    └── index.ts
```

### `src/features/auth/api/auth.api.ts`
Raw API functions for the auth domain: `loginApi`, `registerApi`, `fetchCurrentUser`, `logoutApi`, `refreshTokenApi`. These call `apiClient` directly and return typed promises. No mutation state lives here — that's for React Query hooks.

### `src/features/auth/hooks/useAuth.ts`
High-level auth actions for components: `login`, `logout`, `checkAuth`, `hasRole`, `hasPermission`. Reads state from the Zustand auth store and exposes clean, named actions. This is the main hook most components use for auth.

### `src/features/auth/hooks/useLogin.ts`
React Query `useMutation` wrapper for the login action. Calls `loginApi()`, and on success calls `setUser()` in the auth store. Gives components `isPending`, `error`, and `mutate` from a single import.

### `src/features/auth/hooks/useRegister.ts`
Same pattern as `useLogin` but for registration. Wraps `registerApi()`.

### `src/features/auth/store/auth.store.ts`
The Zustand auth store. State: `user`, `isAuthenticated`, `isLoading`. Actions: `setUser` (stores the user + calls `setAccessToken` + analytics identify), `clearAuth` (wipes everything), `setLoading`. Initialises with `isLoading: true` because the app must check for an existing session before deciding authenticated/unauthenticated.

### `src/features/auth/types/auth.types.ts`
Auth-specific types: `AuthenticatedUser`, `AuthState`, `Permission`, `ROLE_PERMISSIONS` (maps each role to its allowed permissions). These are narrower than the API types in `src/api/types.ts` — they represent what the frontend cares about post-login.

### `src/features/auth/index.ts`
Public barrel for the auth feature. Only what is exported here can be imported by the rest of the app.

### `src/features/dashboard/components/DashboardOverview.tsx`
The main dashboard content — welcome banner with the user's name, four stat cards, and a recent activity feed. Uses static mock data. Reads user name from the auth store.

---

## `src/hooks/`

Generic, reusable hooks with no feature dependency.

### `src/hooks/useDebounce.ts`
Returns a debounced version of a value. After the value stops changing for `delay` milliseconds, the debounced value updates. Used for search inputs to avoid firing a query on every keystroke.

### `src/hooks/useLocalStorage.ts`
`useState` synced to `localStorage`. Reads the initial value from storage, listens for cross-tab changes. Used by `ThemeProvider`.

### `src/hooks/useMediaQuery.ts`
Subscribes to a CSS media query string and returns a boolean. Re-renders when the match state changes. Used to detect `prefers-color-scheme: dark`.

---

## `src/lib/`

Thin adapter wrappers around third-party services. The rest of the codebase calls these abstractions, not the SDKs directly. Swapping Sentry for Datadog means changing one file.

### `src/lib/analytics.ts`
Segment analytics stub. Exports `identifyUser()`, `trackEvent()`, `resetAnalytics()`. Fill in the real Segment SDK calls here.

### `src/lib/errorMonitoring.ts`
Sentry stub. Exports `initErrorMonitoring()`, `captureException()`, `setErrorMonitoringUser()`. The `ErrorBoundary` component calls `captureException()` when it catches a render error.

### `src/lib/featureFlags.ts`
Local feature flag store. Exports `initFeatureFlags()`, `useFeatureFlag(flagName)`, and `getFlag(flagName)`. Replace the local store with LaunchDarkly or similar by changing only this file.

### `src/lib/logger.ts`
Structured logger. Outputs to the console in development only — silent in production. Accepts a level (`info`, `warn`, `error`, `debug`), message, optional data, and optional scope tag. All debug/info logging in the app goes through this instead of `console.log`.

### `src/lib/webVitals.ts`
Wires up Web Vitals measurement using the `web-vitals` library. Reports CLS, INP, LCP, FCP, TTFB to `trackEvent()` in analytics. Called once from `main.tsx` after mount.

---

## `src/pages/`

Pages are thin. They do not contain HTML structure or business logic — they compose components and wire routing.

### `src/pages/LoginPage.tsx`
Renders the heading, `<LoginForm />`, and a link to the register page. ~25 lines.

### `src/pages/RegisterPage.tsx`
Renders the heading, `<RegisterForm />`, and a link back to login. ~25 lines.

### `src/pages/DashboardPage.tsx`
Renders `<DashboardOverview />` inside a padding wrapper. The overview component is feature-owned — the page is just glue.

### `src/pages/DashboardPage.test.tsx`
Tests: welcome banner shows user name, all four stat cards render, recent activity section renders.

### `src/pages/SettingsPage.tsx`
Slightly heavier than other pages — wires `useTheme()` and `useAuthStore` directly for the profile card and theme toggle. Includes a danger zone section.

### `src/pages/NotFoundPage.tsx`
Catch-all `*` route. Dark full-page with a ghost "404", a `navigate(-1)` "Go back" button, and a "Take me home" link.

---

## `src/providers/`

### `src/providers/AppProviders.tsx`
Composes the entire provider tree in the correct nesting order: `ErrorBoundary` → `QueryClientProvider` → `ThemeProvider` → `AuthInitializer`. Imported once in `main.tsx`. Centralising providers here keeps `main.tsx` clean and makes the provider order explicit.

### `src/providers/AuthInitializer.tsx`
Fires `checkAuth()` exactly once when the app mounts. This calls `POST /auth/refresh` to silently restore an existing session. Without this, `isLoading` would stay `true` forever and every route guard would show a blank spinner.

---

## `src/router/`

```
src/router/
├── guards/
│   ├── RequireAuth.tsx
│   ├── RequireAuth.test.tsx
│   ├── RequireRole.tsx
│   └── index.ts
├── router.tsx
├── routes.tsx
└── index.ts
```

### `src/router/router.tsx`
Creates the router instance: `createBrowserRouter(routes)`. The modern React Router v6 API. Supports data loading, per-route error boundaries, and cleaner code splitting compared to the legacy `<BrowserRouter>` + `<Routes>` JSX approach.

### `src/router/routes.tsx`
The route tree as a data structure. Every page is `React.lazy()` — its JavaScript chunk is only downloaded the first time that route is visited. Composes route guards and layouts. Also defines the root redirect from `/` to `/dashboard`.

### `src/router/guards/RequireAuth.tsx`
Reads `isLoading` and `isAuthenticated` from the auth store. While loading: shows a spinner. Not authenticated: redirects to `/login` and preserves the intended destination in `location.state.from`. Authenticated: renders children.

### `src/router/guards/RequireAuth.test.tsx`
Tests: authenticated users see protected content, unauthenticated users are redirected, the spinner shows during loading.

### `src/router/guards/RequireRole.tsx`
Accepts an allowed `roles` array, checks `user.role`. If the user's role isn't permitted, redirects to a fallback route (default: `/dashboard`). Used to protect the Settings page to admin/editor only.

---

## `src/store/`

```
src/store/
├── slices/
│   ├── uiSlice.ts
│   └── index.ts
└── index.ts
```

### `src/store/slices/uiSlice.ts`
Zustand store for UI state: `sidebarCollapsed` (boolean), `toggleSidebar()`. Persisted to `localStorage` via Zustand's persist middleware so the sidebar remembers its state across page refreshes. Completely separate from the auth store — different concerns, different stores.

---

## `src/styles/`

```
src/styles/
├── globals.css
├── reset.css
└── tokens.css
```

### `src/styles/globals.css`
The single CSS entry point, imported in `main.tsx`. Uses `@import "tailwindcss"` (Tailwind v4 syntax) which generates all utility classes. Also imports `reset.css` and `tokens.css`.

### `src/styles/reset.css`
Normalises browser default styles — removes default margins, sets `box-sizing: border-box`, makes images block elements. Equivalent to a minimal CSS reset.

### `src/styles/tokens.css`
CSS custom properties (design tokens): `--color-primary`, `--font-size-base`, `--spacing-*`, etc. Has a `[data-theme="dark"]` block that overrides colour tokens for dark mode. `ThemeProvider` sets `data-theme` on `<html>`, which activates the right block automatically.

---

## `src/tests/`

```
src/tests/
├── mocks/
│   ├── browser.ts
│   ├── handlers.ts
│   ├── server.ts
│   └── index.ts
├── setup.ts
└── utils.tsx
```

### `src/tests/setup.ts`
Runs before every test file. Imports `@testing-library/jest-dom/vitest` (adds custom matchers like `toBeInTheDocument()`). Starts the MSW Node server before all tests, resets handlers after each test, and closes the server when done.

### `src/tests/utils.tsx`
Custom `renderWithProviders()` function. Wraps the component under test in `QueryClientProvider` (retry: false, no cache) and `MemoryRouter`. Every component test uses this instead of RTL's `render` directly, so all components have the dependencies they need. Also re-exports `screen`, `waitFor`, `within`, `userEvent` for convenience.

### `src/tests/mocks/handlers.ts`
MSW request handler definitions. Currently defines:
- `POST /auth/refresh` → 401 (unauthenticated on fresh load)
- `POST /auth/login` → 200 with mock user + access token
- `POST /auth/register` → 200 with mock user + access token
- `GET /auth/me` → 200 with mock user
- `POST /auth/logout` → 204
- `GET /users` → 200 with mock user list

Same handlers are used in both the browser (dev) and Node (tests).

### `src/tests/mocks/server.ts`
Creates the MSW Node server using `setupServer(...handlers)`. Used by `setup.ts` for tests.

### `src/tests/mocks/browser.ts`
Creates the MSW browser worker using `setupWorker(...handlers)`. Used by `main.tsx` in development when `VITE_ENABLE_MSW=true`.

---

## `src/types/`

```
src/types/
├── api.types.ts
├── common.types.ts
├── global.d.ts
└── index.ts
```

### `src/types/api.types.ts`
Generic API response shapes used across features: `PaginatedResponse<T>`, `ApiError`, `ApiResponse<T>`. Not feature-specific — any feature's API can return these.

### `src/types/common.types.ts`
Utility types used throughout the app: `Nullable<T>`, `Optional<T>`, `ID`, `Timestamp`, `SelectOption`. Shared primitives.

### `src/types/global.d.ts`
Module declarations for files TypeScript doesn't natively understand (SVG imports, CSS modules, environment variable shapes). Extends `ImportMeta` to type `import.meta.env`.

---

## `src/utils/`

```
src/utils/
├── cn.ts
├── formatDate.ts
├── storage.ts
└── index.ts
```

### `src/utils/cn.ts`
Combines `clsx` (conditional class joining) and `tailwind-merge` (resolves conflicting Tailwind classes). Every component uses `cn()` for its `className`. Without `tailwind-merge`, passing `className="text-red-500"` to a component that already has `text-blue-500` would not override it correctly.

### `src/utils/formatDate.ts`
Date formatting utilities using the native `Intl.DateTimeFormat` API. `formatDate()`, `formatRelativeTime()`, `formatDateTime()`. Centralises locale-aware formatting.

### `src/utils/storage.ts`
Type-safe wrappers around `localStorage` and `sessionStorage`. `getItem<T>()`, `setItem()`, `removeItem()` with JSON serialization/deserialization and try/catch for environments where storage is unavailable (private browsing, storage full).
