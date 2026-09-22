import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SidebarLayout } from '@/components/admin/SidebarLayout';
import { AdminWinnersContent } from './AdminWinnersContent';

export const metadata: Metadata = {
  title: 'Winner Management | Admin | FairwayFund',
  description: 'Review and manage winner proofs and payouts.',
};

export default function AdminWinnersPage() {
  return (
    <AuthGuard requireAdmin>
      <SidebarLayout>
        <AdminWinnersContent />
      </SidebarLayout>
    </AuthGuard>
  );
}
