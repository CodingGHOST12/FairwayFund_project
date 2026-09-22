import { DrawEligibility as DrawEligibilityType } from '@/types';
import { getEligibilityMessage } from '@/lib/draw/draw-eligibility';

type DrawEligibilityProps = {
  eligibility: DrawEligibilityType;
};

export function DrawEligibility({ eligibility }: DrawEligibilityProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Your Draw Eligibility</h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            eligibility.hasActiveSubscription 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {eligibility.hasActiveSubscription ? '✓' : '✕'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Subscription</p>
            <p className="text-xs text-gray-500">
              {eligibility.hasActiveSubscription ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            eligibility.hasRequiredScores 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {eligibility.hasRequiredScores ? '✓' : '✕'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Golf Scores</p>
            <p className="text-xs text-gray-500">
              {eligibility.scoreCount} score{eligibility.scoreCount !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg border ${
        eligibility.isEligible 
          ? 'bg-green-50 border-green-200' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <p className={`text-sm font-semibold ${
          eligibility.isEligible ? 'text-green-900' : 'text-amber-900'
        }`}>
          {getEligibilityMessage(eligibility)}
        </p>
      </div>
    </div>
  );
}
