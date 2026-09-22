import { Hero } from '@/components/marketing/Hero';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { PlayGiveWin } from '@/components/marketing/PlayGiveWin';
import { ScoreExplanation } from '@/components/marketing/ScoreExplanation';
import { DrawExplanation } from '@/components/marketing/DrawExplanation';
import { CharitySpotlight } from '@/components/marketing/CharitySpotlight';
import { SubscriptionCTA } from '@/components/marketing/SubscriptionCTA';
import { Section } from '@/components/layout/Section';

export default function HomePage() {
  return (
    <>
      <Hero />
      
      <Section background="white" padding="lg">
        <HowItWorks />
      </Section>

      <Section background="gray" padding="lg">
        <PlayGiveWin />
      </Section>

      <Section background="white" padding="lg">
        <ScoreExplanation />
      </Section>

      <Section background="green" padding="lg">
        <DrawExplanation />
      </Section>

      <Section background="white" padding="lg">
        <CharitySpotlight />
      </Section>

      <SubscriptionCTA />
    </>
  );
}
