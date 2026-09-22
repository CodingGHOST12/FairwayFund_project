import Link from 'next/link';
import { Button } from '../ui/Button';
import { Container } from '../layout/Container';

export function SubscriptionCTA() {
  return (
    <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
      <Container>
        <div className="py-20 text-center animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Play for a Purpose?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Join FairwayFund today. Track your golf, support charities you care about,
            and enter every monthly prize draw.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 focus:ring-white w-full sm:w-auto">
                Get Started Now
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700/50 w-full sm:w-auto">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
