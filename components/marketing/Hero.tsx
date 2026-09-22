import Link from 'next/link';
import { Button } from '../ui/Button';
import { Container } from '../layout/Container';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
      <Container>
        <div className="py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              Golf meets purpose
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              <span className="text-green-600">Play.</span>{' '}
              <span className="text-emerald-600">Give.</span>{' '}
              <span className="text-teal-600">Win.</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-700 mb-8 max-w-2xl leading-relaxed">
              FairwayFund connects your golf game to meaningful charitable impact.
              Submit your Stableford scores, support the charities you care about,
              and enter our monthly prize draw. Every round you play makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <div className="absolute top-10 right-0 w-[500px] h-[500px] opacity-[0.07] pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 400 400" className="w-full h-full text-green-700">
          <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="8" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent" />
    </div>
  );
}
