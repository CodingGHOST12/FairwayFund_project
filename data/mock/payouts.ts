import { Payout } from '@/types';

export const mockPayouts: Payout[] = [
  {
    id: 'payout-1',
    winnerId: 'winner-1',
    amount: 610,
    status: 'completed',
    paymentMethod: 'bank_transfer',
    transactionId: 'TXN-2026-09-001',
    scheduledAt: new Date('2026-09-04'),
    completedAt: new Date('2026-09-05'),
    createdAt: new Date('2026-09-03'),
    updatedAt: new Date('2026-09-05'),
  },
];
