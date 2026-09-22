'use client';

import { useState } from 'react';
import { SubscriptionPlan } from '@/types';
import { subscriptionConfig } from '@/lib/subscription/subscription-config';
import { Button } from '@/components/ui/Button';

type TestCheckoutProps = {
  plan: SubscriptionPlan;
  onSuccess: () => Promise<void>;
  onFailure: () => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
};

export function TestCheckout({ plan, onSuccess, onFailure, onCancel, loading }: TestCheckoutProps) {
  const [action, setAction] = useState<'idle' | 'success' | 'failure'>('idle');
  const planConfig = subscriptionConfig.getPlan(plan);

  const handleSuccess = async () => {
    setAction('success');
    try {
      await onSuccess();
    } catch (error) {
      console.error('Payment success handling failed:', error);
      setAction('idle');
    }
  };

  const handleFailure = async () => {
    setAction('failure');
    try {
      await onFailure();
    } catch (error) {
      console.error('Payment failure handling failed:', error);
    } finally {
      setAction('idle');
    }
  };

  if (!planConfig) {
    return (
      <div className="text-center text-red-600">
        <p>Invalid plan selected</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto">
      {/* Header */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">FairwayFund Test Payment</h3>
          <span className="px-2 py-1 bg-amber-600 text-white text-xs font-semibold rounded">
            TEST MODE
          </span>
        </div>
        <p className="text-sm text-amber-800 mt-1">
          No real money will be charged.
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Plan Details */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Selected Plan</span>
            <span className="font-bold text-gray-900">{planConfig.name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Billing</span>
            <span className="font-bold text-gray-900">
              ₹{planConfig.price}/{planConfig.billingInterval}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-300">
            <span className="text-xs text-gray-500">
              Minimum ₹{subscriptionConfig.calculateCharityContribution(plan)} to charity
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleSuccess}
            disabled={loading || action !== 'idle'}
            loading={action === 'success'}
          >
            {action === 'success' ? 'Processing...' : 'Simulate Successful Payment'}
          </Button>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleFailure}
            disabled={loading || action !== 'idle'}
            loading={action === 'failure'}
          >
            {action === 'failure' ? 'Processing...' : 'Simulate Failed Payment'}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={onCancel}
            disabled={loading || action !== 'idle'}
          >
            Cancel
          </Button>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>This is a test payment simulation for development purposes.</p>
          <p>Successful payment will activate your subscription.</p>
          <p>Failed payment will not modify your subscription status.</p>
        </div>
      </div>
    </div>
  );
}
