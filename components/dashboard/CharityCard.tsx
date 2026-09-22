import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

type CharityCardProps = {
  charity?: {
    id: string;
    name: string;
    description: string;
  };
  onSelect?: () => void;
};

export function CharityCard({ charity, onSelect }: CharityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Charity</CardTitle>
      </CardHeader>
      <CardContent>
        {charity ? (
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-lg text-gray-900">{charity.name}</p>
              <p className="text-sm text-gray-600 mt-2">{charity.description}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/charities/${charity.id}`}>
                <Button variant="outline" size="sm">View Details</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={onSelect}>
                Change Charity
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">No charity selected yet</p>
            <Link href="/charities">
              <Button>Choose a Charity</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
