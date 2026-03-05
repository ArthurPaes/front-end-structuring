/**
 * @file 404 page — catch-all for unknown routes.
 */
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-center px-4">
      {/* Animated number */}
      <p className="text-[160px] font-black text-white/5 leading-none select-none" aria-hidden="true">
        404
      </p>

      <div className="-mt-16 space-y-4">
        <h1 className="text-4xl font-bold text-white">Page not found</h1>
        <p className="text-slate-400 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            ← Go back
          </button>
          <Link
            to={ROUTES.HOME}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Take me home
          </Link>
        </div>
      </div>
    </div>
  );
}
