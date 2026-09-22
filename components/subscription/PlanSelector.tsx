'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlanCard } from './PlanCard';
import { subscriptionConfig } from '@/lib/subscription/subscription-config';
import { SubscriptionPlan } from '@/types';

type PlanSelectorProps = {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  selectedPlan?: SubscriptionPlan;
  disabled?: boolean;
};

export function PlanSelector({ onSelectPlan, selectedPlan, disabled }: PlanSelectorProps) {
  const [loading, setLoading] = useState(false);

  const handleSelect = async (plan: SubscriptionPlan) => {
    if (disabled) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onSelectPlan(plan);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {subscriptionConfig.plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedPlan === plan.id}
          onSelect={disabled ? undefined : handleSelect}
        />
      ))}
      
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}