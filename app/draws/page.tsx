import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DrawsContent } from './DrawsContent';

export const metadata: Metadata = {
  title: 'Monthly Draw | FairwayFund',
  description: 'View the current monthly draw, prize pool, and your eligibility status.',
};

export default function DrawsPage() {
  return (
    <AuthGuard requireAuth>
      <Section background="gray">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full border border-green-200">
                Monthly Draw
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
                FairwayFund Draw
              </h1>
              <p className="text-gray-600 mt-1 text-base">
                Match your golf scores to win prizes while supporting great causes.
              </p>
            </div>

            <DrawsContent />
          </div>
        </Container>
      </Section>
    </AuthGuard>
  );
}
