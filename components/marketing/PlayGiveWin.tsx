import { Container } from '../layout/Container';

export function PlayGiveWin() {
  const pillars = [
    {
      label: 'Play',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      heading: 'Track Your Scores',
      description: 'Log your Stableford scores after each round of golf. Your latest five scores are automatically kept active and used as your draw entry. Scores range from 1 to 45 points.',
    },
    {
      label: 'Give',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      heading: 'Support a Charity',
      description: 'Choose from verified charities and direct at least 10% of your subscription to your chosen cause. You can increase your contribution or change charity at any time.',
    },
    {
      label: 'Win',
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      heading: 'Enter the Monthly Draw',
      description: 'Every month, five winning Stableford scores are drawn. Match three, four, or all five to win from the prize pool. Winners verify their scores and receive payouts.',
    },
  ];

  return (
    <Container>
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Three Pillars, One Purpose
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          FairwayFund brings together the game you love, the causes you care about, and the chance to win
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((pillar, i) => (
          <div
            key={pillar.label}
            className={`${pillar.bg} border ${pillar.border} rounded-2xl p-8 transition-transform hover:scale-[1.02] animate-fade-in stagger-${i + 1}`}
          >
            <div className={`${pillar.color} mb-4`}>
              {pillar.icon}
            </div>
            <span className={`text-sm font-bold uppercase tracking-wider ${pillar.color}`}>
              {pillar.label}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">
              {pillar.heading}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
