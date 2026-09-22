'use client';

import { Subscription } from '@/types';
import { canCancelSubscription, canReactivateSubscription } from '@/lib/subscription/subscription-utils';

type CancellationNoticeProps = {
  subscription: Subscription | null;
  onReactivate?: () => void;
  loading?: boolean;
};

export function CancellationNotice({ subscription, onReactivate, loading }: CancellationNoticeProps) {
  if (!subscription || !subscription.cancelAtPeriodEnd) return null;

  const canReactivate = canReactivateSubscription(subscription);

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-amber-900 mb-1">Subscription Cancelled</h4>
          <p className="text-sm text-amber-700">
            Your subscription will remain active until{' '}
            <strong>
              {subscription.currentPeriodEnd.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </strong>
          </p>
        </div>
        
        {canReactivate && onReactivate && (
          <button
            onClick={onReactivate}
            disabled={loading}
            className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Reactivating...' : 'Reactivate'}
          </button>
        )}
      </div>
    </div>
  );
}