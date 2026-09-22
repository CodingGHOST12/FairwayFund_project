import { describe, it, expect } from 'vitest';
import {
  hasActiveSubscription,
  hasRequiredScores,
  isEligibleForDraw,
} from '@/lib/draw/draw-eligibility';
import { Subscription } from '@/types';
import type { GolfScore } from '@/types/score';

describe('Draw Eligibility', () => {
  const activeSubscription: Subscription = {
    id: 'sub-1',
    userId: 'user-1',
    plan: 'monthly',
    status: 'active',
    currentPeriodStart: new Date('2026-09-01'),
    currentPeriodEnd: new Date('2026-10-01'),
    cancelAtPeriodEnd: false,
    createdAt: new Date('2026-09-01'),
    updatedAt: new Date('2026-09-01'),
  };

  const expiredSubscription: Subscription = {
    ...activeSubscription,
    status: 'expired',
    currentPeriodEnd: new Date('2026-08-01'),
  };

  const cancelledSubscription: Subscription = {
    ...activeSubscription,
    cancelAtPeriodEnd: true,
  };

  const mockScores: GolfScore[] = [
    {
      id: 'score-1',
      userId: 'user-1',
      date: new Date('2026-09-20'),
      stablefordScore: 38,
      createdAt: new Date('2026-09-20'),
    },
    {
      id: 'score-2',
      userId: 'user-1',
      date: new Date('2026-09-15'),
      stablefordScore: 35,
      createdAt: new Date('2026-09-15'),
    },
  ];

  describe('hasActiveSubscription', () => {
    it('returns true for active subscription', () => {
      expect(hasActiveSubscription(activeSubscription)).toBe(true);
    });

    it('returns false for expired subscription', () => {
      expect(hasActiveSubscription(expiredSubscription)).toBe(false);
    });

    it('returns false for cancelled subscription', () => {
      expect(hasActiveSubscription(cancelledSubscription)).toBe(false);
    });

    it('returns false for null subscription', () => {
      expect(hasActiveSubscription(null)).toBe(false);
    });
  });

  describe('hasRequiredScores', () => {
    it('returns true when user has at least 1 score', () => {
      expect(hasRequiredScores(mockScores)).toBe(true);
      expect(hasRequiredScores([mockScores[0]])).toBe(true);
    });

    it('returns false when user has no scores', () => {
      expect(hasRequiredScores([])).toBe(false);
    });
  });

  describe('isEligibleForDraw', () => {
    it('returns eligible when subscription is active and scores exist', () => {
      const eligibility = isEligibleForDraw(activeSubscription, mockScores);
      
      expect(eligibility.hasActiveSubscription).toBe(true);
      expect(eligibility.hasRequiredScores).toBe(true);
      expect(eligibility.isEligible).toBe(true);
      expect(eligibility.scoreCount).toBe(2);
      expect(eligibility.reason).toBeUndefined();
    });

    it('returns not eligible when subscription is inactive', () => {
      const eligibility = isEligibleForDraw(expiredSubscription, mockScores);
      
      expect(eligibility.hasActiveSubscription).toBe(false);
      expect(eligibility.isEligible).toBe(false);
      expect(eligibility.reason).toBe('Active subscription required');
    });

    it('returns not eligible when no scores available', () => {
      const eligibility = isEligibleForDraw(activeSubscription, []);
      
      expect(eligibility.hasRequiredScores).toBe(false);
      expect(eligibility.isEligible).toBe(false);
      expect(eligibility.reason).toContain('golf score required');
    });

    it('returns not eligible when subscription is null', () => {
      const eligibility = isEligibleForDraw(null, mockScores);
      
      expect(eligibility.hasActiveSubscription).toBe(false);
      expect(eligibility.isEligible).toBe(false);
    });

    it('returns not eligible when both subscription and scores are missing', () => {
      const eligibility = isEligibleForDraw(null, []);
      
      expect(eligibility.hasActiveSubscription).toBe(false);
      expect(eligibility.hasRequiredScores).toBe(false);
      expect(eligibility.isEligible).toBe(false);
    });
  });
});
