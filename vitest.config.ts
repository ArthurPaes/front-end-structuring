/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'e2e'],
    css: { modules: { classNameStrategy: 'non-scoped' } },

    // ── Env variables for test runs ───────────────────────
    // Mirrors .env.development so Zod validation passes.
    env: {
      VITE_APP_NAME: 'TestApp',
      VITE_API_BASE_URL: 'http://localhost:3000/api',
      VITE_API_TIMEOUT: '10000',
      VITE_AUTH_TOKEN_KEY: 'auth_token',
      VITE_SENTRY_DSN: '',
      VITE_ENABLE_MSW: 'false',
    },

    // ── Coverage ──────────────────────────────────────────
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/**/*.stories.tsx',
        'src/**/*.test.{ts,tsx}',
        'src/**/index.ts', // barrel files
        'src/tests/**',
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});
