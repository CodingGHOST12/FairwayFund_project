'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { charityService } from '@/lib/services/charity.service';
import { Charity, CharitySelection } from '@/types';
import { charityConfig } from '@/lib/charity/charity-config';

export function useCharitySelection() {
  const { user } = useAuth();
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [selection, setSelection] = useState<CharitySelection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSelection = useCallback(async () => {
    if (!user) {
      setSelectedCharity(null);
      setSelection(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await charityService.getSelectedCharity(user.id);
      setSelectedCharity(res.charity);
      setSelection(res.selection);
    } catch (err) {
      setError('Failed to load selected charity');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSelection();
  }, [fetchSelection]);

  const selectCharity = async (
    charityId: string,
    percentage: number = charityConfig.minimumContributionPercentage
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      setIsLoading(true);
      const res = await charityService.selectCharity(user.id, charityId, percentage);
      if (!res.success) {
        return { success: false, error: res.error };
      }
      await fetchSelection();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to update charity selection' };
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = async (): Promise<{ success: boolean }> => {
    if (!user) return { success: false };
    try {
      setIsLoading(true);
      await charityService.clearCharitySelection(user.id);
      setSelectedCharity(null);
      setSelection(null);
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedCharity,
    selection,
    contributionPercentage: selection?.contributionPercentage || charityConfig.minimumContributionPercentage,
    isLoading,
    error,
    selectCharity,
    clearSelection,
    refreshSelection: fetchSelection,
  };
}
