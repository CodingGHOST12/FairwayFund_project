'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { winnerService } from '@/lib/services/winner.service';
import { drawService } from '@/lib/services/draw.service';
import { Winner, Draw } from '@/types';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { WinnerResult } from '@/components/winner/WinnerResult';
import { ProofUpload } from '@/components/winner/ProofUpload';
import { formatCurrency } from '@/lib/draw/prize-pool';

export function WinningsContent() {
  const { user } = useAuth();
  const [winnings, setWinnings] = useState<(Winner & { draw?: Draw })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWinnings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const userWinnings = await winnerService.getUserWinnings(user.id);
      
      // Enrich with draw data
      const enriched = await Promise.all(
        userWinnings.map(async (w) => {
          const draw = await drawService.getDrawById(w.drawId);
          return { ...w, draw: draw || undefined };
        })
      );

      setWinnings(enriched);
    } catch (err) {
      setError('Failed to load winnings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWinnings();
  }, [user]);

  if (isLoading) {
    return <Loading text="Loading your winnings..." />;
  }

  if (error) {
    return <ErrorState message={error} retry={loadWinnings} />;
  }

  if (winnings.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">No Winnings Yet</h3>
        <p className="text-sm text-gray-600 mt-1">
          Your prize winnings will appear here once you match 3 or more numbers in a draw.
        </p>
      </div>
    );
  }

  // Separate into pending and completed
  const pending = winnings.filter(w => w.verificationStatus === 'pending' || w.payoutStatus === 'pending');
  const completed = winnings.filter(w => w.verificationStatus !== 'pending' || w.payoutStatus !== 'pending');

  return (
    <div className="space-y-8">
      {/* Total Winnings */}
      {winnings.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8">
          <p className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-2">Total Winnings</p>
          <p className="text-4xl font-black text-green-900">
            {formatCurrency(winnings.reduce((sum, w) => sum + w.prizeAmount, 0))}
          </p>
          <p className="text-sm text-green-700 mt-2">{winnings.length} winning draw{winnings.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {/* Pending Items */}
      {pending.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Pending Action</h2>
          {pending.map(winning => (
            <div key={winning.id} className="space-y-4">
              {winning.draw && (
                <p className="text-sm font-semibold text-gray-600">
                  {winning.draw.period} Draw
                </p>
              )}
              
              <WinnerResult winner={winning} drawId={winning.drawId} />

              {winning.verificationStatus === 'pending' && !winning.proofSubmittedAt && (
                <ProofUpload winner={winning} onSuccess={loadWinnings} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Completed Items */}
      {completed.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
          {completed.map(winning => (
            <div key={winning.id} className="space-y-4">
              {winning.draw && (
                <p className="text-sm font-semibold text-gray-600">
                  {winning.draw.period} Draw
                </p>
              )}
              <WinnerResult winner={winning} drawId={winning.drawId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
