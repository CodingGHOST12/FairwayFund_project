import Link from 'next/link';
import { Charity } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type CharityCardProps = {
  charity: Charity;
  isSelected?: boolean;
  onSelect?: (charityId: string) => void;
  showSelectAction?: boolean;
};

export function CharityCard({
  charity,
  isSelected = false,
  onSelect,
  showSelectAction = false,
}: CharityCardProps) {
  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
        isSelected
          ? 'border-2 border-green-600 shadow-md ring-2 ring-green-100'
          : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <div>
        <div className="h-44 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 flex items-center justify-center p-6 relative">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-white/90 shadow-sm flex items-center justify-center mx-auto mb-2 text-green-700">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-green-900 uppercase tracking-wider">{charity.category}</span>
          </div>

          <div className="absolute top-3 right-3 flex gap-1">
            {charity.isFeatured && (
              <Badge variant="success">Featured</Badge>
            )}
            {isSelected && (
              <Badge variant="info">Selected</Badge>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1.5">{charity.name}</h3>
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {charity.location}
          </p>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
            {charity.description}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0 space-y-2">
        {showSelectAction && onSelect ? (
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            className="w-full"
            onClick={() => onSelect(charity.id)}
          >
            {isSelected ? 'Currently Selected' : 'Choose This Charity'}
          </Button>
        ) : (
          <Link href={`/charities/${charity.id}`} className="block">
            <Button variant="outline" className="w-full">
              View Details &rarr;
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
