import { Charity } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

type CharityHeroProps = {
  charity: Charity;
  onSelectCTA?: () => void;
};

export function CharityHero({ charity, onSelectCTA }: CharityHeroProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 h-64 sm:h-80 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center p-6 text-center">
          <div>
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center mx-auto mb-3 text-green-700 shadow-sm">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="font-bold text-green-950 text-base">{charity.category}</p>
            <p className="text-xs text-green-800 mt-1">{charity.location}</p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">{charity.category}</Badge>
            {charity.isFeatured && <Badge variant="success">Featured</Badge>}
            <span className="text-xs text-gray-400">Reg: {charity.registrationNumber}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {charity.name}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            {charity.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            {onSelectCTA ? (
              <Button size="lg" onClick={onSelectCTA}>
                Select for Subscription
              </Button>
            ) : (
              <Link href={`/charity?select=${charity.id}`}>
                <Button size="lg">
                  Choose for Subscription
                </Button>
              </Link>
            )}

            {charity.website && (
              <a href={charity.website} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  Visit Website &rarr;
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
