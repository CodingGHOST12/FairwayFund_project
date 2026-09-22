export type DrawMode = 'random' | 'algorithmic';

export type DrawStatus = 'draft' | 'configuring' | 'simulating' | 'ready' | 'published' | 'completed';

export type Draw = {
  id: string;
  period: string;
  month: string;
  year: number;
  drawDate: Date;
  status: DrawStatus;
  mode: DrawMode;
  totalParticipants: number;
  prizePool: PrizePool;
  rolloverAmount: number;
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
};

export type PrizePool = {
  fiveMatchPool: number;
  fourMatchPool: number;
  threeMatchPool: number;
  total: number;
};

export type PrizeTier = {
  id: string;
  matchCount: 5 | 4 | 3;
  poolPercent: number;
  amount: number;
  label: string;
};

export type DrawConfiguration = {
  drawId: string;
  mode: DrawMode;
  drawDate: Date;
  prizePoolSource: number;
  configuredAt: Date;
};

export type DrawEligibility = {
  userId: string;
  hasActiveSubscription: boolean;
  hasRequiredScores: boolean;
  scoreCount: number;
  isEligible: boolean;
  reason?: string;
};

export type DrawSimulation = {
  id: string;
  drawId: string;
  mode: DrawMode;
  eligibleCount: number;
  projectedPrizePool: PrizePool;
  simulatedAt: Date;
  status: 'simulating' | 'completed' | 'failed';
  note: string;
};

export type DrawResult = {
  id: string;
  drawId: string;
  winningScores: number[];
  participantCount: number;
  winners: {
    fiveMatch: number;
    fourMatch: number;
    threeMatch: number;
  };
  createdAt: Date;
};

export type DrawParticipation = {
  userId: string;
  drawId: string;
  scores: number[];
  matches?: number;
  participatedAt: Date;
};
