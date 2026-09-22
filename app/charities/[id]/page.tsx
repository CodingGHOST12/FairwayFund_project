import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { CharityDetail } from '@/components/charity/CharityDetail';
import { charityService } from '@/lib/services/charity.service';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const charity = await charityService.getCharityById(params.id);

  if (!charity) {
    return {
      title: 'Charity Not Found | FairwayFund',
    };
  }

  return {
    title: `${charity.name} | FairwayFund`,
    description: charity.description,
  };
}

export default async function CharityDetailPage({ params }: { params: { id: string } }) {
  const charity = await charityService.getCharityById(params.id);

  if (!charity) {
    notFound();
  }

  return (
    <Section background="gray">
      <Container>
        <div className="space-y-6 animate-fade-in">
          <Link
            href="/charities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
          >
            &larr; Back to Charities Directory
          </Link>

          <CharityDetail charity={charity} />
        </div>
      </Container>
    </Section>
  );
}
