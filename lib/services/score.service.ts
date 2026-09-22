import { GolfScore, CreateScoreInput, UpdateScoreInput } from '@/types';
import { mockScores } from '@/data/mock/scores';
import {
  sortScoresNewestFirst,
  removeOldestScoreIfNeeded,
  isValidStablefordScore,
} from '@/lib/utils/score';
import {
  validateNoDuplicateDate,
  parseDateOnly,
  scoreSchema,
} from '@/lib/validation/score.validation';

const inMemoryScores: Map<string, GolfScore[]> = new Map();

function initializeMockData() {
  if (inMemoryScores.size === 0) {
    mockScores.forEach((score) => {
      const userList = inMemoryScores.get(score.userId) || [];
      userList.push({
        ...score,
        date: score.date instanceof Date ? score.date : new Date(score.date),
        createdAt: score.createdAt instanceof Date ? score.createdAt : new Date(score.createdAt),
      });
      inMemoryScores.set(score.userId, sortScoresNewestFirst(userList));
    });
  }
}

initializeMockData();

export const scoreService = {
  async getScores(userId: string): Promise<GolfScore[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    initializeMockData();
    const userScores = inMemoryScores.get(userId) || [];
    return sortScoresNewestFirst(userScores);
  },

  async getLatestScores(userId: string): Promise<GolfScore[]> {
    const scores = await this.getScores(userId);
    return removeOldestScoreIfNeeded(scores, 5);
  },

  async getScoreById(userId: string, scoreId: string): Promise<GolfScore | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    initializeMockData();
    const userScores = inMemoryScores.get(userId) || [];
    const found = userScores.find((s) => s.id === scoreId);
    return found || null;
  },

  async addScore(
    userId: string,
    input: CreateScoreInput
  ): Promise<{ success: boolean; score?: GolfScore; scores?: GolfScore[]; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    initializeMockData();

    if (!isValidStablefordScore(input.stablefordScore)) {
      return { success: false, error: 'Stableford score must be a whole number between 1 and 45.' };
    }

    const validationResult = scoreSchema.safeParse({
      stablefordScore: input.stablefordScore,
      date: input.date,
      courseName: input.courseName,
    });

    if (!validationResult.success) {
      return { success: false, error: validationResult.error.errors[0]?.message || 'Invalid score data' };
    }

    const parsedDate = parseDateOnly(input.date);
    if (isNaN(parsedDate.getTime())) {
      return { success: false, error: 'Invalid calendar date' };
    }

    const currentScores = inMemoryScores.get(userId) || [];
    const duplicateCheck = validateNoDuplicateDate(parsedDate, currentScores);

    if (!duplicateCheck.valid) {
      return { success: false, error: duplicateCheck.error };
    }

    const newScore: GolfScore = {
      id: `score-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId,
      stablefordScore: input.stablefordScore,
      date: parsedDate,
      courseName: input.courseName?.trim() || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedScores = [newScore, ...currentScores];
    const sorted = sortScoresNewestFirst(updatedScores);
    const retained = removeOldestScoreIfNeeded(sorted, 5);

    inMemoryScores.set(userId, retained);

    return {
      success: true,
      score: newScore,
      scores: retained,
    };
  },

  async updateScore(
    userId: string,
    scoreId: string,
    input: UpdateScoreInput
  ): Promise<{ success: boolean; score?: GolfScore; scores?: GolfScore[]; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    initializeMockData();

    const currentScores = inMemoryScores.get(userId) || [];
    const existingIndex = currentScores.findIndex((s) => s.id === scoreId);

    if (existingIndex === -1) {
      return { success: false, error: 'Score not found or unauthorized' };
    }

    const existingScore = currentScores[existingIndex];

    const newStableford = input.stablefordScore !== undefined ? input.stablefordScore : existingScore.stablefordScore;
    if (!isValidStablefordScore(newStableford)) {
      return { success: false, error: 'Stableford score must be a whole number between 1 and 45.' };
    }

    const newDate = input.date ? parseDateOnly(input.date) : existingScore.date;
    if (isNaN(newDate.getTime())) {
      return { success: false, error: 'Invalid calendar date' };
    }

    const duplicateCheck = validateNoDuplicateDate(newDate, currentScores, scoreId);
    if (!duplicateCheck.valid) {
      return { success: false, error: duplicateCheck.error };
    }

    const updatedScore: GolfScore = {
      ...existingScore,
      stablefordScore: newStableford,
      date: newDate,
      courseName: input.courseName !== undefined ? input.courseName.trim() || undefined : existingScore.courseName,
      updatedAt: new Date(),
    };

    const newScoresList = [...currentScores];
    newScoresList[existingIndex] = updatedScore;

    const sorted = sortScoresNewestFirst(newScoresList);
    const retained = removeOldestScoreIfNeeded(sorted, 5);

    inMemoryScores.set(userId, retained);

    return {
      success: true,
      score: updatedScore,
      scores: retained,
    };
  },

  async deleteScore(
    userId: string,
    scoreId: string
  ): Promise<{ success: boolean; scores?: GolfScore[]; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    initializeMockData();

    const currentScores = inMemoryScores.get(userId) || [];
    const existingIndex = currentScores.findIndex((s) => s.id === scoreId);

    if (existingIndex === -1) {
      return { success: false, error: 'Score not found or unauthorized' };
    }

    const remainingScores = currentScores.filter((s) => s.id !== scoreId);
    inMemoryScores.set(userId, remainingScores);

    return {
      success: true,
      scores: remainingScores,
    };
  },

  _resetForTesting() {
    inMemoryScores.clear();
    initializeMockData();
  },
};
