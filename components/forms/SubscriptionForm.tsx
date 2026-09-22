'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlanSelector } from '@/components/subscription/PlanSelector';
import { TestCheckout } from '@/components/payment/TestCheckout';
import { Button } from '@/components/ui/Button';
import { SubscriptionPlan } from '@/types';
import { subscriptionConfig } from '@/lib/subscription/subscription-config';
import { getPaymentProvider, isTestMode } from '@/lib/payment/payment-provider';

type SubscriptionFormProps = {
  onSubmit: (plan: SubscriptionPlan) => Promise<void>;
  loading?: boolean;
};

export function SubscriptionForm({ onSubmit, loading }: SubscriptionFormProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleOpenCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const provider = getPaymentProvider();
      const { checkoutId: id } = await provider.initializeCheckout('temp-user-id', selectedPlan);
      setCheckoutId(id);
      setShowCheckout(true);
    } catch (error) {
      console.error('Checkout initialization error:', error);
      setError('Failed to open checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setError(null);
    
    try {
      await onSubmit(selectedPlan);
      setShowCheckout(false);
      router.push('/subscription/success');
    } catch (error) {
      console.error('Subscription creation error:', error);
      setError('Failed to activate subscription');
    }
  };

  const handlePaymentFailure = async () => {
    setError('Test payment failed. Your subscription was not activated.');
  };

  const handleCancel = () => {
    setShowCheckout(false);
    setCheckoutId(null);
    setError(null);
  };

  const plan = subscriptionConfig.getPlan(selectedPlan);

  if (showCheckout && isTestMode()) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
            {error}
          </div>
        )}
        <TestCheckout
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleOpenCheckout} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm text-center">
          {error}
        </div>
      )}
      
      <PlanSelector
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
        disabled={loading || isSubmitting}
      />

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto text-center">
        <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">{plan?.name} Plan</span>
          <span className="font-bold text-gray-900">₹{plan?.price}/{plan?.billingInterval}</span>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          Minimum 10% (₹{subscriptionConfig.calculateCharityContribution(selectedPlan)}) goes directly to your chosen charity.
        </p>
        <Button
          type="submit"
          className="w-full"
          loading={loading || isSubmitting}
        >
          {isTestMode() ? 'Open Test Checkout' : 'Continue to Payment'}
        </Button>
      </div>
    </form>
  );
}