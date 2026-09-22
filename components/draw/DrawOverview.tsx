import Link from 'next/link';
import { Draw } from '@/types';
import { formatDrawDate } from '@/lib/draw/draw-utils';
import { DrawStatus } from './DrawStatus';
import { PrizePoolCard } from './PrizePoolCard';
import { Button } from '@/components/ui/Button';

type DrawOverviewProps = {
  draw: Draw;
  showActions?: boolean;
};

export function DrawOverview({ draw, showActions = true }: DrawOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{draw.period} Draw</h2>
              <DrawStatus status={draw.status} />
            </div>
            <p className="text-sm text-gray-600">
              Draw date: <strong>{formatDrawDate(draw.drawDate)}</strong>
            </p>
          </div>
          
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Draw Mode
            </p>
            <p className="text-lg font-bold text-gray-900 capitalize">{draw.mode}</p>
          </div>
        </div>

        {draw.totalParticipants > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <strong>{draw.totalParticipants}</strong> eligible subscribers
            </p>
          </div>
        )}
      </div>

      <PrizePoolCard prizePool={draw.prizePool} showBreakdown={true} />

      {showActions && (
        <div className="flex flex-wrap gap-3">
          <Link href="/draws">
            <Button variant="outline">View All Draws</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
