import { PrizePool, PrizeTier } from '@/types';
import { drawConfig } from './draw-config';

/**
 * Money-safe prize pool calculations using pence (minor units).
 * All inputs should be in pence, outputs are in pence.
 */

export function calculatePrizePool(
  totalRevenuePence: number,
  rolloverPence: number = 0
): PrizePool {
  const { fiveMatch, fourMatch, threeMatch } = drawConfig.prizeTiers;

  const fiveMatchBase = Math.floor((totalRevenuePence * fiveMatch.poolPercent) / 100);
  const fourMatchPool = Math.floor((totalRevenuePence * fourMatch.poolPercent) / 100);
  const threeMatchPool = Math.floor((totalRevenuePence * threeMatch.poolPercent) / 100);

  const fiveMatchPool = fiveMatchBase + rolloverPence;
  const total = fiveMatchPool + fourMatchPool + threeMatchPool;

  return {
    fiveMatchPool,
    fourMatchPool,
    threeMatchPool,
    total,
  };
}

export function calculatePrizeTiers(prizePool: PrizePool): PrizeTier[] {
  return [
    {
      id: 'five-match',
      matchCount: 5,
      poolPercent: drawConfig.prizeTiers.fiveMatch.poolPercent,
      amount: prizePool.fiveMatchPool,
      label: drawConfig.prizeTiers.fiveMatch.label,
    },
    {
      id: 'four-match',
      matchCount: 4,
      poolPercent: drawConfig.prizeTiers.fourMatch.poolPercent,
      amount: prizePool.fourMatchPool,
      label: drawConfig.prizeTiers.fourMatch.label,
    },
    {
      id: 'three-match',
      matchCount: 3,
      poolPercent: drawConfig.prizeTiers.threeMatch.poolPercent,
      amount: prizePool.threeMatchPool,
      label: drawConfig.prizeTiers.threeMatch.label,
    },
  ];
}

export function calculateTierPrize(tierPoolPence: number, winnerCount: number): number {
  if (winnerCount === 0) return 0;
  return Math.floor(tierPoolPence / winnerCount);
}

export function calculateWinnerShare(
  tierPoolPence: number,
  winnerCount: number
): { perWinner: number; remainder: number } {
  if (winnerCount === 0) {
    return { perWinner: 0, remainder: tierPoolPence };
  }
  
  const perWinner = Math.floor(tierPoolPence / winnerCount);
  const remainder = tierPoolPence - (perWinner * winnerCount);
  
  return { perWinner, remainder };
}

export function calculateRollover(
  fiveMatchPoolPence: number,
  fiveMatchWinners: number
): number {
  if (fiveMatchWinners === 0) {
    return fiveMatchPoolPence;
  }
  return 0;
}

export function poundsToPence(pounds: number): number {
  return Math.round(pounds * 100);
}

export function penceToPounds(pence: number): number {
  return pence / 100;
}

export function formatCurrency(pence: number, currency: string = 'INR'): string {
  const rupees = penceToPounds(pence);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(rupees);
}
