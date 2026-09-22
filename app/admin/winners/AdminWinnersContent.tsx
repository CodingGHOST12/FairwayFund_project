'use client';

import { useState, useEffect } from 'react';
import { winnerService } from '@/lib/services/winner.service';
import { Winner } from '@/types';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/draw/prize-pool';

type FilterType = 'all' | 'pending_verification' | 'approved' | 'rejected' | 'pending_payout' | 'paid';

export function AdminWinnersContent() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadWinners = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await winnerService.getAdminWinners();
      setWinners(data);
    } catch (err) {
      setError('Failed to load winners');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWinners();
  }, []);

  const filtered = winners.filter(w => {
    switch (filter) {
      case 'pending_verification':
        return w.verificationStatus === 'pending';
      case 'approved':
        return w.verificationStatus === 'approved';
      case 'rejected':
        return w.verificationStatus === 'rejected';
      case 'pending_payout':
        return w.verificationStatus === 'approved' && w.payoutStatus === 'pending';
      case 'paid':
        return w.payoutStatus === 'paid';
      default:
        return true;
    }
  });

  const handleApprove = async (winnerId: string) => {
    setActionInProgress(winnerId);
    try {
      const result = await winnerService.approveProof(winnerId, 'admin');
      if (result.success) {
        setWinners(winners.map(w => w.id === winnerId ? result.winner! : w));
      } else {
        alert(result.error || 'Failed to approve');
      }
    } catch (err) {
      alert('Error approving winner');
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (winnerId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setActionInProgress(winnerId);
    try {
      const result = await winnerService.rejectProof(winnerId, reason, 'admin');
      if (result.success) {
        setWinners(winners.map(w => w.id === winnerId ? result.winner! : w));
      } else {
        alert(result.error || 'Failed to reject');
      }
    } catch (err) {
      alert('Error rejecting winner');
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleMarkPaid = async (winnerId: string) => {
    setActionInProgress(winnerId);
    try {
      const result = await winnerService.markPayoutPaid(winnerId, 'admin');
      if (result.success) {
        setWinners(winners.map(w => w.id === winnerId ? result.winner! : w));
      } else {
        alert(result.error || 'Failed to mark as paid');
      }
    } catch (err) {
      alert('Error marking as paid');
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  if (isLoading) {
    return <Loading text="Loading winners..." />;
  }

  if (error) {
    return <ErrorState message={error} retry={loadWinners} />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending_verification', 'approved', 'rejected', 'pending_payout', 'paid'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.replace(/_/g, ' ')} ({winners.filter(w => {
              switch (f) {
                case 'pending_verification':
                  return w.verificationStatus === 'pending';
                case 'approved':
                  return w.verificationStatus === 'approved';
                case 'rejected':
                  return w.verificationStatus === 'rejected';
                case 'pending_payout':
                  return w.verificationStatus === 'approved' && w.payoutStatus === 'pending';
                case 'paid':
                  return w.payoutStatus === 'paid';
                default:
                  return true;
              }
            }).length})
          </button>
        ))}
      </div>

      {/* Winners Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No winners found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Winner</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Draw</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Match</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Prize</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Verification</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Payout</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(winner => (
                  <tr key={winner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-900 font-semibold">{winner.userId}</td>
                    <td className="px-6 py-3 text-gray-600">{winner.drawId}</td>
                    <td className="px-6 py-3">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {winner.matchType}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-semibold text-gray-900">{formatCurrency(winner.prizeAmount)}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        winner.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                        winner.verificationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {winner.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        winner.payoutStatus === 'pending' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {winner.payoutStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {winner.verificationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(winner.id)}
                              disabled={actionInProgress === winner.id}
                              className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(winner.id)}
                              disabled={actionInProgress === winner.id}
                              className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {winner.verificationStatus === 'approved' && winner.payoutStatus === 'pending' && (
                          <button
                            onClick={() => handleMarkPaid(winner.id)}
                            disabled={actionInProgress === winner.id}
                            className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
