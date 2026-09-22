import { Button } from '@/components/ui/Button';

type CharityEmptyStateProps = {
  message?: string;
  onClearFilters?: () => void;
};

export function CharityEmptyState({
  message = 'No charities match your current search or filters.',
  onClearFilters,
}: CharityEmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 bg-white border border-dashed border-gray-300 rounded-2xl max-w-lg mx-auto">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">No Charities Found</h3>
      <p className="text-sm text-gray-500 mb-6">{message}</p>
      {onClearFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Search & Filters
        </Button>
      )}
    </div>
  );
}
