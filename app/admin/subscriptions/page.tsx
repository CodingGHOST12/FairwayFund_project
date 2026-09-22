import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SidebarLayout } from '@/components/admin/SidebarLayout';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SubscriptionTable } from '@/components/admin/SubscriptionTable';

export const metadata: Metadata = {
  title: 'Subscription Management | Admin | FairwayFund',
  description: 'Manage FairwayFund subscriptions and billing.',
};

export default function AdminSubscriptionsPage() {
  const subscriptions: Array<{
    id: string;
    userName: string;
    plan: 'monthly' | 'yearly';
    status: 'active' | 'cancelled' | 'expired';
    currentPeriodEnd: Date;
  }> = [];

  return (
    <AuthGuard requireAdmin>
      <SidebarLayout>
        <Section>
          <Container>
            <AdminHeader title="Subscription Management" subtitle="Manage subscriptions and billing" />

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Subscriptions</h3>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Cancelled</option>
                    <option>Expired</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>All Plans</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>
              </div>
              {subscriptions.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-lg">No subscriptions yet</p>
                  <p className="text-sm mt-2">Subscriptions will appear here once users subscribe</p>
                </div>
              ) : (
                <>
                  <SubscriptionTable subscriptions={subscriptions} />
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Showing {subscriptions.length} subscriptions</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Previous</button>
                      <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Next</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Container>
        </Section>
      </SidebarLayout>
    </AuthGuard>
  );
}
