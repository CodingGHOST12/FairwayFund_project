import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

type SubscriptionCardProps = {
  plan: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
};

export function SubscriptionCard({ 
  plan, 
  status, 
  currentPeriodEnd, 
  cancelAtPeriodEnd 
}: SubscriptionCardProps) {
  const statusColors = {
    active: 'success' as const,
    cancelled: 'warning' as const,
    expired: 'error' as const,
    past_due: 'error' as const,
  };

  const planLabels = {
    monthly: 'Monthly - £10/month',
    yearly: 'Yearly - £100/year',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Subscription</CardTitle>
          <Badge variant={statusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Plan</p>
            <p className="text-lg font-semibold">{planLabels[plan]}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Renewal Date</p>
            <p className="text-lg font-semibold">
              {currentPeriodEnd.toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
          {cancelAtPeriodEnd && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
              Your subscription will cancel at the end of the current period.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
