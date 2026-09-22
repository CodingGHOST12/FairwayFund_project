import Link from 'next/link';
import { Button } from '../ui/Button';

type DesktopNavProps = {
  authenticated?: boolean;
};

export function DesktopNav({ authenticated = false }: DesktopNavProps) {
  if (authenticated) {
    return (
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
          Dashboard
        </Link>
        <Link href="/scores" className="text-gray-700 hover:text-green-600 transition-colors">
          Scores
        </Link>
        <Link href="/charities" className="text-gray-700 hover:text-green-600 transition-colors">
          Charities
        </Link>
        <Link href="/subscription" className="text-gray-700 hover:text-green-600 transition-colors">
          Subscription
        </Link>
        <Link href="/account" className="text-gray-700 hover:text-green-600 transition-colors">
          Account
        </Link>
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link href="/how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">
        How It Works
      </Link>
      <Link href="/pricing" className="text-gray-700 hover:text-green-600 transition-colors">
        Pricing
      </Link>
      <Link href="/charities" className="text-gray-700 hover:text-green-600 transition-colors">
        Charities
      </Link>
      
      <div className="flex items-center space-x-4 ml-4">
        <Link href="/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/signup">
          <Button>Get Started</Button>
        </Link>
      </div>
    </nav>
  );
}
