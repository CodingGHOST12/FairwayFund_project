import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/draw/prize-pool';

export function AdminOverview() {
  // Use real local data
  const stats = [
    { label: 'Total Users', value: '2', change: 'System users', color: 'blue' },
    { label: 'Active Subscribers', value: '0', change: 'No subscriptions yet', color: 'green' },
    { label: 'Pending Verification', value: '0', change: 'None pending', color: 'amber' },
    { label: 'Pending Payouts', value: '0', change: 'None pending', color: 'purple' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
          <p className="text-gray-600">Manage FairwayFund operations and monitor system health</p>
        </div>
        <div className="hidden sm:block">
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <Badge variant={stat.color as any}>{stat.change}</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="/admin/draws" className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-3 group-hover:bg-teal-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Manage Draws</h3>
            <p className="text-sm text-gray-600">Execute, publish, and view draw results</p>
          </a>

          <a href="/admin/winners" className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Review Winners</h3>
            <p className="text-sm text-gray-600">Approve proofs and process payouts</p>
          </a>

          <a href="/admin/users" className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
            <p className="text-sm text-gray-600">View user accounts and activity</p>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          <div className="p-8 text-center text-gray-500">
            <p>No activity yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
