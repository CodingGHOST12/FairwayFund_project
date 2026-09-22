import { Button } from '@/components/ui/Button';
import { GolfScore } from '@/types';
import { formatScoreDate } from '@/lib/utils/score';

type ScoreDeleteDialogProps = {
  score: GolfScore | null;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ScoreDeleteDialog({
  score,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: ScoreDeleteDialogProps) {
  if (!isOpen || !score) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 id="delete-dialog-title" className="text-xl font-bold text-gray-900 text-center mb-2">
          Delete this golf score?
        </h3>
        <p className="text-sm text-gray-600 text-center mb-6">
          Are you sure you want to delete the score of{' '}
          <strong className="text-gray-900">{score.stablefordScore} points</strong> from{' '}
          <strong className="text-gray-900">{formatScoreDate(score.date)}</strong>? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} loading={isLoading} className="flex-1">
            Delete Score
          </Button>
        </div>
      </div>
    </div>
  );
}
