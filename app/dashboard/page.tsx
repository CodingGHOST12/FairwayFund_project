'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useScores } from '@/hooks/useScores';
import { useCharitySelection } from '@/hooks/useCharitySelection';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';
import { Button } from '@/components/ui/Button';
import { formatScoreDate } from '@/lib/utils/score';

function DashboardContent() {
  const { user } = useAuth();
  const { subscription, isActive } = useSubscription();
  const { scores, isLoading: scoresLoading } = useScores();
  const { selectedCharity, selection, isLoading: charityLoading } = useCharitySelection();

  const activeCount = scores.length;
  const latestScore = scores[0];

  return (
    <Section>
      <Container>
        <div className="animate-fade-in space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600">Track your scores, draws, and charitable impact.</p>
            </div>
            <div className="flex items-center gap-3">
              <SubscriptionStatus subscription={subscription} />
              <Link href="/subscription">
                <Button variant="outline" size="sm">Manage Plan</Button>
              </Link>
            </div>
          </div>

          {!isActive && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-amber-900">No Active Subscription</h4>
                <p className="text-sm text-amber-700">
                  Subscribe to participate in monthly draws and support your chosen charity.
                </p>
              </div>
              <Link href="/pricing">
                <Button size="sm" className="whitespace-nowrap">Choose a Plan</Button>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Golf Scores Summary Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 font-semibold text-xs rounded-full">
                    {activeCount} / 5 rounds
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">Golf Scores</h3>
                
                {scoresLoading ? (
                  <p className="text-xs text-gray-400 py-2">Loading scores...</p>
                ) : activeCount === 0 ? (
                  <p className="text-sm text-gray-500 mb-4">No scores added yet. Log your rounds to qualify for monthly draws.</p>
                ) : (
                  <div className="space-y-2 my-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Latest round:</span>
                      <span className="font-bold text-green-700">{latestScore.stablefordScore} pts ({formatScoreDate(latestScore.date)})</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      {scores.map((s) => (
                        <span
                          key={s.id}
                          className="w-8 h-8 rounded-lg bg-green-50 text-green-800 border border-green-200 text-xs font-bold flex items-center justify-center"
                          title={`${s.stablefordScore} pts on ${formatScoreDate(s.date)}`}
                        >
                          {s.stablefordScore}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link href="/scores" className="text-green-600 hover:text-green-700 font-semibold text-sm">
                  Manage Scores &rarr;
                </Link>
                <Link href="/scores">
                  <Button size="sm" variant="outline">
                    + Add Score
                  </Button>
                </Link>
              </div>
            </div>

            {/* Charity Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  {selection && (
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 font-semibold text-xs rounded-full">
                      {selection.contributionPercentage}% contribution
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">Your Charity</h3>

                {charityLoading ? (
                  <p className="text-xs text-gray-400 py-2">Loading charity...</p>
                ) : selectedCharity ? (
                  <div className="space-y-2 my-2">
                    <p className="font-bold text-gray-900 text-base">{selectedCharity.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{selectedCharity.description}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">
                    Choose a verified cause to receive your monthly subscription contribution.
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link href="/charity" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
                  {selectedCharity ? 'Manage Charity \u2192' : 'Choose Charity \u2192'}
                </Link>
                <Link href="/charities" className="text-xs text-gray-400 hover:text-gray-600">
                  Directory
                </Link>
              </div>
            </div>

            {/* Winnings Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-semibold text-xs rounded-full">
                    Winnings
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">Prize Winnings</h3>
                
                {/* Winnings summary would go here */}
                <p className="text-sm text-gray-500 mb-4">
                  View your prize winnings and manage verification.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link href="/winnings" className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                  View Winnings &rarr;
                </Link>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Monthly Draw</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {isActive
                    ? activeCount >= 1
                      ? `Eligible! Your ${activeCount} active round${activeCount === 1 ? '' : 's'} are entered.`
                      : 'Add at least one round to enter the upcoming draw.'
                    : 'Subscribe to become eligible for monthly prize pools.'}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link href="/draws" className="text-teal-600 hover:text-teal-700 font-semibold text-sm">
                  View Draw Details &rarr;
                </Link>
                <Link href="/how-it-works" className="text-xs text-gray-400 hover:text-gray-600">
                  Rules
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard requireSubscriber>
      <DashboardContent />
    </AuthGuard>
  );
}
