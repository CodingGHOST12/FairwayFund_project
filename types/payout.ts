export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type Payout = {
  id: string;
  winnerId: string;
  amount: number;
  status: PayoutStatus;
  paymentMethod?: string;
  transactionId?: string;
  scheduledAt?: Date;
  completedAt?: Date;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
};
