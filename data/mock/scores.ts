import { GolfScore } from '@/types';

export const mockScores: GolfScore[] = [
  {
    id: 'score-1',
    userId: 'user-1',
    stablefordScore: 38,
    date: new Date('2026-09-15'),
    courseName: 'Sunnydale Golf Club',
    createdAt: new Date('2026-09-15'),
  },
  {
    id: 'score-2',
    userId: 'user-1',
    stablefordScore: 35,
    date: new Date('2026-09-08'),
    courseName: 'Riverside Links',
    createdAt: new Date('2026-09-08'),
  },
  {
    id: 'score-3',
    userId: 'user-1',
    stablefordScore: 40,
    date: new Date('2026-09-01'),
    courseName: 'Pinehurst Golf Course',
    createdAt: new Date('2026-09-01'),
  },
  {
    id: 'score-4',
    userId: 'user-1',
    stablefordScore: 33,
    date: new Date('2026-08-25'),
    courseName: 'Oak Valley Golf Club',
    createdAt: new Date('2026-08-25'),
  },
  {
    id: 'score-5',
    userId: 'user-1',
    stablefordScore: 37,
    date: new Date('2026-08-18'),
    courseName: 'Meadowbrook Course',
    createdAt: new Date('2026-08-18'),
  },
];
