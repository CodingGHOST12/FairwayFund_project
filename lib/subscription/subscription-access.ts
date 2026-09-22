import { Subscription, SubscriptionPlan } from '@/types';

export function canParticipateInDraw(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  
  return subscription.status === 'active' && 
         !subscription.cancelAtPeriodEnd && 
         new Date() <= subscription.currentPeriodEnd;
}

export function canManageScores(subscription: Subscription | null): boolean {
  return subscription !== null;
}

export function canSelectCharity(subscription: Subscription | null): boolean {
  return subscription !== null;
}

export function canViewSubscriptionFeatures(subscription: Subscription | null): boolean {
  return subscription !== null;
}

export function getSubscriptionAccessLevel(subscription: Subscription | null): 'none' | 'limited' | 'full' {
  if (!subscription) return 'none';
  
  if (subscription.status === 'expired') return 'limited';
  
  if (subscription.cancelAtPeriodEnd && new Date() > subscription.currentPeriodEnd) return 'limited';
  
  if (subscription.status === 'active' && new Date() <= subscription.currentPeriodEnd) {
    return 'full';
  }
  
  return 'limited';
}

export function requiresSubscriptionForFeature(feature: 'draw' | 'scores' | 'charity' | 'winnings'): boolean {
  switch (feature) {
    case 'draw':
      return true;
    case 'scores':
      return true;
    case 'charity':
      return true;
    case 'winnings':
      return true;
    default:
      return false;
  }
}

export function hasAccessToFeature(subscription: Subscription | null, feature: 'draw' | 'scores' | 'charity' | 'winnings'): boolean {
  if (!requiresSubscriptionForFeature(feature)) return true;
  
  const accessLevel = getSubscriptionAccessLevel(subscription);
  
  switch (accessLevel) {
    case 'full':
      return true;
    case 'limited':
      return feature !== 'draw';
    case 'none':
    default:
      return false;
  }
}