/**
 * @file DashboardLayout template — shared chrome for authenticated pages.
 *
 * Includes sidebar, header, and <Outlet /> for nested page content.
 */
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth' 
import { useUiStore } from '@/store';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Overview', icon: '🏠' },
  { to: ROUTES.DASHBOARD_SETTINGS, label: 'Settings', icon: '⚙️' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.LOGIN);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside
        className={cn(
          'bg-slate-900 flex flex-col transition-all duration-200 shrink-0',
          sidebarCollapsed ? 'w-16' : 'w-60',
        )}
      >
        {/* Brand */}
        <div className="h-14 flex items-center gap-3 px-4 border-b border-white/10">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          {!sidebarCollapsed && (
            <span className="text-white font-semibold text-sm truncate">App</span>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1" aria-label="Sidebar navigation">
          {NAV_ITEMS.map(({ to, label, icon }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white',
                )}
                title={sidebarCollapsed ? label : undefined}
              >
                <span className="text-base shrink-0" aria-hidden="true">{icon}</span>
                {!sidebarCollapsed && label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center h-12 border-t border-white/10 text-slate-400 hover:text-white transition-colors text-xs"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? '→' : '← Collapse'}
        </button>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
              {user?.name ? user.name.slice(0, 1).toUpperCase() : '?'}
            </div>
            <span className="text-sm text-gray-700 font-medium">{user?.name ?? 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Sign out
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
