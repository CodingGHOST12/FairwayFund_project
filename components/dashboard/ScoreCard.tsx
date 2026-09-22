import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatDate } from '@/lib/utils/date';

type ScoreCardProps = {
  scores: Array<{
    id: string;
    stablefordScore: number;
    date: Date;
    courseName?: string;
  }>;
};

export function ScoreCard({ scores }: ScoreCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Latest Scores</CardTitle>
      </CardHeader>
      <CardContent>
        {scores.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No scores yet</p>
        ) : (
          <div className="space-y-3">
            {scores.map((score) => (
              <div key={score.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{score.stablefordScore} points</p>
                  <p className="text-sm text-gray-500">{formatDate(score.date)}</p>
                  {score.courseName && (
                    <p className="text-xs text-gray-400">{score.courseName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
