import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SidebarLayout } from '@/components/admin/SidebarLayout';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CharityManagement } from '@/components/admin/CharityManagement';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Charity Management | Admin | FairwayFund',
  description: 'Manage charities and their featured status.',
};

export default function AdminCharitiesPage() {
  const mockCharities = [
    { id: 'charity-1', name: 'Greenside Foundation', category: 'Youth Sports', isFeatured: true, totalContributions: 12450 },
    { id: 'charity-2', name: 'Fairway to Health', category: 'Health & Wellbeing', isFeatured: false, totalContributions: 8920 },
    { id: 'charity-3', name: 'Birdie Scholars', category: 'Education', isFeatured: false, totalContributions: 15680 },
    { id: 'charity-4', name: 'Golf for All', category: 'Disability Support', isFeatured: true, totalContributions: 10330 },
    { id: 'charity-5', name: 'The Green Mile', category: 'Community', isFeatured: false, totalContributions: 6240 },
    { id: 'charity-6', name: 'Par for the Planet', category: 'Environment', isFeatured: false, totalContributions: 9150 },
  ];

  return (
    <AuthGuard requireAdmin>
      <SidebarLayout>
        <Section>
          <Container>
            <AdminHeader title="Charity Management" subtitle="Manage charities and featured status" />

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Search charities..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>All Categories</option>
                {['Youth Sports', 'Health & Wellbeing', 'Education', 'Disability Support', 'Community', 'Environment'].map(cat => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <CharityManagement charities={mockCharities} />
          </Container>
        </Section>
      </SidebarLayout>
    </AuthGuard>
  );
}
