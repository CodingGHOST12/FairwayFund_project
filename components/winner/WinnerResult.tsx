'use client';

import { Winner, WinnerProof } from '@/types';
import { formatCurrency } from '@/lib/draw/prize-pool';

type WinnerResultProps = {
  winner: Winner | null;
  drawId: string;
};

export function WinnerResult({ winner, drawId }: WinnerResultProps) {
  if (!winner) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">No Winning Match</h3>
        <p className="text-sm text-gray-600 mt-1">
          Your scores didn't match enough numbers this draw. Better luck next time!
        </p>
      </div>
    );
  }

  const statusColors = {
    pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800' },
    approved: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', badge: 'bg-green-100 text-green-800' },
    rejected: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', badge: 'bg-red-100 text-red-800' },
  };

  const payoutColors = {
    pending: { badge: 'bg-blue-100 text-blue-800' },
    paid: { badge: 'bg-green-100 text-green-800' },
  };

  const verifyColor = statusColors[winner.verificationStatus];
  const payoutColor = payoutColors[winner.payoutStatus];

  return (
    <div className={`border-2 rounded-xl p-6 space-y-6 ${verifyColor.border} ${verifyColor.bg}`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">🎉 Congratulations!</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${verifyColor.badge}`}>
            {winner.verificationStatus}
          </span>
        </div>

        <div className="space-y-2">
          <p className={`text-lg font-bold ${verifyColor.text}`}>
            You matched {winner.matchType}
          </p>
          <p className="text-3xl font-black text-green-700">{formatCurrency(winner.prizeAmount)}</p>
        </div>
      </div>

      {/* Status Info */}
      <div className="space-y-3 pt-4 border-t border-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Verification</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${verifyColor.badge}`}>
            {winner.verificationStatus}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Payout</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${payoutColor.badge}`}>
            {winner.payoutStatus}
          </span>
        </div>
      </div>

      {/* Status Messages */}
      {winner.verificationStatus === 'pending' && !winner.proofSubmittedAt && (
        <div className="p-4 bg-amber-100 border border-amber-300 rounded-lg">
          <p className="text-sm font-semibold text-amber-900 mb-1">Proof Required</p>
          <p className="text-xs text-amber-800">
            Upload a screenshot of your scorecard to verify your win and process payout.
          </p>
        </div>
      )}

      {winner.verificationStatus === 'pending' && winner.proofSubmittedAt && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-1">Under Review</p>
          <p className="text-xs text-blue-700">
            Your proof has been submitted on {new Date(winner.proofSubmittedAt).toLocaleDateString()}. We're reviewing it now.
          </p>
        </div>
      )}

      {winner.verificationStatus === 'approved' && winner.payoutStatus === 'pending' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-green-900 mb-1">Verification Approved</p>
          <p className="text-xs text-green-700">
            Your proof has been approved. Payout is pending processing.
          </p>
        </div>
      )}

      {winner.payoutStatus === 'paid' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-green-900 mb-1">Payment Processed</p>
          <p className="text-xs text-green-700">
            Your payout of {formatCurrency(winner.prizeAmount)} was processed on {new Date(winner.paidAt || Date.now()).toLocaleDateString()}.
          </p>
        </div>
      )}

      {winner.verificationStatus === 'rejected' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-900 mb-1">Verification Rejected</p>
          {winner.rejectionReason && (
            <p className="text-xs text-red-700 mt-1">
              <strong>Reason:</strong> {winner.rejectionReason}
            </p>
          )}
          <p className="text-xs text-red-700 mt-2">
            Please contact support if you believe this is in error.
          </p>
        </div>
      )}
    </div>
  );
}
