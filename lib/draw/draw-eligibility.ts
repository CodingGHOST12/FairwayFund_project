import { DrawEligibility, Subscription } from '@/types';
import type { GolfScore } from '@/types/score';
import { canParticipateInDraw } from '@/lib/subscription/subscription-access';
import { drawConfig } from './draw-config';

export function hasActiveSubscription(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  return canParticipateInDraw(subscription);
}

export function hasRequiredScores(scores: GolfScore[]): boolean {
  return scores.length >= drawConfig.eligibility.minimumScores;
}

export function isEligibleForDraw(
  subscription: Subscription | null,
  scores: GolfScore[]
): DrawEligibility {
  const userId = subscription?.userId || '';
  const hasActiveSub = hasActiveSubscription(subscription);
  const hasScores = hasRequiredScores(scores);
  const scoreCount = scores.length;

  let reason: string | undefined;
  if (!hasActiveSub) {
    reason = 'Active subscription required';
  } else if (!hasScores) {
    reason = `At least ${drawConfig.eligibility.minimumScores} golf score required`;
  }

  return {
    userId,
    hasActiveSubscription: hasActiveSub,
    hasRequiredScores: hasScores,
    scoreCount,
    isEligible: hasActiveSub && hasScores,
    reason,
  };
}

export function getEligibilityMessage(eligibility: DrawEligibility): string {
  if (eligibility.isEligible) {
    return 'You are eligible for the monthly draw!';
  }
  return eligibility.reason || 'Not eligible for draw';
}
