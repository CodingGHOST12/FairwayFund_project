import { describe, it, expect, beforeEach } from 'vitest';
import {
  isValidStablefordScore,
  sortScoresNewestFirst,
  retainLatestFiveScores,
  removeOldestScoreIfNeeded,
  findScoreByDate,
  hasDuplicateScoreDate,
  calculateAverageScore,
  formatScoreDate,
} from '@/lib/utils/score';
import { scoreService } from '@/lib/services/score.service';
import { GolfScore } from '@/types';

describe('Golf Score Utilities and Service Logic', () => {
  beforeEach(() => {
    scoreService._resetForTesting();
  });

  describe('Stableford Score Range (1 to 45)', () => {
    it('accepts score of 1 (minimum boundary)', () => {
      expect(isValidStablefordScore(1)).toBe(true);
    });

    it('accepts score of 45 (maximum boundary)', () => {
      expect(isValidStablefordScore(45)).toBe(true);
    });

    it('accepts intermediate score of 36', () => {
      expect(isValidStablefordScore(36)).toBe(true);
    });

    it('rejects score of 0', () => {
      expect(isValidStablefordScore(0)).toBe(false);
    });

    it('rejects score of 46', () => {
      expect(isValidStablefordScore(46)).toBe(false);
    });

    it('rejects negative scores like -5', () => {
      expect(isValidStablefordScore(-5)).toBe(false);
    });

    it('rejects decimal scores like 35.5', () => {
      expect(isValidStablefordScore(35.5)).toBe(false);
    });

    it('rejects non-numeric values', () => {
      expect(isValidStablefordScore('36')).toBe(false);
      expect(isValidStablefordScore(null)).toBe(false);
      expect(isValidStablefordScore(undefined)).toBe(false);
    });
  });

  describe('Sorting Newest First', () => {
    it('sorts scores with random dates in descending chronological order', () => {
      const scores: GolfScore[] = [
        { id: '1', userId: 'u1', stablefordScore: 30, date: new Date('2026-09-10'), createdAt: new Date() },
        { id: '2', userId: 'u1', stablefordScore: 35, date: new Date('2026-09-25'), createdAt: new Date() },
        { id: '3', userId: 'u1', stablefordScore: 40, date: new Date('2026-09-15'), createdAt: new Date() },
      ];

      const sorted = sortScoresNewestFirst(scores);
      expect(sorted[0].id).toBe('2'); // 25 Sep
      expect(sorted[1].id).toBe('3'); // 15 Sep
      expect(sorted[2].id).toBe('1'); // 10 Sep
    });
  });

  describe('Five-Score Rule (Maximum 5 Retained & Automatic Oldest Removal)', () => {
    it('keeps all scores when count is <= 5', () => {
      const scores: GolfScore[] = [
        { id: '1', userId: 'u1', stablefordScore: 30, date: new Date('2026-09-01'), createdAt: new Date() },
        { id: '2', userId: 'u1', stablefordScore: 35, date: new Date('2026-09-02'), createdAt: new Date() },
        { id: '3', userId: 'u1', stablefordScore: 40, date: new Date('2026-09-03'), createdAt: new Date() },
      ];

      expect(retainLatestFiveScores(scores)).toHaveLength(3);
    });

    it('removes the oldest score when a 6th score is present', () => {
      const scores: GolfScore[] = [
        { id: 'oldest', userId: 'u1', stablefordScore: 30, date: new Date('2026-09-01'), createdAt: new Date() },
        { id: 's2', userId: 'u1', stablefordScore: 32, date: new Date('2026-09-05'), createdAt: new Date() },
        { id: 's3', userId: 'u1', stablefordScore: 34, date: new Date('2026-09-10'), createdAt: new Date() },
        { id: 's4', userId: 'u1', stablefordScore: 36, date: new Date('2026-09-15'), createdAt: new Date() },
        { id: 's5', userId: 'u1', stablefordScore: 38, date: new Date('2026-09-20'), createdAt: new Date() },
        { id: 'newest', userId: 'u1', stablefordScore: 42, date: new Date('2026-09-25'), createdAt: new Date() },
      ];

      const retained = retainLatestFiveScores(scores);
      expect(retained).toHaveLength(5);
      expect(retained[0].id).toBe('newest');
      expect(retained.find((s) => s.id === 'oldest')).toBeUndefined();
    });
  });

  describe('Duplicate Date Detection', () => {
    const scores: GolfScore[] = [
      { id: '1', userId: 'u1', stablefordScore: 35, date: new Date('2026-09-20'), createdAt: new Date() },
      { id: '2', userId: 'u1', stablefordScore: 38, date: new Date('2026-09-22'), createdAt: new Date() },
    ];

    it('detects duplicate date', () => {
      expect(hasDuplicateScoreDate(scores, '2026-09-20')).toBe(true);
      expect(hasDuplicateScoreDate(scores, new Date('2026-09-22'))).toBe(true);
    });

    it('returns false for a non-existing date', () => {
      expect(hasDuplicateScoreDate(scores, '2026-09-21')).toBe(false);
    });

    it('allows same date when excluding the current score ID (self-edit)', () => {
      expect(hasDuplicateScoreDate(scores, '2026-09-20', '1')).toBe(false);
      expect(hasDuplicateScoreDate(scores, '2026-09-22', '1')).toBe(true);
    });
  });

  describe('Score Service End-to-End Workflow', () => {
    const testUser = 'test-subscriber-user';

    it('adds a score and retrieves it', async () => {
      const res = await scoreService.addScore(testUser, {
        stablefordScore: 37,
        date: '2026-09-10',
        courseName: 'Test Links',
      });

      expect(res.success).toBe(true);
      expect(res.score?.stablefordScore).toBe(37);

      const userScores = await scoreService.getScores(testUser);
      expect(userScores).toHaveLength(1);
      expect(userScores[0].stablefordScore).toBe(37);
    });

    it('rejects duplicate date on add', async () => {
      await scoreService.addScore(testUser, {
        stablefordScore: 35,
        date: '2026-09-12',
      });

      const duplicateRes = await scoreService.addScore(testUser, {
        stablefordScore: 40,
        date: '2026-09-12',
      });

      expect(duplicateRes.success).toBe(false);
      expect(duplicateRes.error).toContain('already exists for this date');
    });

    it('enforces 5-score limit when adding 6 scores', async () => {
      // Add 6 scores with consecutive dates
      for (let i = 1; i <= 6; i++) {
        const day = String(i).padStart(2, '0');
        const res = await scoreService.addScore(testUser, {
          stablefordScore: 30 + i,
          date: `2026-09-${day}`,
        });
        expect(res.success).toBe(true);
      }

      const userScores = await scoreService.getScores(testUser);
      expect(userScores).toHaveLength(5);
      // Newest should be 2026-09-06 (score 36)
      expect(userScores[0].stablefordScore).toBe(36);
      // Oldest retained should be 2026-09-02 (score 32), 2026-09-01 (score 31) was dropped
      expect(userScores[4].stablefordScore).toBe(32);
      expect(userScores.find((s) => s.stablefordScore === 31)).toBeUndefined();
    });

    it('updates a score value on same date successfully', async () => {
      const addRes = await scoreService.addScore(testUser, {
        stablefordScore: 34,
        date: '2026-09-18',
      });

      const scoreId = addRes.score!.id;

      const updateRes = await scoreService.updateScore(testUser, scoreId, {
        stablefordScore: 41,
        date: '2026-09-18',
      });

      expect(updateRes.success).toBe(true);
      expect(updateRes.score?.stablefordScore).toBe(41);
    });

    it('rejects updating date to an already taken date by another score', async () => {
      const res1 = await scoreService.addScore(testUser, {
        stablefordScore: 30,
        date: '2026-09-20',
      });
      await scoreService.addScore(testUser, {
        stablefordScore: 35,
        date: '2026-09-21',
      });

      const updateRes = await scoreService.updateScore(testUser, res1.score!.id, {
        date: '2026-09-21',
      });

      expect(updateRes.success).toBe(false);
      expect(updateRes.error).toContain('already exists for this date');
    });

    it('deletes a score successfully', async () => {
      const addRes = await scoreService.addScore(testUser, {
        stablefordScore: 38,
        date: '2026-09-25',
      });

      const scoreId = addRes.score!.id;
      const delRes = await scoreService.deleteScore(testUser, scoreId);
      expect(delRes.success).toBe(true);

      const userScores = await scoreService.getScores(testUser);
      expect(userScores.find((s) => s.id === scoreId)).toBeUndefined();
    });

    it('prevents a user from modifying another user score', async () => {
      const addRes = await scoreService.addScore('user-alpha', {
        stablefordScore: 38,
        date: '2026-09-25',
      });

      const scoreId = addRes.score!.id;

      const unauthorizedUpdate = await scoreService.updateScore('user-beta', scoreId, {
        stablefordScore: 40,
      });
      expect(unauthorizedUpdate.success).toBe(false);

      const unauthorizedDelete = await scoreService.deleteScore('user-beta', scoreId);
      expect(unauthorizedDelete.success).toBe(false);
    });
  });
});
