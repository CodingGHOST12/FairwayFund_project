import { Button } from '../ui/Button';
import { formatCurrency } from '@/lib/utils/formatting';

type DrawManagementProps = {
  draws: Array<{
    id: string;
    month: string;
    year: number;
    status: 'pending' | 'completed' | 'cancelled';
    totalParticipants: number;
    prizePool: { total: number };
  }>;
};

export function DrawManagement({ draws }: DrawManagementProps) {
  return (
    <div className="space-y-4">
      {draws.map((draw) => (
        <div key={draw.id} className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {draw.month} {draw.year}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Participants: {draw.totalParticipants}</p>
                <p>Prize Pool: {formatCurrency(draw.prizePool.total)}</p>
                <p>Status: {draw.status}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {draw.status === 'pending' && (
                <>
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm">Run Draw</Button>
                </>
              )}
              {draw.status === 'completed' && (
                <Button size="sm" variant="outline">View Results</Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
