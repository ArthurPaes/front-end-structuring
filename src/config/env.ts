/**
 * @file Typed, runtime-validated environment variable access.
 *
 * WHY: Never scatter raw `import.meta.env.VITE_*` across the codebase.
 * This module validates env vars at startup using Zod and exposes a
 * single, type-safe `env` object.
 *
 * ARCHITECTURE: Dependency Inversion — all modules import env from here,
 * never from `import.meta.env` directly.
 */
import { z } from 'zod';

const envSchema = z.object({
  // App
  APP_NAME: z.string().default('MyApp'),

  // API
  API_BASE_URL: z.string().url(),
  API_TIMEOUT: z.coerce.number().positive().default(10_000),

  // Auth
  AUTH_TOKEN_KEY: z.string().default('access_token'),
  AUTH_REFRESH_TOKEN_KEY: z.string().default('refresh_token'),

  // External services
  SENTRY_DSN: z.string().optional(),
  ANALYTICS_WRITE_KEY: z.string().optional(),
  FEATURE_FLAGS_KEY: z.string().optional(),
  // PostHog covers both analytics + feature flags in one key
  POSTHOG_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().optional(),

  // Build / DX
  ENABLE_MSW: z.coerce.boolean().default(false),

  // Derived (non-VITE_ source)
  IS_DEV: z.boolean(),
  IS_PROD: z.boolean(),
  MODE: z.string(),
});

export type Env = z.infer<typeof envSchema>;

function createEnv(): Env {
  const raw = {
    APP_NAME: import.meta.env.VITE_APP_NAME,
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
    AUTH_TOKEN_KEY: import.meta.env.VITE_AUTH_TOKEN_KEY,
    AUTH_REFRESH_TOKEN_KEY: import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY,
    SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    ANALYTICS_WRITE_KEY: import.meta.env.VITE_ANALYTICS_WRITE_KEY,
    FEATURE_FLAGS_KEY: import.meta.env.VITE_FEATURE_FLAGS_KEY,
    POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY,
    POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST,
    ENABLE_MSW: import.meta.env.VITE_ENABLE_MSW,
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE,
  };

  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables — check the console for details.');
  }

  return Object.freeze(parsed.data);
}

/** Singleton, validated environment config. Import this everywhere. */
export const env = createEnv();
