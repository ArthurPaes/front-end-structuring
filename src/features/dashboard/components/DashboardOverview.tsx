/**
 * @file Dashboard overview component — feature-owned page content.
 *
 * Displays a welcome banner, stat cards, and a recent activity feed.
 */
import { useAuthStore } from '@/features/auth';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
}

function StatCard({ label, value, change, positive, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
      <div className="text-3xl" aria-hidden="true">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className={`text-xs mt-1 font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {positive ? '▲' : '▼'} {change} vs last month
        </p>
      </div>
    </div>
  );
}

const STATS: StatCardProps[] = [
  { label: 'Total Users', value: '4,821', change: '12%', positive: true, icon: '👥' },
  { label: 'Monthly Revenue', value: '$38,200', change: '8.3%', positive: true, icon: '💰' },
  { label: 'Active Sessions', value: '1,024', change: '2%', positive: false, icon: '⚡' },
  { label: 'Tickets Resolved', value: '318', change: '19%', positive: true, icon: '✅' },
];

const ACTIVITY = [
  { id: 1, user: 'Alice Johnson', action: 'created a new report', time: '2m ago', avatar: 'AJ' },
  { id: 2, user: 'Bob Martinez', action: 'updated account settings', time: '15m ago', avatar: 'BM' },
  { id: 3, user: 'Carol White', action: 'submitted a support ticket', time: '1h ago', avatar: 'CW' },
  { id: 4, user: 'David Kim', action: 'exported user data (CSV)', time: '3h ago', avatar: 'DK' },
  { id: 5, user: 'Eva Chen', action: 'invited 3 team members', time: '5h ago', avatar: 'EC' },
];

export function DashboardOverview() {
  const user = useAuthStore((s) => s.user);

  return (
    <section aria-label="Dashboard overview" className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">
          Good to see you{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
        </h2>
        <p className="text-indigo-200 mt-1 text-sm">
          Here&apos;s what&apos;s happening across your platform today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <ul className="divide-y divide-gray-50">
          {ACTIVITY.map((item) => (
            <li key={item.id} className="px-6 py-4 flex items-center gap-4">
              <div
                className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0"
                aria-hidden="true"
              >
                {item.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{item.user}</span> {item.action}
                </p>
              </div>
              <time className="text-xs text-gray-400 shrink-0">{item.time}</time>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
