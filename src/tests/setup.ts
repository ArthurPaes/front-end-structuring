/**
 * @file Vitest setup — runs before every test file.
 *
 * TESTING STRATEGY:
 *   - Unit tests: pure functions, hooks (Vitest)
 *   - Component tests: render + userEvent (React Testing Library)
 *   - Integration tests: feature-level with mocked API (MSW)
 *   - E2E tests: full user flows (Playwright, in /e2e/)
 *
 * CO-LOCATED vs. CENTRALISED TESTS:
 *   RECOMMENDATION: Co-locate unit/component tests next to the source file
 *   (e.g., Button.test.tsx next to Button.tsx). This keeps related code
 *   together and makes it obvious which files have tests.
 *
 *   Use src/tests/ only for:
 *   - This setup file
 *   - Shared test utilities (custom render, factories)
 *   - MSW mock handlers
 *
 *   E2E tests live in /e2e/ at the project root (separate concern).
 */

import '@testing-library/jest-dom/vitest';

// ── MSW server setup ──────────────────────────────────────
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
