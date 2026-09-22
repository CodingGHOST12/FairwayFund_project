import { describe, it, expect } from 'vitest';
import { loginSchema, signupSchema } from '@/lib/validation/auth.validation';
import { scoreSchema, validateNoDuplicateDate } from '@/lib/validation/score.validation';
import { charitySchema } from '@/lib/validation/charity.validation';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
      };
      expect(() => loginSchema.parse(data)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
      };
      expect(() => loginSchema.parse(data)).toThrow();
    });

    it('should reject missing password', () => {
      const data = {
        email: 'test@example.com',
        password: '',
      };
      expect(() => loginSchema.parse(data)).toThrow();
    });
  });

  describe('signupSchema', () => {
    it('should accept valid signup data', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        name: 'John Smith',
      };
      expect(() => signupSchema.parse(data)).not.toThrow();
    });

    it('should reject password less than 8 characters', () => {
      const data = {
        email: 'test@example.com',
        password: 'pass',
        confirmPassword: 'pass',
        name: 'John Smith',
      };
      expect(() => signupSchema.parse(data)).toThrow();
    });

    it('should reject mismatched passwords', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
        name: 'John Smith',
      };
      expect(() => signupSchema.parse(data)).toThrow();
    });
  });

  describe('scoreSchema', () => {
    it('should accept valid score', () => {
      const data = {
        stablefordScore: 35,
        date: new Date(),
      };
      expect(() => scoreSchema.parse(data)).not.toThrow();
    });

    it('should reject score below 1', () => {
      const data = {
        stablefordScore: 0,
        date: new Date(),
      };
      expect(() => scoreSchema.parse(data)).toThrow();
    });

    it('should reject score above 45', () => {
      const data = {
        stablefordScore: 46,
        date: new Date(),
      };
      expect(() => scoreSchema.parse(data)).toThrow();
    });

    it('should reject decimal scores', () => {
      const data = {
        stablefordScore: 35.5,
        date: new Date(),
      };
      expect(() => scoreSchema.parse(data)).toThrow();
    });
  });

  describe('validateNoDuplicateDate', () => {
    it('should allow score on new date', () => {
      const newDate = new Date('2026-09-22');
      const existingScores = [
        { date: new Date('2026-09-20') },
        { date: new Date('2026-09-21') },
      ];
      const result = validateNoDuplicateDate(newDate, existingScores);
      expect(result.valid).toBe(true);
    });

    it('should reject duplicate date', () => {
      const newDate = new Date('2026-09-22');
      const existingScores = [
        { date: new Date('2026-09-22') },
        { date: new Date('2026-09-21') },
      ];
      const result = validateNoDuplicateDate(newDate, existingScores);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('charitySchema', () => {
    it('should accept valid charity data', () => {
      const data = {
        name: 'Test Charity',
        description: 'A test charity description',
        longDescription: 'This is a much longer description that meets the minimum requirement',
        category: 'Health',
        registrationNumber: 'CH123456',
      };
      expect(() => charitySchema.parse(data)).not.toThrow();
    });

    it('should reject short description', () => {
      const data = {
        name: 'Test Charity',
        description: 'Short',
        longDescription: 'This is a much longer description that meets the minimum requirement',
        category: 'Health',
        registrationNumber: 'CH123456',
      };
      expect(() => charitySchema.parse(data)).toThrow();
    });
  });
});
