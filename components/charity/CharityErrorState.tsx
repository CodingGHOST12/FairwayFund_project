import { Button } from '@/components/ui/Button';

type CharityErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function CharityErrorState({
  message = 'Failed to load charities. Please try again.',
  onRetry,
}: CharityErrorStateProps) {
  return (
    <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center max-w-md mx-auto">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="font-bold text-red-900 mb-1">Error Loading Charities</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
