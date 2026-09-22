import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SidebarLayout } from '@/components/admin/SidebarLayout';
import { AdminDrawsContent } from './AdminDrawsContent';

export const metadata: Metadata = {
  title: 'Draw Management | Admin | FairwayFund',
  description: 'Manage monthly draws, configure prize pools, and simulate results.',
};

export default function AdminDrawsPage() {
  return (
    <AuthGuard requireAdmin>
      <SidebarLayout>
        <AdminDrawsContent />
      </SidebarLayout>
    </AuthGuard>
  );
}
