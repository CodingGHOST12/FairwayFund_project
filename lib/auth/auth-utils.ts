import { AuthUser } from '@/types/auth';

export const isSubscriber = (user: AuthUser | null): boolean => {
  return user?.role === 'subscriber';
};

export const isAdmin = (user: AuthUser | null): boolean => {
  return user?.role === 'admin';
};

export const canAccessDashboard = (user: AuthUser | null): boolean => {
  return user !== null && (isSubscriber(user) || isAdmin(user));
};

export const canAccessAdmin = (user: AuthUser | null): boolean => {
  return user !== null && isAdmin(user);
};

export const getRedirectPath = (user: AuthUser): string => {
  if (isAdmin(user)) return '/admin';
  if (isSubscriber(user)) return '/dashboard';
  return '/';
};
