import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Subscription } from '@/types';
import { formatSubscriptionPeriod, isSubscriptionActive, isSubscriptionCancelled } from '@/lib/subscription/subscription-utils';
import { subscriptionConfig } from '@/lib/subscription/subscription-config';

type SubscriptionSummaryProps = {
  subscription: Subscription | null;
};

export function SubscriptionSummary({ subscription }: SubscriptionSummaryProps) {
  if (!subscription) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500 mb-4">No active subscription</p>
          <p className="text-sm text-gray-400">Subscribe to access FairwayFund features</p>
        </CardContent>
      </Card>
    );
  }

  const plan = subscriptionConfig.getPlan(subscription.plan);
  const isActive = isSubscriptionActive(subscription);
  const isCancelled = isSubscriptionCancelled(subscription);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Subscription</CardTitle>
          <Badge variant={isActive ? 'success' : isCancelled ? 'warning' : 'error'}>
            {isActive ? 'Active' : isCancelled ? 'Cancelled' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Plan</span>
            <span className="font-semibold">{plan?.name}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Price</span>
            <span className="font-semibold">£{plan?.price}/{subscription.plan === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Current Period</span>
            <span className="font-semibold text-sm">{formatSubscriptionPeriod(subscription)}</span>
          </div>
          
          {subscription.cancelAtPeriodEnd && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                Your subscription is scheduled to end at the end of the current billing period.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}