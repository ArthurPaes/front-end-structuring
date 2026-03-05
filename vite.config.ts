import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
//What does this config file do: This file configures Vite, 
// the build tool and development server for this React project. 
// It sets up plugins, path aliases, build optimizations, 
// and dev server settings to create an efficient development and production environment.
export default defineConfig({
  // ── Plugins ────────────────────────────────────────────
  // Vite plugins transform code and assets during dev and build.
  plugins: [
    react({
      babel: {
        // React Compiler (babel-plugin-react-compiler) automatically memoizes
        // components and hooks at compile time — replaces manual useMemo/useCallback.
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    // @tailwindcss/vite scans all .tsx/.ts files for class names and generates
    // only the CSS that is actually used. No tailwind.config.ts needed in v4.
    tailwindcss(),
  ],

  // ── Path aliases ────────────────────────────────────────
  // Maps @/ to src/ so imports like `@/components/Button` resolve correctly
  // in both Vite and the TypeScript compiler (see tsconfig.app.json paths).
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  // ── Build optimizations ─────────────────────────────────
  build: {
    // Emit modern JS — no legacy polyfills, smaller output.
    target: 'es2022',
    // Source maps let error monitoring tools (Sentry etc.) show original
    // TypeScript line numbers in production stack traces.
    sourcemap: true,
    rollupOptions: {
      output: {
        // Manual chunk splitting keeps vendor libraries in separate files.
        // Benefits:
        //   • Browsers cache vendor chunks independently of app code.
        //   • A code change in your app doesn't bust the React or Router cache.
        //   • Parallel downloads — browser fetches multiple smaller files at once.
        // Must be a function (not an object) in Vite 8 / Rollup.
        // What are Vendors: Any dependencies from node_modules that are large and change infrequently, like
        // React, React Router, state management libraries, etc.
        //Why do they change infrequently: Because they are updated by their maintainers,
        //and your project may update them to get new features or bug fixes. However,
        //they typically change less often than your application code.
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-query';
          }
          if (id.includes('node_modules/zustand')) {
            return 'vendor-state';
          }
          // Any unmatched node_modules file stays in Rollup's default chunk.
        },
      },
    },
  },

  // ── Dev server ──────────────────────────────────────────
  server: {
    // Fixed port so the MSW service worker (registered at localhost:5173)
    // doesn't break when the port changes between runs.
    port: 5173,
    strictPort: true, // fail loudly if 5173 is already in use — don't silently pick another
  },
});
