import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent, truncateText } from '@/lib/utils/formatting';
import { formatDate, formatMonthYear, isSameDay } from '@/lib/utils/date';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('₹1,000.00');
      expect(formatCurrency(10.5)).toBe('₹10.50');
      expect(formatCurrency(0)).toBe('₹0.00');
    });
  });

  describe('formatPercent', () => {
    it('should format percentages correctly', () => {
      expect(formatPercent(10)).toBe('10%');
      expect(formatPercent(50)).toBe('50%');
      expect(formatPercent(100)).toBe('100%');
    });
  });

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe(text);
    });

    it('should truncate long text', () => {
      const text = 'This is a very long text that needs truncation';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-09-22');
      const formatted = formatDate(date);
      expect(formatted).toContain('22');
      expect(formatted).toContain('09');
      expect(formatted).toContain('2026');
    });
  });

  describe('formatMonthYear', () => {
    it('should format month and year correctly', () => {
      const date = new Date('2026-09-22');
      const formatted = formatMonthYear(date);
      expect(formatted).toContain('September');
      expect(formatted).toContain('2026');
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2026-09-22T10:00:00');
      const date2 = new Date('2026-09-22T15:00:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2026-09-22');
      const date2 = new Date('2026-09-23');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });
});
