import { GolfScore } from '@/types';
import { normalizeDateOnly } from '@/lib/validation/score.validation';

export function isValidStablefordScore(score: unknown): boolean {
  if (typeof score !== 'number') return false;
  return Number.isInteger(score) && score >= 1 && score <= 45;
}

export function sortScoresNewestFirst(scores: GolfScore[]): GolfScore[] {
  return [...scores].sort((a, b) => {
    const timeA = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
    const timeB = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
    return timeB - timeA;
  });
}

export function retainLatestFiveScores(scores: GolfScore[]): GolfScore[] {
  const sorted = sortScoresNewestFirst(scores);
  return sorted.slice(0, 5);
}

export function keepLatestFiveScores(scores: GolfScore[]): GolfScore[] {
  return retainLatestFiveScores(scores);
}

export function removeOldestScoreIfNeeded(scores: GolfScore[], maxLimit = 5): GolfScore[] {
  const sorted = sortScoresNewestFirst(scores);
  return sorted.slice(0, maxLimit);
}

export function findScoreByDate(scores: GolfScore[], targetDate: Date | string): GolfScore | undefined {
  const targetNorm = normalizeDateOnly(targetDate);
  if (!targetNorm) return undefined;
  return scores.find((s) => normalizeDateOnly(s.date) === targetNorm);
}

export function hasDuplicateScoreDate(
  scores: GolfScore[],
  targetDate: Date | string,
  excludeScoreId?: string
): boolean {
  const targetNorm = normalizeDateOnly(targetDate);
  if (!targetNorm) return false;
  return scores.some((s) => {
    if (excludeScoreId && s.id === excludeScoreId) return false;
    return normalizeDateOnly(s.date) === targetNorm;
  });
}

export function calculateAverageScore(scores: GolfScore[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score.stablefordScore, 0);
  return Math.round(sum / scores.length);
}

export function formatScoreDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}
