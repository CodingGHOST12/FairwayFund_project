'use client';

import { useState } from 'react';
import { useCharities } from '@/hooks/useCharities';
import { useCharitySelection } from '@/hooks/useCharitySelection';
import { SelectedCharity } from '@/components/charity/SelectedCharity';
import { CharitySelector } from '@/components/charity/CharitySelector';
import { CharitySelectionSuccess } from '@/components/charity/CharitySelectionSuccess';
import { CharityLoading } from '@/components/charity/CharityLoading';
import { CharityErrorState } from '@/components/charity/CharityErrorState';
import { Button } from '@/components/ui/Button';

export function CharityManagementContent() {
  const { charities, isLoading: charitiesLoading, error: charitiesError, refreshCharities } = useCharities();
  const {
    selectedCharity,
    selection,
    isLoading: selectionLoading,
    error: selectionError,
    selectCharity,
    refreshSelection,
  } = useCharitySelection();

  const [isEditing, setIsEditing] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ charityName: string; percentage: number } | null>(null);

  const isLoading = charitiesLoading || selectionLoading;
  const error = charitiesError || selectionError;

  if (isLoading) {
    return <CharityLoading />;
  }

  if (error) {
    return (
      <CharityErrorState
        message={error}
        onRetry={() => {
          refreshCharities();
          refreshSelection();
        }}
      />
    );
  }

  const handleConfirm = async (charityId: string, percentage: number) => {
    const res = await selectCharity(charityId, percentage);
    if (res.success) {
      const chosen = charities.find((c) => c.id === charityId);
      setSuccessInfo({
        charityName: chosen ? chosen.name : 'Selected Charity',
        percentage,
      });
      setIsEditing(false);
    }
    return res;
  };

  if (successInfo && selectedCharity) {
    return (
      <CharitySelectionSuccess
        charity={selectedCharity}
        percentage={successInfo.percentage}
        onDone={() => setSuccessInfo(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Selection Card */}
      <SelectedCharity
        charity={selectedCharity}
        selection={selection}
        onChangeClick={() => setIsEditing(!isEditing)}
      />

      {/* Editor Section */}
      {(isEditing || !selectedCharity) && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCharity ? 'Update Charity & Contribution' : 'Choose Your Cause'}
              </h2>
              <p className="text-xs text-gray-500">
                Pick from our verified charity directory and configure your contribution percentage.
              </p>
            </div>
            {selectedCharity && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
          </div>

          <CharitySelector
            charities={charities}
            selectedCharityId={selection?.charityId}
            initialPercentage={selection?.contributionPercentage || 10}
            onConfirm={handleConfirm}
          />
        </div>
      )}
    </div>
  );
}
