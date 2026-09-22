'use client';

import { useState, useMemo } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { CharityGrid } from '@/components/charity/CharityGrid';
import { CharitySearch } from '@/components/charity/CharitySearch';
import { CharityFilters } from '@/components/charity/CharityFilters';
import { FeaturedCharity } from '@/components/charity/FeaturedCharity';
import { CharityEmptyState } from '@/components/charity/CharityEmptyState';
import { CharityLoading } from '@/components/charity/CharityLoading';
import { CharityErrorState } from '@/components/charity/CharityErrorState';
import { useCharities } from '@/hooks/useCharities';
import { searchCharities, filterCharities } from '@/lib/charity/charity-utils';

export default function CharitiesPage() {
  const { charities, featuredCharity, isLoading, error, refreshCharities } = useCharities();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredList = useMemo(() => {
    let list = charities;
    if (searchQuery.trim()) {
      list = searchCharities(list, searchQuery);
    }
    if (selectedCategory !== 'all') {
      list = filterCharities(list, { category: selectedCategory });
    }
    return list;
  }, [charities, searchQuery, selectedCategory]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all';

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <>
      <Section background="green">
        <Container>
          <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in">
            <span className="px-3.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider">
              Charity Directory
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Play Golf. Support Great Causes.
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every FairwayFund subscription dedicates at least <strong>10%</strong> directly to a verified charity of your choice. Explore our partners or search by cause and region.
            </p>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="space-y-10">
            {featuredCharity && !hasActiveFilters && (
              <div className="mb-12">
                <FeaturedCharity charity={featuredCharity} />
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-6">
                  <CharitySearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                  />
                </div>
                <div className="lg:col-span-6">
                  <CharityFilters
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    onReset={handleReset}
                    hasActiveFilters={hasActiveFilters}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
                <span>
                  Showing <strong>{filteredList.length}</strong> of <strong>{charities.length}</strong> causes
                </span>
                {hasActiveFilters && (
                  <button onClick={handleReset} className="text-green-700 font-semibold hover:underline">
                    Clear all filters
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <CharityLoading />
            ) : error ? (
              <CharityErrorState message={error} onRetry={refreshCharities} />
            ) : filteredList.length === 0 ? (
              <CharityEmptyState onClearFilters={handleReset} />
            ) : (
              <CharityGrid charities={filteredList} />
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
