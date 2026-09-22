import Link from 'next/link';
import { Charity } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type FeaturedCharityProps = {
  charity: Charity;
};

export function FeaturedCharity({ charity }: FeaturedCharityProps) {
  return (
    <div className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold uppercase tracking-wider border border-green-500/30">
            Featured Partner
          </span>
          <Badge variant="default" className="bg-white/10 text-white border-white/20">
            {charity.category}
          </Badge>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          {charity.name}
        </h2>

        <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-6">
          {charity.longDescription}
        </p>

        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-emerald-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{charity.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Reg: {charity.registrationNumber}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href={`/charities/${charity.id}`}>
            <Button size="lg" className="bg-green-500 hover:bg-green-400 text-gray-950 font-bold border-none">
              View Charity Profile &rarr;
            </Button>
          </Link>
          <Link href="/charity">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Select for Subscription
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
