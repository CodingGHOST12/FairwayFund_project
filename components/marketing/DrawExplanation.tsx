import Link from 'next/link';
import { Button } from '../ui/Button';
import { Container } from '../layout/Container';

export function DrawExplanation() {
  return (
    <Container>
      <div className="text-center mb-16 animate-fade-in">
        <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Monthly Draw</span>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
          How the Prize Draw Works
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Every month, five winning Stableford scores are drawn. The more scores you match, the bigger the prize.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-in">
          {[
            { step: '1', title: 'Subscribers Enter', desc: 'Active subscribers with scores are automatically entered' },
            { step: '2', title: 'Five Scores Drawn', desc: 'Five random Stableford scores (1-45) are selected' },
            { step: '3', title: 'Matches Checked', desc: 'Your five scores are compared against the draw' },
            { step: '4', title: 'Winners Paid', desc: 'Verified winners receive their share of the pool' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center transition-transform hover:scale-[1.02]">
            <div className="text-4xl font-bold text-green-600 mb-1">40%</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">5-Match Prize</h3>
            <p className="text-sm text-gray-600">Match all five drawn scores</p>
            <p className="text-xs text-green-700 mt-3 font-medium">Jackpot rolls over if no winner</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center transition-transform hover:scale-[1.02]">
            <div className="text-4xl font-bold text-blue-600 mb-1">35%</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">4-Match Prize</h3>
            <p className="text-sm text-gray-600">Match four of the five drawn scores</p>
            <p className="text-xs text-blue-700 mt-3 font-medium">Split equally between winners</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center transition-transform hover:scale-[1.02]">
            <div className="text-4xl font-bold text-purple-600 mb-1">25%</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">3-Match Prize</h3>
            <p className="text-sm text-gray-600">Match three of the five drawn scores</p>
            <p className="text-xs text-purple-700 mt-3 font-medium">Split equally between winners</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 text-center animate-fade-in">
          <p className="text-gray-700 mb-4">
            <strong>Fair and transparent:</strong> Multiple winners in the same tier share the pool equally.
            The 5-match jackpot rolls over to the next month if unclaimed.
          </p>
          <Link href="/how-it-works">
            <Button variant="outline">Learn More About the Draw</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
