import { describe, it, expect } from 'vitest';
import { subscriptionSelectionSchema, subscriptionChangePlanSchema } from '@/lib/validation/subscription.validation';
import {
  isSubscriptionActive,
  isSubscriptionExpired,
  isSubscriptionCancelled,
  isSubscriptionWithinCurrentPeriod,
  daysUntilExpiration,
  canCancelSubscription,
  canReactivateSubscription,
} from '@/lib/subscription/subscription-utils';
import { canParticipateInDraw, getSubscriptionAccessLevel } from '@/lib/subscription/subscription-access';
import { Subscription } from '@/types';

describe('Subscription System', () => {
  describe('Validation', () => {
    it('accepts valid monthly plan', () => {
      const result = subscriptionSelectionSchema.safeParse({ plan: 'monthly' });
      expect(result.success).toBe(true);
    });

    it('accepts valid yearly plan', () => {
      const result = subscriptionSelectionSchema.safeParse({ plan: 'yearly' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid plan', () => {
      const result = subscriptionSelectionSchema.safeParse({ plan: 'weekly' });
      expect(result.success).toBe(false);
    });

    it('validates change plan data', () => {
      const result = subscriptionChangePlanSchema.safeParse({ newPlan: 'yearly' });
      expect(result.success).toBe(true);
    });
  });

  describe('Utilities', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);

    const activeSub: Subscription = {
      id: 'sub-1',
      userId: 'user-1',
      plan: 'monthly',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: futureDate,
      cancelAtPeriodEnd: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const expiredSub: Subscription = {
      ...activeSub,
      currentPeriodEnd: pastDate,
      status: 'expired',
    };

    const cancelledSub: Subscription = {
      ...activeSub,
      cancelAtPeriodEnd: true,
    };

    it('detects active subscription', () => {
      expect(isSubscriptionActive(activeSub)).toBe(true);
      expect(isSubscriptionActive(expiredSub)).toBe(false);
      expect(isSubscriptionActive(null)).toBe(false);
    });

    it('detects expired subscription', () => {
      expect(isSubscriptionExpired(expiredSub)).toBe(true);
      expect(isSubscriptionExpired(activeSub)).toBe(false);
      expect(isSubscriptionExpired(null)).toBe(true);
    });

    it('detects cancelled subscription', () => {
      expect(isSubscriptionCancelled(cancelledSub)).toBe(true);
      expect(isSubscriptionCancelled(activeSub)).toBe(false);
    });

    it('calculates days until expiration', () => {
      expect(daysUntilExpiration(activeSub)).toBeGreaterThan(0);
      expect(daysUntilExpiration(expiredSub)).toBeLessThanOrEqual(0);
    });

    it('determines cancellation capability', () => {
      expect(canCancelSubscription(activeSub)).toBe(true);
      expect(canCancelSubscription(cancelledSub)).toBe(false);
    });

    it('determines reactivation capability', () => {
      expect(canReactivateSubscription(cancelledSub)).toBe(true);
      expect(canReactivateSubscription(activeSub)).toBe(false);
      expect(canReactivateSubscription(expiredSub)).toBe(false);
    });
  });

  describe('Access Control', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const activeSub: Subscription = {
      id: 'sub-1',
      userId: 'user-1',
      plan: 'monthly',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: futureDate,
      cancelAtPeriodEnd: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('allows active subscriber to participate in draw', () => {
      expect(canParticipateInDraw(activeSub)).toBe(true);
    });

    it('denies draw participation for null subscription', () => {
      expect(canParticipateInDraw(null)).toBe(false);
    });

    it('denies draw participation for cancelled subscription', () => {
      const cancelled = { ...activeSub, cancelAtPeriodEnd: true };
      expect(canParticipateInDraw(cancelled)).toBe(false);
    });

    it('returns correct access level', () => {
      expect(getSubscriptionAccessLevel(activeSub)).toBe('full');
      expect(getSubscriptionAccessLevel(null)).toBe('none');
    });
  });
});