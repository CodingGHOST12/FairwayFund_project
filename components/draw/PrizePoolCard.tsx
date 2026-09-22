import { PrizePool } from '@/types';
import { formatCurrency } from '@/lib/draw/prize-pool';
import { drawConfig } from '@/lib/draw/draw-config';

type PrizePoolCardProps = {
  prizePool: PrizePool;
  currency?: string;
  showBreakdown?: boolean;
};

export function PrizePoolCard({ 
  prizePool, 
  currency = 'GBP',
  showBreakdown = true 
}: PrizePoolCardProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 space-y-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-1">
          Total Prize Pool
        </p>
        <p className="text-4xl font-black text-green-900">
          {formatCurrency(prizePool.total, currency)}
        </p>
        <p className="text-xs text-gray-500 mt-1">Development demo value</p>
      </div>

      {showBreakdown && (
        <div className="pt-4 border-t border-green-200 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 font-medium">
              {drawConfig.prizeTiers.fiveMatch.label}
            </span>
            <span className="font-bold text-gray-900">
              {formatCurrency(prizePool.fiveMatchPool, currency)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 font-medium">
              {drawConfig.prizeTiers.fourMatch.label}
            </span>
            <span className="font-bold text-gray-900">
              {formatCurrency(prizePool.fourMatchPool, currency)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 font-medium">
              {drawConfig.prizeTiers.threeMatch.label}
            </span>
            <span className="font-bold text-gray-900">
              {formatCurrency(prizePool.threeMatchPool, currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
