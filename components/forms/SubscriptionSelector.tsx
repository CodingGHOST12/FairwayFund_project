'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SubscriptionPlan } from '@/types';

type SubscriptionSelectorProps = {
  onSelectPlan: (plan: SubscriptionPlan) => void;
};

export function SubscriptionSelector({ onSelectPlan }: SubscriptionSelectorProps) {
  const [loading, setLoading] = useState<SubscriptionPlan | null>(null);

  const handleSelect = async (plan: SubscriptionPlan) => {
    setLoading(plan);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSelectPlan(plan);
    setLoading(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <Card>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-green-600">£10</span>
            <span className="text-gray-600">/month</span>
          </div>
          <ul className="space-y-3 mb-6 text-left">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Monthly draw entry
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Support your charity
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Cancel anytime
            </li>
          </ul>
          <Button
            onClick={() => handleSelect('monthly')}
            loading={loading === 'monthly'}
            className="w-full"
          >
            Choose Monthly
          </Button>
        </div>
      </Card>

      <Card className="border-2 border-green-600">
        <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
          Best Value
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Yearly</h3>
          <div className="mb-2">
            <span className="text-4xl font-bold text-green-600">£100</span>
            <span className="text-gray-600">/year</span>
          </div>
          <p className="text-sm text-green-600 font-medium mb-6">Save £20 per year</p>
          <ul className="space-y-3 mb-6 text-left">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              12 months of draws
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Support your charity
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Best value
            </li>
          </ul>
          <Button
            onClick={() => handleSelect('yearly')}
            loading={loading === 'yearly'}
            className="w-full"
          >
            Choose Yearly
          </Button>
        </div>
      </Card>
    </div>
  );
}
