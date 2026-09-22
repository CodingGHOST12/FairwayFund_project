import { describe, it, expect } from 'vitest';
import {
  charitySelectionSchema,
  donationSchema,
  charitySchema,
} from '@/lib/validation/charity.validation';

describe('Charity Validation Schemas', () => {
  describe('charitySelectionSchema', () => {
    it('accepts minimum 10% contribution', () => {
      const valid = charitySelectionSchema.safeParse({
        charityId: 'charity-1',
        contributionPercentage: 10,
      });
      expect(valid.success).toBe(true);
    });

    it('accepts increased contribution percentage up to 100%', () => {
      expect(charitySelectionSchema.safeParse({ charityId: 'charity-1', contributionPercentage: 25 }).success).toBe(true);
      expect(charitySelectionSchema.safeParse({ charityId: 'charity-1', contributionPercentage: 50 }).success).toBe(true);
      expect(charitySelectionSchema.safeParse({ charityId: 'charity-1', contributionPercentage: 100 }).success).toBe(true);
    });

    it('rejects percentage below 10%', () => {
      const invalid = charitySelectionSchema.safeParse({
        charityId: 'charity-1',
        contributionPercentage: 9,
      });
      expect(invalid.success).toBe(false);
      expect(invalid.error?.errors[0].message).toContain('Minimum charity contribution is 10%');
    });

    it('rejects percentage above 100%', () => {
      const invalid = charitySelectionSchema.safeParse({
        charityId: 'charity-1',
        contributionPercentage: 101,
      });
      expect(invalid.success).toBe(false);
    });

    it('rejects decimal percentages', () => {
      const invalid = charitySelectionSchema.safeParse({
        charityId: 'charity-1',
        contributionPercentage: 12.5,
      });
      expect(invalid.success).toBe(false);
    });

    it('rejects missing charityId', () => {
      const invalid = charitySelectionSchema.safeParse({
        charityId: '',
        contributionPercentage: 10,
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe('donationSchema', () => {
    it('accepts valid donation input', () => {
      const valid = donationSchema.safeParse({
        charityId: 'charity-1',
        amount: 25,
        donorName: 'Jane Golfer',
        donorEmail: 'jane@example.com',
        message: 'Supporting youth golf!',
      });
      expect(valid.success).toBe(true);
    });

    it('rejects zero or negative donation amounts', () => {
      expect(donationSchema.safeParse({
        charityId: 'charity-1',
        amount: 0,
        donorName: 'Jane',
        donorEmail: 'jane@example.com',
      }).success).toBe(false);

      expect(donationSchema.safeParse({
        charityId: 'charity-1',
        amount: -10,
        donorName: 'Jane',
        donorEmail: 'jane@example.com',
      }).success).toBe(false);
    });
  });
});
