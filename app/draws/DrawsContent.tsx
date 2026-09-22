'use client';

import { useState, useEffect } from 'react';
import { useDraw } from '@/hooks/useDraw';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { DrawOverview } from '@/components/draw/DrawOverview';
import { DrawSchedule } from '@/components/draw/DrawSchedule';
import { DrawEligibility } from '@/components/draw/DrawEligibility';
import { PrizeTierList } from '@/components/draw/PrizeTierList';
import { DrawEmptyState } from '@/components/draw/DrawEmptyState';
import { DrawResult, Winner } from '@/types';
import { drawService } from '@/lib/services/draw.service';
import { formatCurrency } from '@/lib/draw/prize-pool';

export function DrawsContent() {
  const { user } = useAuth();
  const { draw, eligibility, isLoading, error, refreshDraw } = useDraw();
  const [result, setResult] = useState<DrawResult | null>(null);
  const [userWinner, setUserWinner] = useState<Winner | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      if (!draw || !user) return;
      
      if (draw.status === 'published' || draw.status === 'completed') {
        const [drawResult, userResult] = await Promise.all([
          drawService.getDrawResult(draw.id),
          drawService.getUserDrawResult(draw.id, user.id),
        ]);
        
        setResult(drawResult);
        setUserWinner(userResult.winner);
      }
    };

    loadResults();
  }, [draw, user]);

  if (isLoading) {
    return <Loading text="Loading draw information..." />;
  }

  if (error) {
    return <ErrorState message={error} retry={refreshDraw} />;
  }

  if (!draw) {
    return <DrawEmptyState message="No active draw available. Check back soon for the next monthly draw." />;
  }

  const isPublished = draw.status === 'published' || draw.status === 'completed';

  return (
    <div className="space-y-8">
      {/* User Win Notification */}
      {userWinner && isPublished && (
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl">
              🎉
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-900">Congratulations! You're a Winner!</h3>
              <p className="text-green-800 mt-1">
                You matched <strong>{userWinner.matchType}</strong> and won <strong>{formatCurrency(userWinner.prizeAmount)}</strong>!
              </p>
              <p className="text-sm text-green-700 mt-2">
                Prize verification and payout details will be available soon.
              </p>
            </div>
          </div>
        </div>
      )}

      <DrawOverview draw={draw} showActions={false} />

      {/* Published Results */}
      {isPublished && result && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Draw Results</h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider">
              Published
            </span>
          </div>

          {/* Winning Numbers */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Winning Numbers</p>
            <div className="flex flex-wrap gap-3">
              {result.winningScores.map((num, idx) => (
                <div
                  key={idx}
                  className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold shadow-md"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Winner Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Participants</p>
              <p className="text-2xl font-bold text-gray-900">{result.participantCount}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-xs text-purple-600 uppercase tracking-wider font-semibold mb-1">5-Match</p>
              <p className="text-2xl font-bold text-purple-700">{result.winners.fiveMatch}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-1">4-Match</p>
              <p className="text-2xl font-bold text-blue-700">{result.winners.fourMatch}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-xs text-green-600 uppercase tracking-wider font-semibold mb-1">3-Match</p>
              <p className="text-2xl font-bold text-green-700">{result.winners.threeMatch}</p>
            </div>
          </div>

          {result.winners.fiveMatch === 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-semibold text-amber-900">Jackpot Rollover</p>
              <p className="text-xs text-amber-700 mt-1">
                No 5-match winners this month. The jackpot rolls over to next month's draw!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upcoming Draw Info */}
      {!isPublished && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DrawSchedule draw={draw} />
          {eligibility && <DrawEligibility eligibility={eligibility} />}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Prize Tiers</h3>
        <PrizeTierList
          prizeAmounts={{
            fiveMatch: draw.prizePool.fiveMatchPool,
            fourMatch: draw.prizePool.fourMatchPool,
            threeMatch: draw.prizePool.threeMatchPool,
          }}
        />
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-900">
        <p className="font-semibold mb-1">How it works</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Your most recent golf scores are automatically entered into the monthly draw</li>
          <li>Match 5, 4, or 3 of the drawn numbers to win prizes</li>
          <li>Multiple winners share their tier prize pool equally</li>
          <li>The 5-match jackpot rolls over if there are no winners</li>
        </ul>
      </div>
    </div>
  );
}
