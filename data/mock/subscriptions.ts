import { Subscription } from '@/types';

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    userId: 'user-1',
    plan: 'monthly',
    status: 'active',
    currentPeriodStart: new Date('2026-09-01'),
    currentPeriodEnd: new Date('2026-10-01'),
    cancelAtPeriodEnd: false,
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-09-01'),
  },
  {
    id: 'sub-2',
    userId: 'user-2',
    plan: 'yearly',
    status: 'active',
    currentPeriodStart: new Date('2026-07-15'),
    currentPeriodEnd: new Date('2027-07-15'),
    cancelAtPeriodEnd: false,
    createdAt: new Date('2026-07-15'),
    updatedAt: new Date('2026-07-15'),
  },
];
