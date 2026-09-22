import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export const metadata: Metadata = {
  title: 'How It Works | FairwayFund',
  description: 'Learn how FairwayFund works: subscribe, track your golf scores, support charities, and enter monthly prize draws.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: 'Subscribe',
      description: 'Choose between monthly or yearly subscription plans. Your subscription supports charities and gives you draw entry.',
      details: [
        'Pick your subscription plan',
        'Select a charity to support',
        'Minimum 10% goes to your chosen charity',
      ],
    },
    {
      step: 2,
      title: 'Choose Your Charity',
      description: 'Browse our verified charities and select the one that matters most to you.',
      details: [
        'Browse verified charities',
        'Read about their impact',
        'Change your charity anytime',
      ],
    },
    {
      step: 3,
      title: 'Play Golf & Add Scores',
      description: 'Log your Stableford scores after each round. Your latest 5 scores are kept for the draw.',
      details: [
        'Scores must be between 1-45 points',
        'One score per date',
        'Keep playing to maintain 5 active scores',
      ],
    },
    {
      step: 4,
      title: 'Monthly Draw',
      description: 'Every month, 5 winning scores are drawn. Match them to win from the prize pools.',
      details: [
        '5-Match Prize: 40% of pool',
        '4-Match Prize: 35% of pool',
        '3-Match Prize: 25% of pool',
      ],
    },
    {
      step: 5,
      title: 'Winner Verification',
      description: 'Winners submit proof of their scores for verification before receiving prizes.',
      details: [
        'Submit scorecard or club verification',
        'Quick review process',
        'Fair and transparent',
      ],
    },
    {
      step: 6,
      title: 'Prize Payout',
      description: 'Verified winners receive their prizes directly.',
      details: [
        'Fast payout processing',
        'Secure payment methods',
        'Track your payout status',
      ],
    },
  ];

  return (
    <>
      <Section background="green">
        <Container>
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How FairwayFund Works
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Simple steps to play golf, support charities, and win prizes
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="space-y-16">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className={`flex flex-col lg:flex-row gap-8 items-center animate-fade-in stagger-${Math.min(index % 3 + 1, 3)} ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-green-600 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h2>
                  <p className="text-lg text-gray-700 mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              The Five-Score Rule
            </h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Your latest <strong>five Stableford scores</strong> are automatically kept active.
              When you add a sixth score, the oldest is replaced. This ensures your draw entry
              always reflects your recent golf performance.
            </p>
            <div className="bg-white/80 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-2">Example: Your Active Scores</p>
              <div className="flex justify-center gap-3">
                {[34, 36, 29, 40, 37].map((score, i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    {score}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
