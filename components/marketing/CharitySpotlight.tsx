import Link from 'next/link';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Container } from '../layout/Container';
import { formatCurrency } from '@/lib/utils/formatting';
import { mockCharities } from '@/data/mock/charities';

export function CharitySpotlight() {
  const featuredCharity = mockCharities.find(c => c.isFeatured);

  if (!featuredCharity) return null;

  return (
    <Container>
      <div className="text-center mb-12 animate-fade-in">
        <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Featured Charity</span>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
          Making a Real Difference
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Every subscriber supports a verified charity. Here is one of the causes you can support.
        </p>
      </div>

      <Card className="max-w-5xl mx-auto overflow-hidden animate-scale-in" padding={false}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 h-64 lg:h-auto flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="text-green-800 font-medium">{featuredCharity.category}</p>
            </div>
          </div>

          <div className="p-8 lg:p-10">
            <Badge variant="success" className="mb-4">Featured</Badge>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {featuredCharity.name}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {featuredCharity.longDescription}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Contributions</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(featuredCharity.totalContributions)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Supporters</p>
                <p className="text-xl font-bold text-gray-900">
                  {featuredCharity.supporterCount}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={`/charities/${featuredCharity.id}`}>
                <Button>View Charity</Button>
              </Link>
              <Link href="/charities">
                <Button variant="outline">Explore All</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </Container>
  );
}
