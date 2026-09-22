import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export default function AppEntryPage() {
  return (
    <Section>
      <Container>
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to FairwayFund
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            This is your application entry point
          </p>
          <p className="text-gray-500">
            Future authenticated application shell will be here
          </p>
        </div>
      </Container>
    </Section>
  );
}
