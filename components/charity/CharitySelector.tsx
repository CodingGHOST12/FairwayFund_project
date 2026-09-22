'use client';

import { useState } from 'react';
import { Charity } from '@/types';
import { ContributionSelector } from './ContributionSelector';
import { charityConfig } from '@/lib/charity/charity-config';
import { Button } from '@/components/ui/Button';

type CharitySelectorProps = {
  charities: Charity[];
  selectedCharityId?: string;
  initialPercentage?: number;
  onConfirm: (charityId: string, percentage: number) => Promise<{ success: boolean; error?: string }>;
  isSubmitting?: boolean;
};

export function CharitySelector({
  charities,
  selectedCharityId: initialCharityId,
  initialPercentage = charityConfig.minimumContributionPercentage,
  onConfirm,
  isSubmitting = false,
}: CharitySelectorProps) {
  const [selectedCharityId, setSelectedCharityId] = useState<string>(
    initialCharityId || (charities[0] ? charities[0].id : '')
  );
  const [percentage, setPercentage] = useState<number>(initialPercentage);
  const [error, setError] = useState<string | null>(null);

  const selectedCharity = charities.find((c) => c.id === selectedCharityId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharityId) {
      setError('Please select a charity');
      return;
    }

    setError(null);
    const res = await onConfirm(selectedCharityId, percentage);
    if (!res.success) {
      setError(res.error || 'Failed to update selection');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="charity-dropdown-select" className="block text-sm font-bold text-gray-900 mb-2">
          1. Select Supported Charity
        </label>
        <select
          id="charity-dropdown-select"
          value={selectedCharityId}
          onChange={(e) => setSelectedCharityId(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm font-medium"
        >
          {charities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.category}) — {c.location}
            </option>
          ))}
        </select>
      </div>

      {selectedCharity && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold flex-shrink-0">
            ✓
          </div>
          <div>
            <strong className="text-gray-900 font-semibold block text-sm">{selectedCharity.name}</strong>
            <p className="mt-0.5">{selectedCharity.description}</p>
          </div>
        </div>
      )}

      <div>
        <span className="block text-sm font-bold text-gray-900 mb-2">
          2. Set Contribution Percentage
        </span>
        <ContributionSelector
          value={percentage}
          onChange={(p) => setPercentage(p)}
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        Save Charity Selection
      </Button>
    </form>
  );
}
