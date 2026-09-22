import { drawConfig } from '@/lib/draw/draw-config';
import { formatCurrency } from '@/lib/draw/prize-pool';

type PrizeTierListProps = {
  prizeAmounts?: {
    fiveMatch: number;
    fourMatch: number;
    threeMatch: number;
  };
  currency?: string;
};

export function PrizeTierList({ prizeAmounts, currency = 'GBP' }: PrizeTierListProps) {
  const tiers = [
    {
      ...drawConfig.prizeTiers.fiveMatch,
      amount: prizeAmounts?.fiveMatch,
    },
    {
      ...drawConfig.prizeTiers.fourMatch,
      amount: prizeAmounts?.fourMatch,
    },
    {
      ...drawConfig.prizeTiers.threeMatch,
      amount: prizeAmounts?.threeMatch,
    },
  ];

  return (
    <div className="space-y-3">
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
              {tier.matchCount}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{tier.label}</p>
              <p className="text-xs text-gray-500">Match {tier.matchCount} numbers</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-700">{tier.poolPercent}%</p>
            {tier.amount !== undefined && (
              <p className="text-xs text-gray-600">{formatCurrency(tier.amount, currency)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
