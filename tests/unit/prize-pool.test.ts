import { describe, it, expect } from 'vitest';
import {
  calculatePrizePool,
  calculatePrizeTiers,
  calculateTierPrize,
  calculateWinnerShare,
  calculateRollover,
  poundsToPence,
  penceToPounds,
} from '@/lib/draw/prize-pool';
import { drawConfig } from '@/lib/draw/draw-config';

describe('Prize Pool Calculations', () => {
  describe('Prize tier percentages', () => {
    it('should total exactly 100%', () => {
      const { fiveMatch, fourMatch, threeMatch } = drawConfig.prizeTiers;
      const total = fiveMatch.poolPercent + fourMatch.poolPercent + threeMatch.poolPercent;
      expect(total).toBe(100);
    });

    it('validates prize tier percentages correctly', () => {
      expect(drawConfig.validatePrizeTierPercentages()).toBe(true);
    });
  });

  describe('calculatePrizePool', () => {
    it('distributes prize pool correctly (40/35/25)', () => {
      const totalPence = poundsToPence(1000);
      const pool = calculatePrizePool(totalPence, 0);

      expect(pool.fiveMatchPool).toBe(poundsToPence(400));
      expect(pool.fourMatchPool).toBe(poundsToPence(350));
      expect(pool.threeMatchPool).toBe(poundsToPence(250));
      expect(pool.total).toBe(totalPence);
    });

    it('includes rollover in 5-match pool', () => {
      const totalPence = poundsToPence(1000);
      const rolloverPence = poundsToPence(500);
      const pool = calculatePrizePool(totalPence, rolloverPence);

      expect(pool.fiveMatchPool).toBe(poundsToPence(900));
      expect(pool.fourMatchPool).toBe(poundsToPence(350));
      expect(pool.threeMatchPool).toBe(poundsToPence(250));
      expect(pool.total).toBe(poundsToPence(1500));
    });

    it('handles zero revenue', () => {
      const pool = calculatePrizePool(0, 0);
      expect(pool.total).toBe(0);
      expect(pool.fiveMatchPool).toBe(0);
      expect(pool.fourMatchPool).toBe(0);
      expect(pool.threeMatchPool).toBe(0);
    });
  });

  describe('calculateTierPrize', () => {
    it('divides prize equally among winners', () => {
      const tierPoolPence = poundsToPence(400);
      const prize = calculateTierPrize(tierPoolPence, 2);
      expect(prize).toBe(poundsToPence(200));
    });

    it('returns 0 when no winners', () => {
      const prize = calculateTierPrize(poundsToPence(400), 0);
      expect(prize).toBe(0);
    });

    it('handles uneven division with floor rounding', () => {
      const tierPoolPence = poundsToPence(100);
      const prize = calculateTierPrize(tierPoolPence, 3);
      expect(prize).toBe(Math.floor(poundsToPence(100) / 3));
    });
  });

  describe('calculateWinnerShare', () => {
    it('calculates per-winner share and remainder', () => {
      const tierPoolPence = poundsToPence(100);
      const result = calculateWinnerShare(tierPoolPence, 3);
      
      expect(result.perWinner).toBe(Math.floor(tierPoolPence / 3));
      expect(result.remainder).toBe(tierPoolPence - (result.perWinner * 3));
    });

    it('returns full pool as remainder when no winners', () => {
      const tierPoolPence = poundsToPence(400);
      const result = calculateWinnerShare(tierPoolPence, 0);
      
      expect(result.perWinner).toBe(0);
      expect(result.remainder).toBe(tierPoolPence);
    });
  });

  describe('calculateRollover', () => {
    it('returns full 5-match pool when no winners', () => {
      const fiveMatchPence = poundsToPence(400);
      const rollover = calculateRollover(fiveMatchPence, 0);
      expect(rollover).toBe(fiveMatchPence);
    });

    it('returns 0 when there are winners', () => {
      const fiveMatchPence = poundsToPence(400);
      const rollover = calculateRollover(fiveMatchPence, 2);
      expect(rollover).toBe(0);
    });
  });

  describe('Money conversion', () => {
    it('converts pounds to pence accurately', () => {
      expect(poundsToPence(10)).toBe(1000);
      expect(poundsToPence(100)).toBe(10000);
      expect(poundsToPence(1.50)).toBe(150);
    });

    it('converts pence to pounds accurately', () => {
      expect(penceToPounds(1000)).toBe(10);
      expect(penceToPounds(10000)).toBe(100);
      expect(penceToPounds(150)).toBe(1.50);
    });

    it('handles round-trip conversion', () => {
      const pounds = 123.45;
      expect(penceToPounds(poundsToPence(pounds))).toBe(pounds);
    });
  });

  describe('Prize tier calculations', () => {
    it('creates prize tiers with correct structure', () => {
      const pool = calculatePrizePool(poundsToPence(1000), 0);
      const tiers = calculatePrizeTiers(pool);

      expect(tiers).toHaveLength(3);
      expect(tiers[0].matchCount).toBe(5);
      expect(tiers[1].matchCount).toBe(4);
      expect(tiers[2].matchCount).toBe(3);
      expect(tiers[0].amount).toBe(pool.fiveMatchPool);
      expect(tiers[1].amount).toBe(pool.fourMatchPool);
      expect(tiers[2].amount).toBe(pool.threeMatchPool);
    });
  });
});
