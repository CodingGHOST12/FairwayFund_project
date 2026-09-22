import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div className="text-center py-16 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Charity Not Found</h1>
          <p className="text-gray-600 mb-8">
            The charity you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/charities">
            <Button>Browse All Charities</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
