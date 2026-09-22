export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type WinnerPayoutStatus = 'pending' | 'paid';

export type Winner = {
  id: string;
  drawId: string;
  userId: string;
  matchType: '5-match' | '4-match' | '3-match';
  prizeAmount: number;
  verificationStatus: VerificationStatus;
  payoutStatus: WinnerPayoutStatus;
  rejectionReason?: string;
  proofSubmittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  paidAt?: Date;
  createdAt: Date;
};

export type WinnerProof = {
  id: string;
  winnerId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
};

