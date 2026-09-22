import { Button } from '@/components/ui/Button';

type DrawEmptyStateProps = {
  message?: string;
  onAction?: () => void;
  actionLabel?: string;
};

export function DrawEmptyState({ 
  message = 'No draws available at the moment',
  onAction,
  actionLabel = 'Create Draw'
}: DrawEmptyStateProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Draw</h3>
      <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
        {message}
      </p>
      {onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
