import { Button } from '@/components/ui/Button';

type ScoreErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function ScoreErrorState({ message = 'Failed to load scores', onRetry }: ScoreErrorStateProps) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h4 className="font-semibold text-red-900 mb-1">Unable to Load Scores</h4>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
