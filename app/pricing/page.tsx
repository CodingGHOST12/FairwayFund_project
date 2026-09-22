'use client';

import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PlanSelector } from '@/components/subscription/PlanSelector';
import { SubscriptionPlan } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (isAuthenticated) {
      router.push('/subscription');
    } else {
      router.push(`/signup?plan=${plan}`);
    }
  };

  return (
    <>
      <Section background="green">
        <Container>
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Choose the plan that works for you. Cancel anytime.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-16">
            <PlanSelector onSelectPlan={handleSelectPlan} />
          </div>

          <div className="mt-16 max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              What's Included in Every Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Monthly Draw Entry',
                  desc: 'Automatic entry into every monthly draw with your latest 5 scores',
                },
                {
                  title: 'Charity Support',
                  desc: 'Minimum 10% of your subscription supports your chosen charity',
                },
                {
                  title: 'Score Tracking',
                  desc: 'Log and track your Stableford scores after every round',
                },
                {
                  title: 'Prize Opportunities',
                  desc: 'Win from 3-match, 4-match, or 5-match prize pools',
                },
                {
                  title: 'Change Charity',
                  desc: 'Switch your supported charity at any time',
                },
                {
                  title: 'Cancel Anytime',
                  desc: 'No long-term commitment. Cancel whenever you want.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}