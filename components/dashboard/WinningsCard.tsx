import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '@/lib/utils/formatting';

type WinningsCardProps = {
  winnings: Array<{
    id: string;
    matchType: '5-match' | '4-match' | '3-match';
    prizeAmount: number;
    status: 'pending_proof' | 'proof_submitted' | 'verified' | 'rejected';
    drawMonth: string;
    drawYear: number;
  }>;
};

export function WinningsCard({ winnings }: WinningsCardProps) {
  const statusColors = {
    pending_proof: 'warning' as const,
    proof_submitted: 'info' as const,
    verified: 'success' as const,
    rejected: 'error' as const,
  };

  const statusLabels = {
    pending_proof: 'Awaiting Proof',
    proof_submitted: 'Under Review',
    verified: 'Verified',
    rejected: 'Rejected',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Winnings</CardTitle>
      </CardHeader>
      <CardContent>
        {winnings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No winnings yet</p>
        ) : (
          <div className="space-y-3">
            {winnings.map((win) => (
              <div key={win.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {win.drawMonth} {win.drawYear}
                    </p>
                    <p className="text-sm text-gray-600">{win.matchType}</p>
                  </div>
                  <Badge variant={statusColors[win.status]}>
                    {statusLabels[win.status]}
                  </Badge>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(win.prizeAmount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
