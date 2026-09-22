import { Badge } from '../ui/Badge';
import { formatCurrency } from '@/lib/utils/formatting';

type WinnerTableProps = {
  winners: Array<{
    id: string;
    userName: string;
    matchType: '5-match' | '4-match' | '3-match';
    prizeAmount: number;
    status: 'pending_proof' | 'proof_submitted' | 'verified' | 'rejected';
    drawMonth: string;
  }>;
};

export function WinnerTable({ winners }: WinnerTableProps) {
  const statusColors = {
    pending_proof: 'warning' as const,
    proof_submitted: 'info' as const,
    verified: 'success' as const,
    rejected: 'error' as const,
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Winner
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Draw
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Match Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prize
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {winners.map((winner) => (
            <tr key={winner.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {winner.userName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {winner.drawMonth}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {winner.matchType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                {formatCurrency(winner.prizeAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={statusColors[winner.status]}>
                  {winner.status.replace('_', ' ')}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
