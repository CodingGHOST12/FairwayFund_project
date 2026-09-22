'use client';

import Link from 'next/link';
import { Container } from './Container';
import { DesktopNav } from '../navigation/DesktopNav';
import { MobileNav } from '../navigation/MobileNav';
import { UserMenu } from '../auth/UserMenu';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FairwayFund</span>
          </Link>

          {!isLoading && isAuthenticated ? (
            <>
              <DesktopNav authenticated />
              <UserMenu />
            </>
          ) : (
            <>
              <DesktopNav />
              <MobileNav />
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
