import { Draw, DrawResult, DrawConfiguration, DrawSimulation, DrawEligibility, DrawMode, DrawStatus, Winner } from '@/types';
import { mockDraws, mockDrawResults, mockSimulations } from '@/data/mock/draws';
import { calculatePrizePool, calculatePrizeTiers, calculateTierPrize, calculateRollover } from '@/lib/draw/prize-pool';
import { isEligibleForDraw } from '@/lib/draw/draw-eligibility';
import { getNextDrawDate } from '@/lib/draw/draw-utils';
import { subscriptionService } from './subscription.service';
import { scoreService } from './score.service';
import { 
  generateRandomDrawNumbers, 
  generateAlgorithmicDrawNumbers, 
  countMatches, 
  getMatchTier,
  getUserScoreValues 
} from '@/lib/draw/draw-execution';
import type { GolfScore } from '@/types/score';

const draws: Map<string, Draw> = new Map(mockDraws.map(d => [d.id, d]));
const drawResults: Map<string, DrawResult> = new Map(mockDrawResults.map(r => [r.drawId, r]));
const winners: Map<string, Winner[]> = new Map();
const simulations: Map<string, DrawSimulation> = new Map();

export const drawService = {
  async getCurrentDraw(): Promise<Draw | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const current = Array.from(draws.values()).find(
      d => d.status !== 'completed' && new Date() < d.drawDate
    );
    return current || null;
  },

  async getDrawById(id: string): Promise<Draw | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return draws.get(id) || null;
  },

  async getDrawHistory(): Promise<Draw[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return Array.from(draws.values())
      .filter(d => d.status === 'completed')
      .sort((a, b) => b.drawDate.getTime() - a.drawDate.getTime());
  },

  async getDrawResult(drawId: string): Promise<DrawResult | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return drawResults.get(drawId) || null;
  },

  async getDrawWinners(drawId: string): Promise<Winner[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return winners.get(drawId) || [];
  },

  async getUserDrawResult(drawId: string, userId: string): Promise<{ participated: boolean; winner: Winner | null }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const drawWinners = winners.get(drawId) || [];
    const userWinner = drawWinners.find(w => w.userId === userId);
    return {
      participated: drawWinners.length > 0, // Simplified check
      winner: userWinner || null,
    };
  },

  async createDraw(month: string, year: number, mode: DrawMode = 'random'): Promise<Draw> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const drawDate = getNextDrawDate(new Date(year, new Date(`${month} 1, ${year}`).getMonth()));
    const period = `${month} ${year}`;
    
    const newDraw: Draw = {
      id: `draw-${Date.now()}`,
      period,
      month,
      year,
      drawDate,
      status: 'draft',
      mode,
      totalParticipants: 0,
      prizePool: {
        fiveMatchPool: 0,
        fourMatchPool: 0,
        threeMatchPool: 0,
        total: 0,
      },
      rolloverAmount: 0,
      createdAt: new Date(),
    };
    
    draws.set(newDraw.id, newDraw);
    return newDraw;
  },

  async configureDraw(
    drawId: string,
    config: Partial<DrawConfiguration>
  ): Promise<{ success: boolean; draw?: Draw; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const draw = draws.get(drawId);
    if (!draw) {
      return { success: false, error: 'Draw not found' };
    }

    if (draw.status !== 'draft' && draw.status !== 'configuring') {
      return { success: false, error: 'Draw cannot be configured in current status' };
    }

    const updated: Draw = {
      ...draw,
      mode: config.mode || draw.mode,
      drawDate: config.drawDate || draw.drawDate,
      status: 'configuring',
      updatedAt: new Date(),
    };

    draws.set(drawId, updated);
    return { success: true, draw: updated };
  },

  async simulateDraw(
    drawId: string,
    eligibleCount: number,
    revenueEstimatePence: number
  ): Promise<{ success: boolean; simulation?: DrawSimulation; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const draw = draws.get(drawId);
    if (!draw) {
      return { success: false, error: 'Draw not found' };
    }

    const prizePool = calculatePrizePool(revenueEstimatePence, draw.rolloverAmount);

    const simulation: DrawSimulation = {
      id: `sim-${Date.now()}`,
      drawId,
      mode: draw.mode,
      eligibleCount,
      projectedPrizePool: prizePool,
      simulatedAt: new Date(),
      status: 'completed',
      note: 'SIMULATION ONLY - No actual winners generated',
    };

    simulations.set(simulation.id, simulation);

    const updatedDraw: Draw = {
      ...draw,
      status: 'ready',
      totalParticipants: eligibleCount,
      prizePool,
      updatedAt: new Date(),
    };

    draws.set(drawId, updatedDraw);

    return { success: true, simulation };
  },

  async getPrizePool(drawId: string): Promise<{ fiveMatchPool: number; fourMatchPool: number; threeMatchPool: number; total: number } | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const draw = draws.get(drawId);
    return draw ? draw.prizePool : null;
  },

  async getEligibleSubscribers(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return 234;
  },

  async getDrawStatus(drawId: string): Promise<DrawStatus | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const draw = draws.get(drawId);
    return draw ? draw.status : null;
  },

  async checkUserEligibility(userId: string): Promise<DrawEligibility> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const subscription = await subscriptionService.getSubscription(userId);
    const scores = await scoreService.getScores(userId);
    
    return isEligibleForDraw(subscription, scores);
  },

  async getSimulation(drawId: string): Promise<DrawSimulation | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return Array.from(simulations.values()).find(s => s.drawId === drawId) || null;
  },

  async executeDraw(drawId: string): Promise<{ success: boolean; result?: DrawResult; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const draw = draws.get(drawId);
    if (!draw) {
      return { success: false, error: 'Draw not found' };
    }

    // Validate draw status
    if (draw.status === 'completed' || draw.status === 'published') {
      return { success: false, error: 'Draw has already been executed and cannot be run again' };
    }

    if (draw.status !== 'ready' && draw.status !== 'configuring') {
      return { success: false, error: `Draw must be in ready state to execute (current: ${draw.status})` };
    }

    // Check if already executed
    const existingResult = drawResults.get(drawId);
    if (existingResult) {
      return { success: true, result: existingResult };
    }

    // Generate draw numbers based on mode
    let drawNumbers: number[];
    if (draw.mode === 'random') {
      drawNumbers = generateRandomDrawNumbers();
    } else {
      // Algorithmic mode: collect all scores from eligible users
      const allScores: GolfScore[] = [];
      const users = await this._getEligibleUsers();
      
      for (const userId of users) {
        const userScores = await scoreService.getLatestScores(userId);
        allScores.push(...userScores);
      }
      
      drawNumbers = generateAlgorithmicDrawNumbers(allScores);
    }

    // Calculate results
    const resultData = await this._calculateDrawResults(drawId, drawNumbers);

    // Create draw result
    const result: DrawResult = {
      id: `result-${drawId}`,
      drawId,
      winningScores: drawNumbers,
      participantCount: resultData.participantCount,
      winners: resultData.winnerCounts,
      createdAt: new Date(),
    };

    drawResults.set(drawId, result);
    winners.set(drawId, resultData.winners);

    // Update draw status
    const updatedDraw: Draw = {
      ...draw,
      status: 'ready', // Ready for publishing
      updatedAt: new Date(),
    };
    draws.set(drawId, updatedDraw);

    return { success: true, result };
  },

  async publishDraw(drawId: string): Promise<{ success: boolean; draw?: Draw; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const draw = draws.get(drawId);
    if (!draw) {
      return { success: false, error: 'Draw not found' };
    }

    if (draw.status === 'published' || draw.status === 'completed') {
      // Idempotent: already published
      return { success: true, draw };
    }

    // Check if draw has been executed
    const result = drawResults.get(drawId);
    if (!result) {
      return { success: false, error: 'Draw must be executed before publishing' };
    }

    // Calculate rollover for next draw
    const drawWinners = winners.get(drawId) || [];
    const fiveMatchWinners = drawWinners.filter(w => w.matchType === '5-match').length;
    const rollover = calculateRollover(draw.prizePool.fiveMatchPool, fiveMatchWinners);

    // Update draw status
    const updatedDraw: Draw = {
      ...draw,
      status: 'published',
      completedAt: new Date(),
      updatedAt: new Date(),
    };
    draws.set(drawId, updatedDraw);

    // Store rollover for next draw (in production, this would be persisted)
    if (rollover > 0) {
      // In a real system, this would update the next draw's rolloverAmount
      console.log(`Rollover amount for next draw: ${rollover} pence`);
    }

    return { success: true, draw: updatedDraw };
  },

  async _getEligibleUsers(): Promise<string[]> {
    // In production, this would query all users with active subscriptions
    // For now, return mock user IDs
    return ['user-subscriber-1', 'user-1', 'user-2', 'user-3'];
  },

  async _calculateDrawResults(
    drawId: string,
    drawNumbers: number[]
  ): Promise<{
    participantCount: number;
    winnerCounts: { fiveMatch: number; fourMatch: number; threeMatch: number };
    winners: Winner[];
  }> {
    const eligibleUsers = await this._getEligibleUsers();
    const winners: Winner[] = [];
    
    const tierWinners: { [key: string]: string[] } = {
      '5-match': [],
      '4-match': [],
      '3-match': [],
    };

    // Process each eligible user
    for (const userId of eligibleUsers) {
      const eligibility = await this.checkUserEligibility(userId);
      if (!eligibility.isEligible) continue;

      const userScores = await scoreService.getLatestScores(userId);
      const userNumbers = getUserScoreValues(userScores);

      if (userNumbers.length === 0) continue;

      const matchCount = countMatches(userNumbers, drawNumbers);
      const tier = getMatchTier(matchCount);

      if (tier) {
        tierWinners[tier].push(userId);
      }
    }

    // Get draw for prize pool
    const draw = draws.get(drawId);
    if (!draw) throw new Error('Draw not found');

    // Calculate prizes for each tier
    const createWinners = (tier: '5-match' | '4-match' | '3-match', userIds: string[], poolAmount: number) => {
      if (userIds.length === 0) return [];
      
      const prizePerWinner = calculateTierPrize(poolAmount, userIds.length);
      
      return userIds.map(userId => ({
        id: `winner-${drawId}-${userId}-${Date.now()}`,
        drawId,
        userId,
        matchType: tier,
        prizeAmount: prizePerWinner,
        verificationStatus: 'pending' as const,
        payoutStatus: 'pending' as const,
        createdAt: new Date(),
      }));
    };

    const fiveMatchWinners = createWinners('5-match', tierWinners['5-match'], draw.prizePool.fiveMatchPool);
    const fourMatchWinners = createWinners('4-match', tierWinners['4-match'], draw.prizePool.fourMatchPool);
    const threeMatchWinners = createWinners('3-match', tierWinners['3-match'], draw.prizePool.threeMatchPool);

    return {
      participantCount: eligibleUsers.length,
      winnerCounts: {
        fiveMatch: tierWinners['5-match'].length,
        fourMatch: tierWinners['4-match'].length,
        threeMatch: tierWinners['3-match'].length,
      },
      winners: [...fiveMatchWinners, ...fourMatchWinners, ...threeMatchWinners],
    };
  },

  _resetForTesting() {
    draws.clear();
    drawResults.clear();
    winners.clear();
    simulations.clear();
    mockDraws.forEach(d => draws.set(d.id, d));
    mockDrawResults.forEach(r => drawResults.set(r.drawId, r));
  },
};
