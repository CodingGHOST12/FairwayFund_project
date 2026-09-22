import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency } from '@/lib/utils/formatting';

type DrawCardProps = {
  month: string;
  year: number;
  drawDate: Date;
  prizePool: {
    total: number;
    fiveMatchPool: number;
    fourMatchPool: number;
    threeMatchPool: number;
  };
  isParticipating: boolean;
};

export function DrawCard({ month, year, drawDate, prizePool, isParticipating }: DrawCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Draw</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {month} {year}
            </p>
            <p className="text-sm text-gray-500">
              Draw date: {drawDate.toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Prize Pool</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(prizePool.total)}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">5-Match Pool:</span>
              <span className="font-semibold">{formatCurrency(prizePool.fiveMatchPool)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">4-Match Pool:</span>
              <span className="font-semibold">{formatCurrency(prizePool.fourMatchPool)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">3-Match Pool:</span>
              <span className="font-semibold">{formatCurrency(prizePool.threeMatchPool)}</span>
            </div>
          </div>

          {isParticipating ? (
            <div className="p-3 bg-green-50 text-green-800 rounded-lg text-sm text-center">
              You're entered in this draw!
            </div>
          ) : (
            <div className="p-3 bg-gray-50 text-gray-600 rounded-lg text-sm text-center">
              Add scores to enter this draw
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
