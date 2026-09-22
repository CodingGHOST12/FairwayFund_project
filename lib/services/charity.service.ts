import { Charity, CharitySelection, CharityEvent, IndependentDonation } from '@/types';
import { mockCharities } from '@/data/mock/charities';
import { searchCharities, filterCharities, findCharityById, findFeaturedCharity } from '@/lib/charity/charity-utils';
import { charityConfig } from '@/lib/charity/charity-config';

const userSelections: Map<string, CharitySelection> = new Map([
  [
    'user-subscriber-1',
    {
      userId: 'user-subscriber-1',
      charityId: 'charity-1',
      contributionPercentage: 10,
      selectedAt: new Date('2026-01-15'),
    },
  ],
]);

const independentDonations: IndependentDonation[] = [];

export const charityService = {
  async getAll(): Promise<Charity[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockCharities;
  },

  async getCharityById(id: string): Promise<Charity | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return findCharityById(mockCharities, id) || null;
  },

  async getById(id: string): Promise<Charity | null> {
    return this.getCharityById(id);
  },

  async getFeaturedCharity(): Promise<Charity | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return findFeaturedCharity(mockCharities) || null;
  },

  async getFeatured(): Promise<Charity[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockCharities.filter((c) => c.isFeatured);
  },

  async searchCharities(query: string): Promise<Charity[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return searchCharities(mockCharities, query);
  },

  async search(query: string): Promise<Charity[]> {
    return this.searchCharities(query);
  },

  async filterCharities(filters: { category?: string; featuredOnly?: boolean; location?: string }): Promise<Charity[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return filterCharities(mockCharities, filters);
  },

  async filterByCategory(category: string): Promise<Charity[]> {
    return this.filterCharities({ category });
  },

  async getCharityEvents(charityId: string): Promise<CharityEvent[]> {
    const charity = await this.getCharityById(charityId);
    return charity ? charity.events : [];
  },

  async getSelectedCharity(userId: string): Promise<{ selection: CharitySelection | null; charity: Charity | null }> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const selection = userSelections.get(userId) || null;
    if (!selection) {
      return { selection: null, charity: null };
    }
    const charity = findCharityById(mockCharities, selection.charityId) || null;
    return { selection, charity };
  },

  async selectCharity(
    userId: string,
    charityId: string,
    contributionPercentage: number = charityConfig.minimumContributionPercentage
  ): Promise<{ success: boolean; selection?: CharitySelection; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const charity = findCharityById(mockCharities, charityId);
    if (!charity) {
      return { success: false, error: 'Charity not found' };
    }

    if (!charityConfig.isValidPercentage(contributionPercentage)) {
      return {
        success: false,
        error: `Contribution percentage must be between ${charityConfig.minimumContributionPercentage}% and ${charityConfig.maximumContributionPercentage}%`,
      };
    }

    const selection: CharitySelection = {
      userId,
      charityId,
      contributionPercentage,
      selectedAt: new Date(),
      updatedAt: new Date(),
    };

    userSelections.set(userId, selection);
    return { success: true, selection };
  },

  async updateCharitySelection(
    userId: string,
    charityId: string,
    contributionPercentage: number
  ): Promise<{ success: boolean; selection?: CharitySelection; error?: string }> {
    return this.selectCharity(userId, charityId, contributionPercentage);
  },

  async clearCharitySelection(userId: string): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    userSelections.delete(userId);
    return { success: true };
  },

  async createDonation(donation: Omit<IndependentDonation, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; donation?: IndependentDonation; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const charity = findCharityById(mockCharities, donation.charityId);
    if (!charity) {
      return { success: false, error: 'Target charity not found' };
    }
    if (donation.amount <= 0) {
      return { success: false, error: 'Donation amount must be greater than 0' };
    }

    const record: IndependentDonation = {
      ...donation,
      id: `don-${Date.now()}`,
      status: 'completed',
      createdAt: new Date(),
    };

    independentDonations.push(record);
    return { success: true, donation: record };
  },

  _resetForTesting() {
    userSelections.clear();
    userSelections.set('user-subscriber-1', {
      userId: 'user-subscriber-1',
      charityId: 'charity-1',
      contributionPercentage: 10,
      selectedAt: new Date('2026-01-15'),
    });
  },
};
