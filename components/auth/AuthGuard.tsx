'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { canAccessAdmin, canAccessDashboard } from '@/lib/auth/auth-utils';
import { AuthLoading } from '@/components/auth/AuthLoading';

type AuthGuardProps = {
  children: ReactNode;
  requireAuth?: boolean;
  requireSubscriber?: boolean;
  requireAdmin?: boolean;
};

export function AuthGuard({ 
  children, 
  requireAuth = false,
  requireSubscriber = false,
  requireAdmin = false,
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requireSubscriber && !canAccessDashboard(user)) {
      router.push('/login');
      return;
    }

    if (requireAdmin && !canAccessAdmin(user)) {
      router.push('/unauthorized');
      return;
    }

    if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
      if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, requireAuth, requireSubscriber, requireAdmin, router, pathname]);

  if (isLoading) {
    return <AuthLoading />;
  }

  if (requireAuth && !isAuthenticated) {
    return <AuthLoading />;
  }

  if (requireSubscriber && !canAccessDashboard(user)) {
    return <AuthLoading />;
  }

  if (requireAdmin && !canAccessAdmin(user)) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}
