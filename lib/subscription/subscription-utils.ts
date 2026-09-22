import { Subscription, SubscriptionStatus, SubscriptionPlan } from '@/types';

export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  return subscription.status === 'active' && !isSubscriptionExpired(subscription);
}

export function isSubscriptionExpired(subscription: Subscription | null): boolean {
  if (!subscription) return true;
  return new Date() > subscription.currentPeriodEnd;
}

export function isSubscriptionCancelled(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  return subscription.status === 'cancelled' || subscription.cancelAtPeriodEnd === true;
}

export function isSubscriptionWithinCurrentPeriod(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  const now = new Date();
  return now >= subscription.currentPeriodStart && now <= subscription.currentPeriodEnd;
}

export function getSubscriptionDisplayStatus(subscription: Subscription | null): string {
  if (!subscription) return 'No subscription';
  
  if (subscription.cancelAtPeriodEnd) {
    return 'Cancelled';
  }
  
  if (isSubscriptionExpired(subscription)) {
    return 'Expired';
  }
  
  if (subscription.status === 'active') {
    return 'Active';
  }
  
  return subscription.status;
}

export function getStatusBadgeVariant(status: SubscriptionStatus | 'no-subscription'): 'success' | 'warning' | 'error' | 'default' {
  switch (status) {
    case 'active':
      return 'success';
    case 'cancelled':
    case 'past_due':
      return 'warning';
    case 'expired':
    case 'no-subscription':
      return 'error';
    default:
      return 'default';
  }
}

export function formatSubscriptionPeriod(subscription: Subscription): string {
  const start = subscription.currentPeriodStart.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  const end = subscription.currentPeriodEnd.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  return `${start} - ${end}`;
}

export function daysUntilExpiration(subscription: Subscription | null): number {
  if (!subscription) return 0;
  
  const now = new Date();
  const end = subscription.currentPeriodEnd;
  const diff = end.getTime() - now.getTime();
  
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function canReactivateSubscription(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  return subscription.cancelAtPeriodEnd === true && !isSubscriptionExpired(subscription);
}

export function canCancelSubscription(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  return subscription.status === 'active' && !subscription.cancelAtPeriodEnd;
}

export function canChangePlan(subscription: Subscription | null): boolean {
  return isSubscriptionActive(subscription) || !subscription;
}