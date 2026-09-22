import { Charity } from '@/types';
import { Button } from '@/components/ui/Button';

type CharitySelectionSuccessProps = {
  charity: Charity;
  percentage: number;
  onDone: () => void;
};

export function CharitySelectionSuccess({
  charity,
  percentage,
  onDone,
}: CharitySelectionSuccessProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 text-center max-w-lg mx-auto animate-fade-in space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Charity Selection Saved!</h3>
        <p className="text-sm text-gray-600">
          You have selected <strong className="text-gray-900">{charity.name}</strong> to receive{' '}
          <strong className="text-green-700">{percentage}%</strong> of your FairwayFund subscription.
        </p>
      </div>

      <div className="p-4 bg-green-50 rounded-2xl text-xs text-green-900 text-left space-y-1.5 border border-green-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-600"></span>
          <span>Charity: {charity.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-600"></span>
          <span>Contribution rate: {percentage}% of subscription fee</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-600"></span>
          <span>Category: {charity.category}</span>
        </div>
      </div>

      <Button onClick={onDone} className="w-full" size="lg">
        Return to Charity Overview
      </Button>
    </div>
  );
}
