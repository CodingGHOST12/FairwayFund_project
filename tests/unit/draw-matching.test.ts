import { describe, it, expect, beforeEach } from 'vitest';
import { drawService } from '@/lib/services/draw.service';
import { scoreService } from '@/lib/services/score.service';
import { calculateRollover, calculateTierPrize, poundsToPence } from '@/lib/draw/prize-pool';

describe('Draw Matching and Results', () => {
  beforeEach(() => {
    drawService._resetForTesting();
    scoreService._resetForTesting();
  });

  describe('Prize Calculation', () => {
    it('divides prize equally among winners', () => {
      const tierPool = poundsToPence(400);
      
      expect(calculateTierPrize(tierPool, 1)).toBe(poundsToPence(400));
      expect(calculateTierPrize(tierPool, 2)).toBe(poundsToPence(200));
      expect(calculateTierPrize(tierPool, 4)).toBe(poundsToPence(100));
    });

    it('returns 0 for no winners', () => {
      expect(calculateTierPrize(poundsToPence(400), 0)).toBe(0);
    });

    it('handles uneven division with floor rounding', () => {
      const tierPool = poundsToPence(100);
      const prizePerWinner = calculateTierPrize(tierPool, 3);
      
      expect(prizePerWinner).toBe(Math.floor(tierPool / 3));
      expect(prizePerWinner * 3).toBeLessThanOrEqual(tierPool);
    });
  });

  describe('Jackpot Rollover', () => {
    it('rolls over full amount when no 5-match winners', () => {
      const fiveMatchPool = poundsToPence(400);
      const rollover = calculateRollover(fiveMatchPool, 0);
      
      expect(rollover).toBe(fiveMatchPool);
    });

    it('does not roll over when 5-match winner exists', () => {
      const fiveMatchPool = poundsToPence(400);
      
      expect(calculateRollover(fiveMatchPool, 1)).toBe(0);
      expect(calculateRollover(fiveMatchPool, 2)).toBe(0);
      expect(calculateRollover(fiveMatchPool, 5)).toBe(0);
    });
  });

  describe('Draw Execution Protection', () => {
    it('prevents executing completed draw', async () => {
      const result = await drawService.executeDraw('draw-aug-2026');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('already been executed');
    });

    it('prevents executing non-ready draw', async () => {
      const result = await drawService.executeDraw('draw-draft-oct-2026');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('must be in ready state');
    });

    it('returns existing result for already executed draw', async () => {
      // First execution
      const draw1 = await drawService.executeDraw('draw-sep-2026');
      expect(draw1.success).toBe(true);
      
      // Second execution attempt should return same result
      const draw2 = await drawService.executeDraw('draw-sep-2026');
      expect(draw2.success).toBe(true);
      expect(draw2.result?.id).toBe(draw1.result?.id);
      expect(draw2.result?.winningScores).toEqual(draw1.result?.winningScores);
    });
  });

  describe('Draw Publishing Protection', () => {
    it('requires execution before publishing', async () => {
      const result = await drawService.publishDraw('draw-draft-oct-2026');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('must be executed before publishing');
    });

    it('allows publishing after execution', async () => {
      // Execute draw first
      const execResult = await drawService.executeDraw('draw-sep-2026');
      expect(execResult.success).toBe(true);
      
      // Then publish
      const pubResult = await drawService.publishDraw('draw-sep-2026');
      expect(pubResult.success).toBe(true);
      expect(pubResult.draw?.status).toBe('published');
    });

    it('is idempotent - can publish twice safely', async () => {
      // Execute
      await drawService.executeDraw('draw-sep-2026');
      
      // First publish
      const pub1 = await drawService.publishDraw('draw-sep-2026');
      expect(pub1.success).toBe(true);
      
      // Second publish
      const pub2 = await drawService.publishDraw('draw-sep-2026');
      expect(pub2.success).toBe(true);
      expect(pub2.draw?.status).toBe('published');
    });
  });

  describe('Draw Result Consistency', () => {
    it('generates valid draw result structure', async () => {
      const result = await drawService.executeDraw('draw-sep-2026');
      
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result?.winningScores).toHaveLength(5);
      expect(result.result?.participantCount).toBeGreaterThanOrEqual(0);
      expect(result.result?.winners).toBeDefined();
      expect(result.result?.winners.fiveMatch).toBeGreaterThanOrEqual(0);
      expect(result.result?.winners.fourMatch).toBeGreaterThanOrEqual(0);
      expect(result.result?.winners.threeMatch).toBeGreaterThanOrEqual(0);
    });

    it('creates winner records for matching users', async () => {
      await drawService.executeDraw('draw-sep-2026');
      const winners = await drawService.getDrawWinners('draw-sep-2026');
      
      expect(Array.isArray(winners)).toBe(true);
      winners.forEach(winner => {
        expect(winner.drawId).toBe('draw-sep-2026');
        expect(winner.userId).toBeDefined();
        expect(winner.matchType).toMatch(/^(5|4|3)-match$/);
        expect(winner.prizeAmount).toBeGreaterThan(0);
        expect(winner.verificationStatus).toBe('pending');
      });
    });
  });
});
