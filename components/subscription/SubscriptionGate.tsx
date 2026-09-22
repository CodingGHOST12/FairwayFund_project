'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/Button';

type SubscriptionGateProps = {
  children: ReactNode;
  fallback?: ReactNode;
  featureName?: string;
};

export function SubscriptionGate({
  children,
  fallback,
  featureName = 'this feature',
}: SubscriptionGateProps) {
  const { isActive, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (isActive) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center max-w-md mx-auto">
      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription Required</h3>
      <p className="text-gray-600 text-sm mb-6">
        You need an active subscription to access {featureName}. Choose a plan to continue.
      </p>
      <Link href="/pricing">
        <Button>View Subscription Plans</Button>
      </Link>
    </div>
  );
}