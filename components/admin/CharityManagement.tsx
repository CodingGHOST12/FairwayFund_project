import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '@/lib/utils/formatting';

type CharityManagementProps = {
  charities: Array<{
    id: string;
    name: string;
    category: string;
    isFeatured: boolean;
    totalContributions: number;
  }>;
};

export function CharityManagement({ charities }: CharityManagementProps) {
  return (
    <div className="space-y-4">
      {charities.map((charity) => (
        <div key={charity.id} className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{charity.name}</h3>
                {charity.isFeatured && <Badge variant="success">Featured</Badge>}
              </div>
              <p className="text-sm text-gray-600 mb-2">{charity.category}</p>
              <p className="text-sm text-gray-900">
                Total Contributions: <span className="font-semibold text-green-600">
                  {formatCurrency(charity.totalContributions)}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Edit</Button>
              <Button size="sm" variant="ghost">
                {charity.isFeatured ? 'Unfeature' : 'Feature'}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
