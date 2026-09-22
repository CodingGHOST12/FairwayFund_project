'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { drawService } from '@/lib/services/draw.service';
import { Draw, PrizePool, DrawEligibility, DrawSimulation } from '@/types';

export function useDraw() {
  const { user } = useAuth();
  const [draw, setDraw] = useState<Draw | null>(null);
  const [prizePool, setPrizePool] = useState<PrizePool | null>(null);
  const [eligibility, setEligibility] = useState<DrawEligibility | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDraw = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const currentDraw = await drawService.getCurrentDraw();
      setDraw(currentDraw);
      
      if (currentDraw) {
        const pool = await drawService.getPrizePool(currentDraw.id);
        setPrizePool(pool);
      }
    } catch (err) {
      setError('Failed to load draw information');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEligibility = useCallback(async () => {
    if (!user) {
      setEligibility(null);
      return;
    }
    
    try {
      const result = await drawService.checkUserEligibility(user.id);
      setEligibility(result);
    } catch (err) {
      console.error('Failed to check eligibility:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchDraw();
  }, [fetchDraw]);

  useEffect(() => {
    fetchEligibility();
  }, [fetchEligibility]);

  const refreshDraw = async () => {
    await fetchDraw();
    await fetchEligibility();
  };

  const simulateDraw = async (
    drawId: string,
    eligibleCount: number,
    revenueEstimate: number
  ): Promise<{ success: boolean; simulation?: DrawSimulation; error?: string }> => {
    try {
      const result = await drawService.simulateDraw(drawId, eligibleCount, revenueEstimate);
      if (result.success) {
        await refreshDraw();
      }
      return result;
    } catch (err) {
      return { success: false, error: 'Failed to simulate draw' };
    }
  };

  return {
    draw,
    prizePool,
    eligibility,
    isLoading,
    error,
    refreshDraw,
    simulateDraw,
  };
}
