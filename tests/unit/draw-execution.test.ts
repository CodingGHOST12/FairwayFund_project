import { describe, it, expect } from 'vitest';
import {
  generateRandomDrawNumbers,
  generateAlgorithmicDrawNumbers,
  countMatches,
  getMatchTier,
  getUserScoreValues,
} from '@/lib/draw/draw-execution';
import type { GolfScore } from '@/types/score';
import { appConfig } from '@/lib/config/app.config';

describe('Draw Execution', () => {
  describe('generateRandomDrawNumbers', () => {
    it('generates exactly 5 unique numbers', () => {
      const numbers = generateRandomDrawNumbers();
      expect(numbers).toHaveLength(5);
      expect(new Set(numbers).size).toBe(5); // All unique
    });

    it('generates numbers in valid range (1-45)', () => {
      const numbers = generateRandomDrawNumbers();
      numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(appConfig.score.min);
        expect(num).toBeLessThanOrEqual(appConfig.score.max);
      });
    });

    it('returns sorted array', () => {
      const numbers = generateRandomDrawNumbers();
      const sorted = [...numbers].sort((a, b) => a - b);
      expect(numbers).toEqual(sorted);
    });

    it('generates different results on multiple calls', () => {
      const results = new Set();
      for (let i = 0; i < 10; i++) {
        results.add(generateRandomDrawNumbers().join(','));
      }
      // Very unlikely to get same result 10 times
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('generateAlgorithmicDrawNumbers', () => {
    const mockScores: GolfScore[] = [
      { id: '1', userId: 'u1', stablefordScore: 36, date: new Date(), createdAt: new Date() },
      { id: '2', userId: 'u1', stablefordScore: 38, date: new Date(), createdAt: new Date() },
      { id: '3', userId: 'u2', stablefordScore: 36, date: new Date(), createdAt: new Date() },
      { id: '4', userId: 'u2', stablefordScore: 40, date: new Date(), createdAt: new Date() },
      { id: '5', userId: 'u3', stablefordScore: 35, date: new Date(), createdAt: new Date() },
      { id: '6', userId: 'u3', stablefordScore: 36, date: new Date(), createdAt: new Date() },
      { id: '7', userId: 'u4', stablefordScore: 37, date: new Date(), createdAt: new Date() },
      { id: '8', userId: 'u5', stablefordScore: 39, date: new Date(), createdAt: new Date() },
      { id: '9', userId: 'u6', stablefordScore: 36, date: new Date(), createdAt: new Date() },
      { id: '10', userId: 'u7', stablefordScore: 34, date: new Date(), createdAt: new Date() },
    ];

    it('generates exactly 5 unique numbers', () => {
      const numbers = generateAlgorithmicDrawNumbers(mockScores);
      expect(numbers).toHaveLength(5);
      expect(new Set(numbers).size).toBe(5);
    });

    it('generates numbers in valid range', () => {
      const numbers = generateAlgorithmicDrawNumbers(mockScores);
      numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(appConfig.score.min);
        expect(num).toBeLessThanOrEqual(appConfig.score.max);
      });
    });

    it('returns sorted array', () => {
      const numbers = generateAlgorithmicDrawNumbers(mockScores);
      const sorted = [...numbers].sort((a, b) => a - b);
      expect(numbers).toEqual(sorted);
    });

    it('falls back to random with insufficient data', () => {
      const fewScores: GolfScore[] = [
        { id: '1', userId: 'u1', stablefordScore: 36, date: new Date(), createdAt: new Date() },
        { id: '2', userId: 'u1', stablefordScore: 38, date: new Date(), createdAt: new Date() },
      ];
      
      const numbers = generateAlgorithmicDrawNumbers(fewScores);
      expect(numbers).toHaveLength(5);
      expect(new Set(numbers).size).toBe(5);
    });
  });

  describe('countMatches', () => {
    it('counts exact matches correctly', () => {
      expect(countMatches([36, 38, 40, 35, 37], [36, 38, 40, 35, 37])).toBe(5);
      expect(countMatches([36, 38, 40, 35, 37], [36, 38, 40, 35, 33])).toBe(4);
      expect(countMatches([36, 38, 40, 35, 37], [36, 38, 40, 33, 34])).toBe(3);
      expect(countMatches([36, 38, 40, 35, 37], [36, 38, 33, 34, 32])).toBe(2);
      expect(countMatches([36, 38, 40, 35, 37], [36, 33, 34, 32, 31])).toBe(1);
      expect(countMatches([36, 38, 40, 35, 37], [33, 34, 32, 31, 30])).toBe(0);
    });

    it('handles unordered arrays', () => {
      expect(countMatches([37, 35, 40, 38, 36], [36, 38, 40, 35, 37])).toBe(5);
      expect(countMatches([40, 38, 36], [36, 38, 40, 35, 37])).toBe(3);
    });
  });

  describe('getMatchTier', () => {
    it('returns correct tier for match counts', () => {
      expect(getMatchTier(5)).toBe('5-match');
      expect(getMatchTier(4)).toBe('4-match');
      expect(getMatchTier(3)).toBe('3-match');
    });

    it('returns null for insufficient matches', () => {
      expect(getMatchTier(2)).toBeNull();
      expect(getMatchTier(1)).toBeNull();
      expect(getMatchTier(0)).toBeNull();
    });
  });

  describe('getUserScoreValues', () => {
    const mockScores: GolfScore[] = [
      { id: '1', userId: 'u1', stablefordScore: 38, date: new Date('2026-09-20'), createdAt: new Date() },
      { id: '2', userId: 'u1', stablefordScore: 36, date: new Date('2026-09-15'), createdAt: new Date() },
      { id: '3', userId: 'u1', stablefordScore: 40, date: new Date('2026-09-10'), createdAt: new Date() },
      { id: '4', userId: 'u1', stablefordScore: 35, date: new Date('2026-09-05'), createdAt: new Date() },
      { id: '5', userId: 'u1', stablefordScore: 37, date: new Date('2026-09-01'), createdAt: new Date() },
      { id: '6', userId: 'u1', stablefordScore: 34, date: new Date('2026-08-28'), createdAt: new Date() },
    ];

    it('extracts score values from golf scores', () => {
      const values = getUserScoreValues(mockScores);
      expect(values).toEqual([38, 36, 40, 35, 37]);
    });

    it('limits to 5 most recent scores', () => {
      const values = getUserScoreValues(mockScores);
      expect(values).toHaveLength(5);
      expect(values).not.toContain(34); // Oldest score excluded
    });

    it('filters invalid scores', () => {
      const invalidScores: GolfScore[] = [
        { id: '1', userId: 'u1', stablefordScore: 50, date: new Date(), createdAt: new Date() },
        { id: '2', userId: 'u1', stablefordScore: 36, date: new Date(), createdAt: new Date() },
        { id: '3', userId: 'u1', stablefordScore: 0, date: new Date(), createdAt: new Date() },
      ];
      
      const values = getUserScoreValues(invalidScores);
      expect(values).toEqual([36]);
    });

    it('handles empty array', () => {
      const values = getUserScoreValues([]);
      expect(values).toEqual([]);
    });
  });
});
