import { Badge } from '../ui/Badge';
import { formatDate } from '@/lib/utils/date';

type SubscriptionTableProps = {
  subscriptions: Array<{
    id: string;
    userName: string;
    plan: 'monthly' | 'yearly';
    status: 'active' | 'cancelled' | 'expired';
    currentPeriodEnd: Date;
  }>;
};

export function SubscriptionTable({ subscriptions }: SubscriptionTableProps) {
  const statusColors = {
    active: 'success' as const,
    cancelled: 'warning' as const,
    expired: 'error' as const,
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Renewal Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subscriptions.map((sub) => (
            <tr key={sub.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {sub.userName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={statusColors[sub.status]}>
                  {sub.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(sub.currentPeriodEnd)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
