import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SidebarLayout } from '@/components/admin/SidebarLayout';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AnalyticsOverview } from '@/components/admin/AnalyticsOverview';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Reports & Analytics | Admin | FairwayFund',
  description: 'View system analytics and generate reports.',
};

export default function AdminReportsPage() {
  return (
    <AuthGuard requireAdmin>
      <SidebarLayout>
        <Section>
          <Container size="xl">
            <AdminHeader title="Reports & Analytics" subtitle="System analytics and performance metrics" />

            <AnalyticsOverview />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subscription Analytics */}
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Subscription Analytics</h3>
                <div className="p-8 text-center text-gray-500">
                  <p>No subscription data yet</p>
                </div>
              </Card>

              {/* Draw Statistics */}
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Draw Statistics</h3>
                <div className="p-8 text-center text-gray-500">
                  <p>No draw data yet</p>
                </div>
              </Card>

              {/* Charity Contributions */}
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Charity Contributions</h3>
                <div className="p-8 text-center text-gray-500">
                  <p>No charity contributions yet</p>
                </div>
              </Card>

              {/* Winner Statistics */}
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Winner Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Pending Verification', value: '0' },
                    { label: 'Verified', value: '0' },
                    { label: 'Rejected', value: '0' },
                    { label: 'Paid', value: '0' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{item.value}</div>
                      <div className="text-sm text-gray-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Activity Table */}
            <Card className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="p-8 text-center text-gray-500">
                <p>No activity yet</p>
              </div>
            </Card>
          </Container>
        </Section>
      </SidebarLayout>
    </AuthGuard>
  );
}
