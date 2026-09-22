import { Charity } from '@/types';

export function searchCharities(charities: Charity[], query: string): Charity[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return charities;

  return charities.filter((charity) => {
    const nameMatch = charity.name.toLowerCase().includes(trimmed);
    const descMatch = charity.description.toLowerCase().includes(trimmed);
    const longDescMatch = charity.longDescription.toLowerCase().includes(trimmed);
    const catMatch = charity.category.toLowerCase().includes(trimmed);
    const locMatch = charity.location ? charity.location.toLowerCase().includes(trimmed) : false;

    return nameMatch || descMatch || longDescMatch || catMatch || locMatch;
  });
}

export function filterCharities(
  charities: Charity[],
  filters: { category?: string; featuredOnly?: boolean; location?: string }
): Charity[] {
  let result = [...charities];

  if (filters.category && filters.category !== 'all') {
    result = result.filter(
      (c) => c.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters.featuredOnly) {
    result = result.filter((c) => c.isFeatured);
  }

  if (filters.location && filters.location !== 'all') {
    result = result.filter((c) =>
      c.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }

  return result;
}

export function findFeaturedCharity(charities: Charity[]): Charity | undefined {
  return charities.find((c) => c.isFeatured) || charities[0];
}

export function findCharityById(charities: Charity[], id: string): Charity | undefined {
  return charities.find((c) => c.id === id);
}

export function sortCharities(
  charities: Charity[],
  sortBy: 'name' | 'contributions' | 'supporters' = 'name'
): Charity[] {
  return [...charities].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'contributions') return b.totalContributions - a.totalContributions;
    if (sortBy === 'supporters') return b.supporterCount - a.supporterCount;
    return 0;
  });
}
