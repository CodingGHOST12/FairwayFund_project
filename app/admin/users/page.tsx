import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SidebarLayout } from '@/components/admin/SidebarLayout';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { UserTable } from '@/components/admin/UserTable';

export const metadata: Metadata = {
  title: 'User Management | Admin | FairwayFund',
  description: 'Manage FairwayFund users and their accounts.',
};

export default function AdminUsersPage() {
  const users = [
    { id: 'user-subscriber-1', name: 'Test Subscriber', email: 'subscriber@example.local', role: 'user' as const, createdAt: new Date('2026-01-15') },
    { id: 'user-admin-1', name: 'Test Admin', email: 'admin@example.local', role: 'admin' as const, createdAt: new Date('2025-12-01') },
  ];

  return (
    <AuthGuard requireAdmin>
      <SidebarLayout>
        <Section>
          <Container>
            <AdminHeader title="User Management" subtitle="Manage user accounts and view activity" />

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Users</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <UserTable users={users} />
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">Showing {users.length} users</p>
              </div>
            </div>
          </Container>
        </Section>
      </SidebarLayout>
    </AuthGuard>
  );
}
