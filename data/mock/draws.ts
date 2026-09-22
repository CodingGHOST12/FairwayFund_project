import { Draw, DrawResult, DrawSimulation } from '@/types';
import { poundsToPence } from '@/lib/draw/prize-pool';

export const mockDraws: Draw[] = [
  {
    id: 'draw-sep-2026',
    period: 'September 2026',
    month: 'September',
    year: 2026,
    drawDate: new Date('2026-10-01T12:00:00Z'),
    status: 'ready',
    mode: 'random',
    totalParticipants: 234,
    prizePool: {
      fiveMatchPool: poundsToPence(3744),
      fourMatchPool: poundsToPence(3276),
      threeMatchPool: poundsToPence(2340),
      total: poundsToPence(9360),
    },
    rolloverAmount: 0,
    createdAt: new Date('2026-09-01T10:00:00Z'),
    updatedAt: new Date('2026-09-15T14:30:00Z'),
  },
  {
    id: 'draw-aug-2026',
    period: 'August 2026',
    month: 'August',
    year: 2026,
    drawDate: new Date('2026-09-01T12:00:00Z'),
    status: 'completed',
    mode: 'random',
    totalParticipants: 218,
    prizePool: {
      fiveMatchPool: poundsToPence(3488),
      fourMatchPool: poundsToPence(3052),
      threeMatchPool: poundsToPence(2180),
      total: poundsToPence(8720),
    },
    rolloverAmount: 0,
    createdAt: new Date('2026-08-01T10:00:00Z'),
    updatedAt: new Date('2026-08-25T16:00:00Z'),
    completedAt: new Date('2026-09-01T12:15:00Z'),
  },
  {
    id: 'draw-jul-2026',
    period: 'July 2026',
    month: 'July',
    year: 2026,
    drawDate: new Date('2026-08-01T12:00:00Z'),
    status: 'completed',
    mode: 'algorithmic',
    totalParticipants: 205,
    prizePool: {
      fiveMatchPool: poundsToPence(3280),
      fourMatchPool: poundsToPence(2870),
      threeMatchPool: poundsToPence(2050),
      total: poundsToPence(8200),
    },
    rolloverAmount: 0,
    createdAt: new Date('2026-07-01T10:00:00Z'),
    updatedAt: new Date('2026-07-28T14:00:00Z'),
    completedAt: new Date('2026-08-01T12:10:00Z'),
  },
  {
    id: 'draw-draft-oct-2026',
    period: 'October 2026',
    month: 'October',
    year: 2026,
    drawDate: new Date('2026-11-01T12:00:00Z'),
    status: 'draft',
    mode: 'random',
    totalParticipants: 0,
    prizePool: {
      fiveMatchPool: 0,
      fourMatchPool: 0,
      threeMatchPool: 0,
      total: 0,
    },
    rolloverAmount: 0,
    createdAt: new Date('2026-09-20T10:00:00Z'),
  },
];

export const mockDrawResults: DrawResult[] = [
  {
    id: 'result-aug-2026',
    drawId: 'draw-aug-2026',
    winningScores: [38, 35, 40, 33, 37],
    participantCount: 218,
    winners: {
      fiveMatch: 2,
      fourMatch: 5,
      threeMatch: 12,
    },
    createdAt: new Date('2026-09-01T12:15:00Z'),
  },
  {
    id: 'result-jul-2026',
    drawId: 'draw-jul-2026',
    winningScores: [36, 34, 39, 35, 38],
    participantCount: 205,
    winners: {
      fiveMatch: 0,
      fourMatch: 7,
      threeMatch: 15,
    },
    createdAt: new Date('2026-08-01T12:10:00Z'),
  },
];

export const mockSimulations: DrawSimulation[] = [
  {
    id: 'sim-sep-2026',
    drawId: 'draw-sep-2026',
    mode: 'random',
    eligibleCount: 234,
    projectedPrizePool: {
      fiveMatchPool: poundsToPence(3744),
      fourMatchPool: poundsToPence(3276),
      threeMatchPool: poundsToPence(2340),
      total: poundsToPence(9360),
    },
    simulatedAt: new Date('2026-09-15T14:30:00Z'),
    status: 'completed',
    note: 'SIMULATION - Development data only',
  },
];
