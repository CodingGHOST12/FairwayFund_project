import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ScoreManager } from '@/components/scores/ScoreManager';

export const metadata: Metadata = {
  title: 'Golf Scores | FairwayFund',
  description: 'Manage your active Stableford golf scores and track your latest rounds for the monthly prize draw.',
};

export default function ScoresPage() {
  return (
    <AuthGuard requireSubscriber>
      <Section background="gray">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Golf Scores</h1>
              <p className="text-gray-600 mt-1">
                FairwayFund automatically tracks your <strong>latest 5 Stableford scores</strong> (1–45 points).
                Adding a new score removes the oldest one, keeping your entry fresh for every monthly draw.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-900 flex items-start gap-3">
              <svg className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong className="font-semibold">The 5-Score Rule:</strong> Only one round per calendar date is allowed. When you add your 6th score, the oldest round automatically drops off so your draw entry always reflects your 5 most recent rounds.
              </div>
            </div>

            <ScoreManager />
          </div>
        </Container>
      </Section>
    </AuthGuard>
  );
}
