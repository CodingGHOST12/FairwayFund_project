import { Container } from '../layout/Container';

export function PrizeExplanation() {
  const pools = [
    {
      title: '5-Match Prize',
      percentage: '40%',
      description: 'Match all 5 winning scores',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '4-Match Prize',
      percentage: '35%',
      description: 'Match 4 of 5 winning scores',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '3-Match Prize',
      percentage: '25%',
      description: 'Match 3 of 5 winning scores',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <Container>
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          How the Prize Pool Works
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Multiple ways to win every month
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pools.map((pool) => (
          <div key={pool.title} className={`${pool.bgColor} rounded-lg p-8 text-center`}>
            <div className={`text-4xl font-bold ${pool.color} mb-2`}>
              {pool.percentage}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{pool.title}</h3>
            <p className="text-gray-600">{pool.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-700">
          <strong>Plus:</strong> At least 10% of all subscription revenue goes directly to supported charities
        </p>
      </div>
    </Container>
  );
}
