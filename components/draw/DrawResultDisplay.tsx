import { useEffect, useState } from 'react';
import { DrawResult } from '@/types';
import { drawService } from '@/lib/services/draw.service';
import { formatCurrency } from '@/lib/draw/prize-pool';
import { Loading } from '@/components/ui/Loading';

type DrawResultDisplayProps = {
  result: DrawResult | null;
  drawId: string;
  isPublished?: boolean;
};

export function DrawResultDisplay({ result: initialResult, drawId, isPublished = false }: DrawResultDisplayProps) {
  const [result, setResult] = useState<DrawResult | null>(initialResult);
  const [winners, setWinners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!initialResult);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [drawResult, drawWinners] = await Promise.all([
          initialResult || drawService.getDrawResult(drawId),
          drawService.getDrawWinners(drawId),
        ]);
        
        setResult(drawResult);
        setWinners(drawWinners);
      } catch (err) {
        console.error('Failed to load draw result:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [drawId, initialResult]);

  if (isLoading) {
    return <Loading text="Loading draw results..." />;
  }

  if (!result) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
        No result available. Execute the draw first.
      </div>
    );
  }

  const totalWinners = result.winners.fiveMatch + result.winners.fourMatch + result.winners.threeMatch;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          {isPublished ? 'Published Draw Results' : 'Draw Execution Results'}
        </h3>
        {isPublished && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider">
            Published
          </span>
        )}
        {!isPublished && (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold uppercase tracking-wider">
            Awaiting Publication
          </span>
        )}
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

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Participants</p>
          <p className="text-2xl font-bold text-gray-900">{result.participantCount}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Winners</p>
          <p className="text-2xl font-bold text-green-700">{totalWinners}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">5-Match</p>
          <p className="text-2xl font-bold text-purple-700">{result.winners.fiveMatch}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">4/3-Match</p>
          <p className="text-2xl font-bold text-blue-700">{result.winners.fourMatch + result.winners.threeMatch}</p>
        </div>
      </div>

      {/* Winner Breakdown */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Winner Breakdown</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <span className="font-semibold text-gray-900">5-Number Match</span>
            <span className="text-purple-700 font-bold">{result.winners.fiveMatch} winner{result.winners.fiveMatch !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="font-semibold text-gray-900">4-Number Match</span>
            <span className="text-blue-700 font-bold">{result.winners.fourMatch} winner{result.winners.fourMatch !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="font-semibold text-gray-900">3-Number Match</span>
            <span className="text-green-700 font-bold">{result.winners.threeMatch} winner{result.winners.threeMatch !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Winner Prize Details (Admin only) */}
      {winners.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Prize Distribution</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• {result.winners.fiveMatch} × 5-Match = {formatCurrency(winners.filter(w => w.matchType === '5-match')[0]?.prizeAmount || 0)} each</p>
            <p>• {result.winners.fourMatch} × 4-Match = {formatCurrency(winners.filter(w => w.matchType === '4-match')[0]?.prizeAmount || 0)} each</p>
            <p>• {result.winners.threeMatch} × 3-Match = {formatCurrency(winners.filter(w => w.matchType === '3-match')[0]?.prizeAmount || 0)} each</p>
          </div>
        </div>
      )}

      {result.winners.fiveMatch === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-semibold text-amber-900">Jackpot Rollover</p>
          <p className="text-xs text-amber-700 mt-1">
            No 5-match winners. The 5-match prize pool will roll over to the next draw.
          </p>
        </div>
      )}
    </div>
  );
}
