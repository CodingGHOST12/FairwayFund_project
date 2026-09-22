import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login | FairwayFund',
  description: 'Login to your FairwayFund account to track scores, support charities, and enter prize draws.',
};

function LoginContent() {
  return (
    <Section>
      <Container size="sm">
        <div className="flex flex-col items-center animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-8">Login to your FairwayFund account</p>

          <LoginForm />

          <p className="mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}

export default function LoginPage() {
  return (
    <AuthGuard>
      <LoginContent />
    </AuthGuard>
  );
}
