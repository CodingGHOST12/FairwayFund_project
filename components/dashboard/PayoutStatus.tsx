import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '@/lib/utils/formatting';
import { formatDate } from '@/lib/utils/date';

type PayoutStatusProps = {
  payouts: Array<{
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    scheduledAt?: Date;
    completedAt?: Date;
  }>;
};

export function PayoutStatus({ payouts }: PayoutStatusProps) {
  const statusColors = {
    pending: 'warning' as const,
    processing: 'info' as const,
    completed: 'success' as const,
    failed: 'error' as const,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Status</CardTitle>
      </CardHeader>
      <CardContent>
        {payouts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No payouts scheduled</p>
        ) : (
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div key={payout.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(payout.amount)}
                    </p>
                    {payout.scheduledAt && (
                      <p className="text-sm text-gray-500">
                        Scheduled: {formatDate(payout.scheduledAt)}
                      </p>
                    )}
                    {payout.completedAt && (
                      <p className="text-sm text-gray-500">
                        Completed: {formatDate(payout.completedAt)}
                      </p>
                    )}
                  </div>
                  <Badge variant={statusColors[payout.status]}>
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
