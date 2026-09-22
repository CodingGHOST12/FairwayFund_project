'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { scoreService } from '@/lib/services/score.service';
import { GolfScore, CreateScoreInput, UpdateScoreInput } from '@/types';

export function useScores() {
  const { user } = useAuth();
  const [scores, setScores] = useState<GolfScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = useCallback(async () => {
    if (!user) {
      setScores([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userScores = await scoreService.getScores(user.id);
      setScores(userScores);
    } catch (err) {
      setError('Failed to load golf scores');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const addScore = async (input: CreateScoreInput): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await scoreService.addScore(user.id, input);
      if (!result.success) {
        return { success: false, error: result.error };
      }

      if (result.scores) {
        setScores(result.scores);
      } else {
        await fetchScores();
      }
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add score';
      return { success: false, error: msg };
    }
  };

  const updateScore = async (
    scoreId: string,
    input: UpdateScoreInput
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await scoreService.updateScore(user.id, scoreId, input);
      if (!result.success) {
        return { success: false, error: result.error };
      }

      if (result.scores) {
        setScores(result.scores);
      } else {
        await fetchScores();
      }
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update score';
      return { success: false, error: msg };
    }
  };

  const deleteScore = async (scoreId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await scoreService.deleteScore(user.id, scoreId);
      if (!result.success) {
        return { success: false, error: result.error };
      }

      if (result.scores) {
        setScores(result.scores);
      } else {
        await fetchScores();
      }
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete score';
      return { success: false, error: msg };
    }
  };

  return {
    scores,
    isLoading,
    error,
    addScore,
    updateScore,
    deleteScore,
    refreshScores: fetchScores,
  };
}
