import { Button } from '@/components/ui/Button';

type ScoreEmptyStateProps = {
  onAddScore: () => void;
};

export function ScoreEmptyState({ onAddScore }: ScoreEmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 bg-white border border-dashed border-gray-300 rounded-2xl">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">No golf scores recorded</h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
        You haven't added any golf scores yet. Add your latest Stableford score to enter the monthly draw.
      </p>
      <Button onClick={onAddScore}>
        Add First Score
      </Button>
    </div>
  );
}
