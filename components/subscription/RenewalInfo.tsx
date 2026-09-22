import { Subscription } from '@/types';
import { daysUntilExpiration } from '@/lib/subscription/subscription-utils';

type RenewalInfoProps = {
  subscription: Subscription | null;
};

export function RenewalInfo({ subscription }: RenewalInfoProps) {
  if (!subscription) return null;

  const daysLeft = daysUntilExpiration(subscription);
  
  if (subscription.cancelAtPeriodEnd) {
    return (
      <div className="text-sm">
        <p className="text-gray-600 mb-1">Access until</p>
        <p className="font-medium text-gray-900">
          {subscription.currentPeriodEnd.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p className="text-amber-600 text-xs mt-1">
          Subscription ends after this date
        </p>
      </div>
    );
  }

  return (
    <div className="text-sm">
      <p className="text-gray-600 mb-1">Next renewal</p>
      <p className="font-medium text-gray-900">
        {subscription.currentPeriodEnd.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      {daysLeft > 0 && daysLeft <= 7 && (
        <p className="text-amber-600 text-xs mt-1">
          {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
        </p>
      )}
    </div>
  );
}