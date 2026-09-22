import { Card } from '../ui/Card';

export function AnalyticsOverview() {
  const stats = [
    { label: 'Total Users', value: '2', change: 'System users' },
    { label: 'Active Subscriptions', value: '0', change: 'No subscriptions yet' },
    { label: 'Total Prize Pool', value: '₹0', change: 'No draws yet' },
    { label: 'Charity Contributions', value: '₹0', change: 'No contributions yet' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
