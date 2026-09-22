import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { CharityManagementContent } from './CharityManagementContent';

export const metadata: Metadata = {
  title: 'My Charity | FairwayFund',
  description: 'Manage your chosen charity organization and contribution percentage.',
};

export default function CharityPage() {
  return (
    <AuthGuard requireSubscriber>
      <Section background="gray">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full border border-green-200">
                Charity Selection
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
                Your Supported Charity
              </h1>
              <p className="text-gray-600 mt-1 text-base">
                Select the charitable cause you wish to support. A minimum of <strong>10%</strong> of your FairwayFund subscription fee goes directly to your selection, with the option to voluntarily increase your contribution percentage anytime.
              </p>
            </div>

            <CharityManagementContent />
          </div>
        </Container>
      </Section>
    </AuthGuard>
  );
}
