'use client';

import { charityConfig } from '@/lib/charity/charity-config';

type CharityFiltersProps = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
};

export function CharityFilters({
  selectedCategory,
  onCategoryChange,
  onReset,
  hasActiveFilters,
}: CharityFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-green-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Causes
        </button>

        {charityConfig.categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="text-xs font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors underline"
        >
          Reset
        </button>
      )}
    </div>
  );
}
