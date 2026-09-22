import { GolfScore } from '@/types';
import { calculateAverageScore, formatScoreDate } from '@/lib/utils/score';

type ScoreSummaryProps = {
  scores: GolfScore[];
};

export function ScoreSummary({ scores }: ScoreSummaryProps) {
  const count = scores.length;
  const average = calculateAverageScore(scores);
  const latestScore = scores[0];
  const oldestScore = count > 0 ? scores[count - 1] : undefined;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Active Slots</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{count}</span>
          <span className="text-sm text-gray-400 font-medium">/ 5</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {count === 5 ? 'Max capacity reached' : `${5 - count} slot${5 - count === 1 ? '' : 's'} available`}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Average Score</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-green-600">{count > 0 ? average : '-'}</span>
          {count > 0 && <span className="text-xs text-gray-500 font-normal">pts</span>}
        </div>
        <p className="text-xs text-gray-500 mt-1">Across latest {count} round{count === 1 ? '' : 's'}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Latest Round</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{latestScore ? latestScore.stablefordScore : '-'}</span>
          {latestScore && <span className="text-xs text-gray-500 font-normal">pts</span>}
        </div>
        <p className="text-xs text-gray-500 mt-1 truncate">
          {latestScore ? formatScoreDate(latestScore.date) : 'No scores'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Oldest Retained</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{oldestScore ? oldestScore.stablefordScore : '-'}</span>
          {oldestScore && <span className="text-xs text-gray-500 font-normal">pts</span>}
        </div>
        <p className="text-xs text-gray-500 mt-1 truncate">
          {count === 5 ? 'Replaced on next entry' : oldestScore ? formatScoreDate(oldestScore.date) : 'No scores'}
        </p>
      </div>
    </div>
  );
}
