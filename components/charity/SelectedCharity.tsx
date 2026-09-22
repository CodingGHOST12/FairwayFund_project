import Link from 'next/link';
import { Charity, CharitySelection } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type SelectedCharityProps = {
  charity: Charity | null;
  selection: CharitySelection | null;
  onChangeClick?: () => void;
};

export function SelectedCharity({
  charity,
  selection,
  onChangeClick,
}: SelectedCharityProps) {
  if (!charity || !selection) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">No Charity Selected</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
            You haven't chosen a charity for your subscription yet. A minimum 10% contribution will support your chosen cause.
          </p>
        </div>
        <div className="pt-2">
          {onChangeClick ? (
            <Button onClick={onChangeClick}>Choose a Charity</Button>
          ) : (
            <Link href="/charity">
              <Button>Choose a Charity</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
              Active Selection
            </span>
            <Badge variant="default">{charity.category}</Badge>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 pt-1">{charity.name}</h3>
          <p className="text-xs text-gray-500">{charity.location} • Reg #{charity.registrationNumber}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center sm:text-right self-start">
          <span className="text-xs font-semibold text-green-900 block uppercase tracking-wider">Your Contribution</span>
          <span className="text-3xl font-black text-green-700">{selection.contributionPercentage}%</span>
          <span className="text-xs text-gray-500 block">of subscription fee</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">
        {charity.description}
      </p>

      <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/charities/${charity.id}`} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
          View Full Profile &rarr;
        </Link>
        {onChangeClick && (
          <Button variant="outline" size="sm" onClick={onChangeClick}>
            Change Charity / Percentage
          </Button>
        )}
      </div>
    </div>
  );
}
