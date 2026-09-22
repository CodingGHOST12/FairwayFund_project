import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SubscriptionContent } from './SubscriptionContent';

export const metadata: Metadata = {
  title: 'Manage Subscription | FairwayFund',
  description: 'Manage your FairwayFund subscription plan and billing.',
};

export default function SubscriptionPage() {
  return (
    <AuthGuard requireAuth>
      <Section>
        <Container size="md">
          <SubscriptionContent />
        </Container>
      </Section>
    </AuthGuard>
  );
}