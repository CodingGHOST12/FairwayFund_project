import { GolfScore } from '@/types';
import { formatScoreDate } from '@/lib/utils/score';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

type ScoreCardProps = {
  score: GolfScore;
  onEdit?: (score: GolfScore) => void;
  onDelete?: (score: GolfScore) => void;
};

export function ScoreCard({ score, onEdit, onDelete }: ScoreCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium">Round Date</span>
          <span className="font-semibold text-gray-900">{formatScoreDate(score.date)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-extrabold text-green-600">{score.stablefordScore}</span>
            <span className="text-xs text-gray-500 ml-1">Stableford pts</span>
            {score.courseName && (
              <p className="text-xs text-gray-500 mt-1 truncate">{score.courseName}</p>
            )}
          </div>
          {(onEdit || onDelete) && (
            <div className="flex gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(score)}
                  className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                  aria-label="Edit score"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(score)}
                  className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                  aria-label="Delete score"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
