'use client';

import { useState } from 'react';
import { useScores } from '@/hooks/useScores';
import { GolfScore, CreateScoreInput } from '@/types';
import { ScoreList } from './ScoreList';
import { ScoreForm } from './ScoreForm';
import { ScoreSummary } from './ScoreSummary';
import { ScoreEmptyState } from './ScoreEmptyState';
import { ScoreErrorState } from './ScoreErrorState';
import { ScoreLoading } from './ScoreLoading';
import { ScoreDeleteDialog } from './ScoreDeleteDialog';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function ScoreManager() {
  const { scores, isLoading, error, addScore, updateScore, deleteScore, refreshScores } = useScores();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<GolfScore | null>(null);
  const [deletingScore, setDeletingScore] = useState<GolfScore | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleAddSubmit = async (data: CreateScoreInput) => {
    const res = await addScore(data);
    if (res.success) {
      setIsAddOpen(false);
      showToast('Score added successfully! The 5-score limit has been updated.');
    }
    return res;
  };

  const handleEditSubmit = async (data: CreateScoreInput) => {
    if (!editingScore) return { success: false, error: 'No score selected for edit' };
    const res = await updateScore(editingScore.id, data);
    if (res.success) {
      setEditingScore(null);
      showToast('Score updated successfully.');
    }
    return res;
  };

  const handleDeleteConfirm = async () => {
    if (!deletingScore) return;
    setIsDeleting(true);
    try {
      const res = await deleteScore(deletingScore.id);
      if (res.success) {
        setDeletingScore(null);
        showToast('Score deleted.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <ScoreLoading />;
  }

  if (error) {
    return <ScoreErrorState message={error} onRetry={refreshScores} />;
  }

  return (
    <div className="space-y-6">
      {successToast && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-green-600 hover:text-green-800 text-xs">
            Dismiss
          </button>
        </div>
      )}

      <ScoreSummary scores={scores} />

      <div className="flex justify-between items-center pt-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Retained Scores</h2>
          <p className="text-sm text-gray-500">Sorted newest first. Only the most recent 5 scores are used in monthly draws.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Score
        </Button>
      </div>

      {scores.length === 0 ? (
        <ScoreEmptyState onAddScore={() => setIsAddOpen(true)} />
      ) : (
        <ScoreList
          scores={scores}
          onEdit={(score) => setEditingScore(score)}
          onDelete={(score) => setDeletingScore(score)}
        />
      )}

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Golf Score"
      >
        <div className="mb-4 text-sm text-gray-600">
          Enter your Stableford score from a recent round. If you already have 5 scores, the oldest one will be automatically replaced.
        </div>
        <ScoreForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddOpen(false)}
          isModal
        />
      </Modal>

      <Modal
        isOpen={editingScore !== null}
        onClose={() => setEditingScore(null)}
        title="Edit Golf Score"
      >
        {editingScore && (
          <ScoreForm
            initialScore={editingScore}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingScore(null)}
            isModal
          />
        )}
      </Modal>

      <ScoreDeleteDialog
        score={deletingScore}
        isOpen={deletingScore !== null}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingScore(null)}
      />
    </div>
  );
}
