/**
 * @file DashboardOverviewV2 — the redesigned dashboard behind the 'new-dashboard' feature flag.
 *
 * This component is only rendered when isFeatureEnabled('new-dashboard') returns true.
 * Toggle the flag in your PostHog dashboard (or LOCAL_FLAGS in featureFlags.ts)
 * to switch between this and DashboardOverview at runtime — no redeploy needed.
 */
import { useAuthStore } from '@/features/auth';

interface MetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly positive: boolean;
  readonly icon: string;
}

function MetricCard({ label, value, change, positive, icon }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {change}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

const METRICS: MetricCardProps[] = [
  { label: 'Total Revenue',     value: '$48,295', change: '+12.5%', positive: true,  icon: '💰' },
  { label: 'Active Users',      value: '3,842',   change: '+8.1%',  positive: true,  icon: '👥' },
  { label: 'Churn Rate',        value: '2.4%',    change: '-0.3%',  positive: true,  icon: '📉' },
  { label: 'Support Tickets',   value: '17',      change: '+5',     positive: false, icon: '🎫' },
];

const RECENT: { user: string; action: string; time: string; avatar: string }[] = [
  { user: 'Alice Johnson',  action: 'Upgraded to Pro plan',    time: '2m ago',  avatar: 'A' },
  { user: 'Bob Martinez',   action: 'Submitted a bug report',  time: '14m ago', avatar: 'B' },
  { user: 'Carol Lee',      action: 'Exported monthly report', time: '1h ago',  avatar: 'C' },
  { user: 'David Kim',      action: 'Invited 3 team members',  time: '3h ago',  avatar: 'D' },
];

export function DashboardOverviewV2() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-8">
      {/* ── Header banner ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          {/* NEW DASHBOARD badge — makes it obvious which version is active */}
          <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full uppercase tracking-widest">
            ✨ New Dashboard
          </span>
          <h1 className="text-2xl font-bold mt-2">Good to see you, {firstName}!</h1>
          <p className="text-violet-200 text-sm mt-1">
            Here's what's happening across your workspace today.
          </p>
        </div>
        <div className="text-6xl opacity-30">🚀</div>
      </div>

      {/* ── Metric cards ──────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Key Metrics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </div>

      {/* ── Recent activity ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Activity</h2>
        </div>
        <ul>
          {RECENT.map(({ user: name, action, time, avatar }) => (
            <li
              key={name}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold shrink-0">
                {avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-xs text-gray-500 truncate">{action}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
