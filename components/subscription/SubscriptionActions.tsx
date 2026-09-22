'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Subscription, SubscriptionPlan } from '@/types';
import { canCancelSubscription, canReactivateSubscription, isSubscriptionActive } from '@/lib/subscription/subscription-utils';

type SubscriptionActionsProps = {
  subscription: Subscription | null;
  onChangePlan?: (newPlan: SubscriptionPlan) => Promise<void>;
  onCancel?: () => Promise<void>;
  onReactivate?: () => Promise<void>;
};

export function SubscriptionActions({
  subscription,
  onChangePlan,
  onCancel,
  onReactivate,
}: SubscriptionActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const handleAction = async (actionName: string, action: () => Promise<void>) => {
    setLoading(actionName);
    try {
      await action();
    } finally {
      setLoading(null);
    }
  };

  if (!subscription) {
    return (
      <Link href="/pricing">
        <Button className="w-full">Choose a Plan</Button>
      </Link>
    );
  }

  const isActive = isSubscriptionActive(subscription);
  const canCancel = canCancelSubscription(subscription);
  const canReactivate = canReactivateSubscription(subscription);

  return (
    <div className="space-y-3">
      {isActive && !subscription.cancelAtPeriodEnd && (
        <>
          {onChangePlan && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={loading !== null}
                onClick={() => handleAction('change-plan', () => 
                  onChangePlan(subscription.plan === 'monthly' ? 'yearly' : 'monthly')
                )}
              >
                Switch to {subscription.plan === 'monthly' ? 'Yearly' : 'Monthly'}
              </Button>
            </div>
          )}

          {canCancel && onCancel && !showConfirmCancel && (
            <Button
              variant="destructive"
              className="w-full"
              disabled={loading !== null}
              onClick={() => setShowConfirmCancel(true)}
            >
              Cancel Subscription
            </Button>
          )}

          {showConfirmCancel && onCancel && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
              <p className="text-sm text-red-800">
                Are you sure you want to cancel? You will retain access until the end of your billing period.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={loading !== null}
                  onClick={() => handleAction('cancel', onCancel)}
                >
                  {loading === 'cancel' ? 'Cancelling...' : 'Yes, Cancel'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading !== null}
                  onClick={() => setShowConfirmCancel(false)}
                >
                  Keep Subscription
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {canReactivate && onReactivate && (
        <Button
          className="w-full"
          disabled={loading !== null}
          onClick={() => handleAction('reactivate', onReactivate)}
        >
          {loading === 'reactivate' ? 'Reactivating...' : 'Reactivate Subscription'}
        </Button>
      )}

      {!isActive && !canReactivate && (
        <Link href="/pricing">
          <Button className="w-full">Re-subscribe</Button>
        </Link>
      )}
    </div>
  );
}