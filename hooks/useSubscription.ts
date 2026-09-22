'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { subscriptionService } from '@/lib/services/subscription.service';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '@/types';
import { isSubscriptionActive, isSubscriptionExpired, isSubscriptionCancelled } from '@/lib/subscription/subscription-utils';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const sub = await subscriptionService.getSubscription(user.id);
      setSubscription(sub);
    } catch (err) {
      setError('Failed to load subscription');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const createSubscription = async (plan: SubscriptionPlan) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const newSub = await subscriptionService.createSubscription(user.id, plan);
      setSubscription(newSub);
      return newSub;
    } finally {
      setIsLoading(false);
    }
  };

  const changePlan = async (newPlan: SubscriptionPlan) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const updated = await subscriptionService.changePlan(user.id, newPlan);
      setSubscription(updated);
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const updated = await subscriptionService.cancelSubscription(user.id);
      setSubscription(updated);
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  const reactivateSubscription = async () => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const updated = await subscriptionService.reactivateSubscription(user.id);
      setSubscription(updated);
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = isSubscriptionActive(subscription);
  const isExpired = isSubscriptionExpired(subscription);
  const isCancelled = isSubscriptionCancelled(subscription);
  const status: SubscriptionStatus | 'none' = subscription ? subscription.status : 'none';

  return {
    subscription,
    isLoading,
    error,
    isActive,
    isExpired,
    isCancelled,
    status,
    createSubscription,
    changePlan,
    cancelSubscription,
    reactivateSubscription,
    refreshSubscription: fetchSubscription,
  };
}