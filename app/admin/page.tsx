import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SidebarLayout } from '@/components/admin/SidebarLayout';
import { AdminOverview } from '@/components/admin/AdminOverview';

export const metadata: Metadata = {
  title: 'Admin Overview | FairwayFund',
  description: 'FairwayFund admin dashboard with system statistics and quick actions.',
};

export default function AdminPage() {
  return (
    <AuthGuard requireAdmin>
      <SidebarLayout>
        <Section>
          <Container size="xl">
            <div className="animate-fade-in">
              <AdminOverview />
            </div>
          </Container>
        </Section>
      </SidebarLayout>
    </AuthGuard>
  );
}
