'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionSummary } from '@/components/subscription/SubscriptionSummary';
import { SubscriptionActions } from '@/components/subscription/SubscriptionActions';
import { CancellationNotice } from '@/components/subscription/CancellationNotice';
import { SubscriptionForm } from '@/components/forms/SubscriptionForm';
import { Loading } from '@/components/ui/Loading';
import { SubscriptionPlan } from '@/types';
import { isTestMode } from '@/lib/payment/payment-provider';

export function SubscriptionContent() {
  const {
    subscription,
    isLoading,
    createSubscription,
    changePlan,
    cancelSubscription,
    reactivateSubscription,
  } = useSubscription();

  if (isLoading) {
    return <Loading text="Loading subscription details..." />;
  }

  const handleChangePlan = async (newPlan: SubscriptionPlan) => {
    await changePlan(newPlan);
  };

  const handleCancel = async () => {
    await cancelSubscription();
  };

  const handleReactivate = async () => {
    await reactivateSubscription();
  };

  const handleCreate = async (plan: SubscriptionPlan) => {
    await createSubscription(plan);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
        <p className="text-gray-600">View and manage your FairwayFund subscription.</p>
      </div>

      <CancellationNotice
        subscription={subscription}
        onReactivate={handleReactivate}
        loading={isLoading}
      />

      {subscription ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SubscriptionSummary subscription={subscription} />
          </div>
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <SubscriptionActions
                subscription={subscription}
                onChangePlan={handleChangePlan}
                onCancel={handleCancel}
                onReactivate={handleReactivate}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center max-w-lg mx-auto mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Plan</h2>
            <p className="text-gray-600">Select a subscription plan to start playing and supporting charities.</p>
          </div>
          <SubscriptionForm onSubmit={handleCreate} loading={isLoading} />
        </div>
      )}

      {isTestMode() && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <p className="font-semibold mb-1">🧪 Test Payment Mode</p>
          <p>Development mode active. No real payment gateway is connected. Use test checkout to simulate payments.</p>
        </div>
      )}
    </div>
  );
}