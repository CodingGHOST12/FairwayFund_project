import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { WinningsContent } from './WinningsContent';

export const metadata: Metadata = {
  title: 'My Winnings | FairwayFund',
  description: 'View your draw winnings and manage proof submissions.',
};

export default function WinningsPage() {
  return (
    <AuthGuard requireAuth>
      <Section background="gray">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full border border-green-200">
                My Winnings
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
                Prize Winnings
              </h1>
              <p className="text-gray-600 mt-1 text-base">
                Track your draws, submit proof, and manage payouts.
              </p>
            </div>

            <WinningsContent />
          </div>
        </Container>
      </Section>
    </AuthGuard>
  );
}
