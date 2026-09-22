'use client';

import { charityConfig } from '@/lib/charity/charity-config';

type ContributionSelectorProps = {
  value: number;
  onChange: (percentage: number) => void;
  disabled?: boolean;
};

export function ContributionSelector({
  value,
  onChange,
  disabled = false,
}: ContributionSelectorProps) {
  return (
    <div className="space-y-4 p-5 bg-green-50 border border-green-200 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label htmlFor="contribution-slider" className="font-bold text-gray-900 text-sm block">
            Charity Contribution Percentage
          </label>
          <p className="text-xs text-green-900 mt-0.5">
            Minimum contribution is <strong>{charityConfig.minimumContributionPercentage}%</strong> of your subscription fee.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span className="text-2xl font-extrabold text-green-700">{value}%</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">of plan</span>
        </div>
      </div>

      <div className="space-y-2">
        <input
          id="contribution-slider"
          type="range"
          min={charityConfig.minimumContributionPercentage}
          max={charityConfig.maximumContributionPercentage}
          step={5}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          disabled={disabled}
          className="w-full accent-green-600 h-2 bg-green-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-500 font-medium px-1">
          <span>Min: {charityConfig.minimumContributionPercentage}%</span>
          <span>25%</span>
          <span>50%</span>
          <span>Max: {charityConfig.maximumContributionPercentage}%</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {charityConfig.presetPercentages.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              value === preset
                ? 'bg-green-700 text-white shadow-sm'
                : 'bg-white border border-green-300 text-green-900 hover:bg-green-100'
            }`}
          >
            {preset}%
          </button>
        ))}
      </div>
    </div>
  );
}
