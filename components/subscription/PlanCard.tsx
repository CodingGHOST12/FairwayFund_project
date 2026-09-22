'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { subscriptionConfig } from '@/lib/subscription/subscription-config';
import { SubscriptionPlan } from '@/types';

type PlanCardProps = {
  plan: typeof subscriptionConfig.plans[0];
  isSelected?: boolean;
  onSelect?: (plan: SubscriptionPlan) => void;
};

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(plan.id);
    }
  };

  return (
    <div 
      className={`relative transition-all cursor-pointer bg-white rounded-lg border p-6 ${
        isSelected ? 'border-2 border-green-600 shadow-md' : 'border-gray-200 hover:shadow-md'
      }`}
      onClick={handleClick}
    >
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="success">Best Value</Badge>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
          <span className="text-gray-600">/{plan.billingInterval === 'month' ? 'month' : 'year'}</span>
        </div>

        <ul className="space-y-3 mb-6 text-left">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {onSelect && (
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            className="w-full"
            onClick={handleClick}
          >
            {isSelected ? 'Selected' : 'Select Plan'}
          </Button>
        )}
      </div>
    </div>
  );
}