import { describe, it, expect } from 'vitest';
import {
  scoreSchema,
  validateNoDuplicateDate,
  normalizeDateOnly,
  parseDateOnly,
} from '@/lib/validation/score.validation';

describe('Score Validation Schema & Date Logic', () => {
  describe('Zod scoreSchema', () => {
    it('accepts valid score data within 1-45', () => {
      const valid = scoreSchema.safeParse({
        stablefordScore: 36,
        date: '2026-09-22',
        courseName: 'Sunnydale Golf Club',
      });
      expect(valid.success).toBe(true);
    });

    it('accepts score of 1 and 45 boundaries', () => {
      expect(scoreSchema.safeParse({ stablefordScore: 1, date: '2026-09-22' }).success).toBe(true);
      expect(scoreSchema.safeParse({ stablefordScore: 45, date: '2026-09-22' }).success).toBe(true);
    });

    it('rejects score of 0 and 46', () => {
      expect(scoreSchema.safeParse({ stablefordScore: 0, date: '2026-09-22' }).success).toBe(false);
      expect(scoreSchema.safeParse({ stablefordScore: 46, date: '2026-09-22' }).success).toBe(false);
    });

    it('rejects decimal scores', () => {
      expect(scoreSchema.safeParse({ stablefordScore: 35.5, date: '2026-09-22' }).success).toBe(false);
    });

    it('rejects missing or invalid dates', () => {
      expect(scoreSchema.safeParse({ stablefordScore: 36, date: '' }).success).toBe(false);
      expect(scoreSchema.safeParse({ stablefordScore: 36, date: 'not-a-date' }).success).toBe(false);
    });
  });

  describe('normalizeDateOnly & parseDateOnly', () => {
    it('normalizes Date object correctly without timezone shift', () => {
      const d = new Date(2026, 8, 25); // 25 Sep 2026 local
      expect(normalizeDateOnly(d)).toBe('2026-09-25');
    });

    it('normalizes string YYYY-MM-DD directly', () => {
      expect(normalizeDateOnly('2026-09-25')).toBe('2026-09-25');
    });

    it('parses YYYY-MM-DD string to local Date correctly', () => {
      const parsed = parseDateOnly('2026-09-25');
      expect(parsed.getFullYear()).toBe(2026);
      expect(parsed.getMonth()).toBe(8); // September is month index 8
      expect(parsed.getDate()).toBe(25);
    });
  });

  describe('validateNoDuplicateDate helper', () => {
    const existing = [
      { id: 'score-1', date: new Date(2026, 8, 15) },
      { id: 'score-2', date: '2026-09-20' },
    ];

    it('allows a brand new date', () => {
      const check = validateNoDuplicateDate('2026-09-22', existing);
      expect(check.valid).toBe(true);
    });

    it('blocks duplicate date from string or Date input', () => {
      const checkString = validateNoDuplicateDate('2026-09-20', existing);
      expect(checkString.valid).toBe(false);
      expect(checkString.error).toContain('A score already exists for this date');

      const checkDate = validateNoDuplicateDate(new Date(2026, 8, 15), existing);
      expect(checkDate.valid).toBe(false);
    });

    it('allows same date when excluding the score ID (editing same score)', () => {
      const checkSelf = validateNoDuplicateDate('2026-09-20', existing, 'score-2');
      expect(checkSelf.valid).toBe(true);
    });
  });
});
