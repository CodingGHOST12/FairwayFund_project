import { DrawMode, PrizeTier } from '@/types';

export const drawConfig = {
  prizeTiers: {
    fiveMatch: {
      id: 'five-match',
      matchCount: 5 as const,
      poolPercent: 40,
      label: '5-Number Match',
    },
    fourMatch: {
      id: 'four-match',
      matchCount: 4 as const,
      poolPercent: 35,
      label: '4-Number Match',
    },
    threeMatch: {
      id: 'three-match',
      matchCount: 3 as const,
      poolPercent: 25,
      label: '3-Number Match',
    },
  },

  modes: {
    random: {
      id: 'random' as DrawMode,
      label: 'Random',
      description: 'Purely random draw generation',
    },
    algorithmic: {
      id: 'algorithmic' as DrawMode,
      label: 'Algorithmic',
      description: 'Score-frequency based draw generation',
    },
  },

  schedule: {
    dayOfMonth: 1,
    defaultHour: 12,
  },

  eligibility: {
    minimumScores: 1,
    maximumScores: 5,
  },

  validatePrizeTierPercentages(): boolean {
    const { fiveMatch, fourMatch, threeMatch } = this.prizeTiers;
    const total = fiveMatch.poolPercent + fourMatch.poolPercent + threeMatch.poolPercent;
    return total === 100;
  },

  getPrizeTiers(): PrizeTier[] {
    const { fiveMatch, fourMatch, threeMatch } = this.prizeTiers;
    return [
      { ...fiveMatch, amount: 0 },
      { ...fourMatch, amount: 0 },
      { ...threeMatch, amount: 0 },
    ];
  },

  isValidMode(mode: string): mode is DrawMode {
    return mode === 'random' || mode === 'algorithmic';
  },
} as const;
