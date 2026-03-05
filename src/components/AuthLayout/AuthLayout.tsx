/**
 * @file AuthLayout template — shared layout for login, register, forgot-password.
 *
 * ATOMIC DESIGN: Templates define page structure/layout without specific data.
 * They use <Outlet /> from React Router for nested child routes.
 */
import { Outlet } from 'react-router-dom';
import { env } from '@/config';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      {/* Brand header */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg mb-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-white"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">{env.APP_NAME}</p>
        <p className="text-slate-400 text-sm mt-1">Production-grade React scaffold</p>
      </header>

      {/* Card */}
      <main className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-white/10 p-8">
        <Outlet />
      </main>

      <footer className="mt-8 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {env.APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
}
