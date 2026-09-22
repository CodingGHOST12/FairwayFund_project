import { describe, it, expect, beforeEach } from 'vitest';
import {
  searchCharities,
  filterCharities,
  findCharityById,
  findFeaturedCharity,
  sortCharities,
} from '@/lib/charity/charity-utils';
import { charityService } from '@/lib/services/charity.service';
import { mockCharities } from '@/data/mock/charities';

describe('Charity System Utilities & Service', () => {
  beforeEach(() => {
    charityService._resetForTesting();
  });

  describe('Search Functionality', () => {
    it('finds charities by case-insensitive name match', () => {
      const results = searchCharities(mockCharities, 'greenside');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].name).toBe('Greenside Foundation');
    });

    it('finds charities by category', () => {
      const results = searchCharities(mockCharities, 'Health');
      expect(results.some((c) => c.name === 'Fairway to Health')).toBe(true);
    });

    it('finds charities by location', () => {
      const results = searchCharities(mockCharities, 'Edinburgh');
      expect(results.some((c) => c.location.includes('Edinburgh'))).toBe(true);
    });

    it('returns all charities on empty search query', () => {
      expect(searchCharities(mockCharities, '')).toHaveLength(mockCharities.length);
      expect(searchCharities(mockCharities, '   ')).toHaveLength(mockCharities.length);
    });

    it('returns empty array when query does not match any charity', () => {
      expect(searchCharities(mockCharities, 'nonexistentxyz123')).toHaveLength(0);
    });
  });

  describe('Filter Functionality', () => {
    it('filters charities by exact category', () => {
      const results = filterCharities(mockCharities, { category: 'Youth Sports' });
      expect(results.every((c) => c.category === 'Youth Sports')).toBe(true);
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it('filters featured charities only', () => {
      const results = filterCharities(mockCharities, { featuredOnly: true });
      expect(results.every((c) => c.isFeatured)).toBe(true);
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it('combines search and category filters correctly', () => {
      const searchRes = searchCharities(mockCharities, 'golf');
      const combined = filterCharities(searchRes, { category: 'Disability Support' });
      expect(combined.every((c) => c.category === 'Disability Support')).toBe(true);
    });
  });

  describe('Charity Lookups', () => {
    it('finds charity by valid ID', () => {
      const found = findCharityById(mockCharities, 'charity-1');
      expect(found).toBeDefined();
      expect(found?.name).toBe('Greenside Foundation');
    });

    it('returns undefined for nonexistent charity ID', () => {
      expect(findCharityById(mockCharities, 'invalid-id-xyz')).toBeUndefined();
    });

    it('finds featured charity', () => {
      const featured = findFeaturedCharity(mockCharities);
      expect(featured).toBeDefined();
      expect(featured?.isFeatured).toBe(true);
    });
  });

  describe('Charity Selection & Service State', () => {
    const testUserId = 'test-subscriber-charity-user';

    it('gets initial selection for demo subscriber', async () => {
      const res = await charityService.getSelectedCharity('user-subscriber-1');
      expect(res.selection).toBeDefined();
      expect(res.selection?.charityId).toBe('charity-1');
      expect(res.charity?.name).toBe('Greenside Foundation');
    });

    it('allows a user to select a charity with minimum 10% contribution', async () => {
      const res = await charityService.selectCharity(testUserId, 'charity-2', 10);
      expect(res.success).toBe(true);
      expect(res.selection?.charityId).toBe('charity-2');
      expect(res.selection?.contributionPercentage).toBe(10);

      const retrieved = await charityService.getSelectedCharity(testUserId);
      expect(retrieved.charity?.id).toBe('charity-2');
      expect(retrieved.selection?.contributionPercentage).toBe(10);
    });

    it('allows a user to increase contribution percentage to 25% or 50%', async () => {
      const res25 = await charityService.selectCharity(testUserId, 'charity-3', 25);
      expect(res25.success).toBe(true);
      expect(res25.selection?.contributionPercentage).toBe(25);

      const res50 = await charityService.selectCharity(testUserId, 'charity-3', 50);
      expect(res50.success).toBe(true);
      expect(res50.selection?.contributionPercentage).toBe(50);
    });

    it('rejects contribution percentage below 10%', async () => {
      const res = await charityService.selectCharity(testUserId, 'charity-1', 9);
      expect(res.success).toBe(false);
      expect(res.error).toContain('must be between 10% and 100%');
    });

    it('rejects contribution percentage above 100%', async () => {
      const res = await charityService.selectCharity(testUserId, 'charity-1', 105);
      expect(res.success).toBe(false);
      expect(res.error).toContain('must be between 10% and 100%');
    });

    it('maintains user-specific isolation for selections', async () => {
      await charityService.selectCharity('user-alpha', 'charity-1', 15);
      await charityService.selectCharity('user-beta', 'charity-2', 30);

      const alpha = await charityService.getSelectedCharity('user-alpha');
      const beta = await charityService.getSelectedCharity('user-beta');

      expect(alpha.charity?.id).toBe('charity-1');
      expect(alpha.selection?.contributionPercentage).toBe(15);

      expect(beta.charity?.id).toBe('charity-2');
      expect(beta.selection?.contributionPercentage).toBe(30);
    });

    it('creates an independent donation record without charging real card', async () => {
      const res = await charityService.createDonation({
        charityId: 'charity-1',
        donorName: 'Generous Golfer',
        donorEmail: 'golfer@example.com',
        amount: 50,
        message: 'Keep up the great work!',
      });

      expect(res.success).toBe(true);
      expect(res.donation?.amount).toBe(50);
      expect(res.donation?.status).toBe('completed');
    });
  });
});
