import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';

export default function SubscriptionSuccessPage() {
  return (
    <Section>
      <Container size="sm">
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Subscription Confirmed!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your development subscription is now active. You have full access to enter scores, 
            support your chosen charity, and participate in monthly draws.
          </p>

          <div className="p-4 bg-gray-50 rounded-lg max-w-xs mx-auto mb-8 text-left text-sm text-gray-600 space-y-2">
            <div className="flex items-center text-green-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Draw participation active
            </div>
            <div className="flex items-center text-green-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Charity contribution enabled
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">Go to Dashboard</Button>
            </Link>
            <Link href="/subscription">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Manage Plan</Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}