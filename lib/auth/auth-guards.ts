import { AuthUser } from '@/types/auth';

export function isSubscriber(user: AuthUser | null): boolean {
  return user?.role === 'subscriber';
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'admin';
}

export function canAccessDashboard(user: AuthUser | null): boolean {
  return user !== null && (isSubscriber(user) || isAdmin(user));
}

export function canAccessAdmin(user: AuthUser | null): boolean {
  return user !== null && isAdmin(user);
}

export function requireAuth(user: AuthUser | null): boolean {
  return user !== null;
}

export function requireSubscriber(user: AuthUser | null): boolean {
  return canAccessDashboard(user);
}

export function requireAdminRole(user: AuthUser | null): boolean {
  return canAccessAdmin(user);
}
