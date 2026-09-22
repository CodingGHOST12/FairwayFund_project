import { GolfScore } from '@/types';
import { formatScoreDate } from '@/lib/utils/score';
import { Button } from '@/components/ui/Button';

type ScoreRowProps = {
  score: GolfScore;
  index: number;
  onEdit: (score: GolfScore) => void;
  onDelete: (score: GolfScore) => void;
};

export function ScoreRow({ score, index, onEdit, onDelete }: ScoreRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors gap-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-green-50 text-green-700 font-bold flex items-center justify-center flex-shrink-0 text-base border border-green-200">
          {score.stablefordScore}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{formatScoreDate(score.date)}</span>
            {index === 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                Latest
              </span>
            )}
          </div>
          {score.courseName && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {score.courseName}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(score)}
          aria-label={`Edit score of ${score.stablefordScore} points from ${formatScoreDate(score.date)}`}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(score)}
          aria-label={`Delete score of ${score.stablefordScore} points from ${formatScoreDate(score.date)}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
