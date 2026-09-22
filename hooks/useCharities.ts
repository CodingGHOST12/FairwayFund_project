'use client';

import { useState, useEffect, useCallback } from 'react';
import { charityService } from '@/lib/services/charity.service';
import { Charity } from '@/types';

export function useCharities() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [featuredCharity, setFeaturedCharity] = useState<Charity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [all, featured] = await Promise.all([
        charityService.getAll(),
        charityService.getFeaturedCharity(),
      ]);
      setCharities(all);
      setFeaturedCharity(featured);
    } catch (err) {
      setError('Failed to load charities');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharities();
  }, [fetchCharities]);

  const search = async (query: string) => {
    try {
      setIsLoading(true);
      const res = await charityService.searchCharities(query);
      setCharities(res);
    } finally {
      setIsLoading(false);
    }
  };

  const filter = async (filters: { category?: string; location?: string }) => {
    try {
      setIsLoading(true);
      const res = await charityService.filterCharities(filters);
      setCharities(res);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    charities,
    featuredCharity,
    isLoading,
    error,
    search,
    filter,
    refreshCharities: fetchCharities,
  };
}
