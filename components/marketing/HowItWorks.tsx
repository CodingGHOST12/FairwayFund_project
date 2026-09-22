import { Container } from '../layout/Container';

export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Subscribe',
      description: 'Choose your plan and select a charity to support',
    },
    {
      number: '2',
      title: 'Play Golf',
      description: 'Submit your Stableford scores after each round',
    },
    {
      number: '3',
      title: 'Enter the Draw',
      description: 'Your latest 5 scores automatically enter you in the monthly draw',
    },
    {
      number: '4',
      title: 'Win Prizes',
      description: 'Match the winning scores and claim your prize',
    },
    {
      number: '5',
      title: 'Make an Impact',
      description: 'Every subscription contributes to your chosen charity',
    },
  ];

  return (
    <Container>
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          How FairwayFund Works
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Simple steps to play, give, and win
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {step.number}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
