import { Winner } from '@/types';

export const mockWinners: Winner[] = [
  {
    id: 'winner-1',
    drawId: 'draw-2',
    userId: 'user-1',
    matchType: '4-match',
    prizeAmount: 610,
    verificationStatus: 'approved',
    payoutStatus: 'paid',
    proofSubmittedAt: new Date('2026-09-02'),
    approvedAt: new Date('2026-09-03'),
    paidAt: new Date('2026-09-04'),
    createdAt: new Date('2026-09-01'),
  },
];
