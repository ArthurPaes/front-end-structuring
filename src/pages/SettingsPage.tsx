/**
 * @file Settings page — protected by RequireRole(['admin', 'editor']).
 */
import { useTheme } from '@/context/ThemeContext';
import { useAuthStore } from '@/features/auth';

const THEME_OPTIONS = [
  { value: 'light' as const, label: 'Light', icon: '☀️' },
  { value: 'dark' as const, label: 'Dark', icon: '🌙' },
  { value: 'system' as const, label: 'System', icon: '💻' },
];

const ROLE_BADGE: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  editor: 'bg-amber-100 text-amber-700',
  viewer: 'bg-sky-100 text-sky-700',
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-6 max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your profile and preferences</p>
      </div>

      {/* ── Profile card ──────────────────────────────────── */}
      <section aria-labelledby="profile-heading" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 id="profile-heading" className="font-semibold text-gray-900">Profile</h3>

        <div className="flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold shrink-0">
            {user?.name ? user.name.slice(0, 1).toUpperCase() : '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name ?? '—'}</p>
            <p className="text-sm text-gray-500">{user?.email ?? '—'}</p>
          </div>
          {user?.role && (
            <span
              className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full capitalize ${ROLE_BADGE[user.role] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {user.role}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
            <input
              type="text"
              defaultValue={user?.name ?? ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              defaultValue={user?.email ?? ''}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email changes require re-verification.</p>
          </div>
        </div>

        <button className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          Save changes
        </button>
      </section>

      {/* ── Appearance card ───────────────────────────────── */}
      <section aria-labelledby="appearance-heading" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 id="appearance-heading" className="font-semibold text-gray-900">Appearance</h3>
        <p className="text-sm text-gray-500">Choose your preferred colour scheme.</p>

        <div className="flex gap-3">
          {THEME_OPTIONS.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 text-sm font-medium transition-colors ${
                theme === value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
              aria-pressed={theme === value}
            >
              <span className="text-2xl" aria-hidden="true">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Danger zone ───────────────────────────────────── */}
      <section aria-labelledby="danger-heading" className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 space-y-4">
        <h3 id="danger-heading" className="font-semibold text-red-700">Danger zone</h3>
        <p className="text-sm text-gray-500">Irreversible actions — proceed with caution.</p>
        <button className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
          Delete my account
        </button>
      </section>
    </div>
  );
}
