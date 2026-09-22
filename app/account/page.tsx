'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionSummary } from '@/components/subscription/SubscriptionSummary';
import { Button } from '@/components/ui/Button';

function AccountContent() {
  const { user } = useAuth();
  const { subscription } = useSubscription();

  return (
    <Section>
      <Container size="sm">
        <div className="animate-fade-in space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
            <p className="text-gray-600">Manage your FairwayFund account and subscription</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="text-base font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-base font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Subscription</h2>
              <Link href="/subscription">
                <Button variant="outline" size="sm">Manage</Button>
              </Link>
            </div>
            <SubscriptionSummary subscription={subscription} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard requireAuth>
      <AccountContent />
    </AuthGuard>
  );
}