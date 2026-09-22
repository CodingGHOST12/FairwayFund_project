import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign Up | FairwayFund',
  description: 'Create your FairwayFund account. Track your golf scores, support charities, and enter monthly prize draws.',
};

function SignupContent() {
  return (
    <Section>
      <Container size="sm">
        <div className="flex flex-col items-center animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
          <p className="text-gray-600 mb-8">Create your FairwayFund account</p>

          <SignupForm />

          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}

export default function SignupPage() {
  return (
    <AuthGuard>
      <SignupContent />
    </AuthGuard>
  );
}
