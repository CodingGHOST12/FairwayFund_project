'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button variant="outline" onClick={logout}>
      Logout
    </Button>
  );
}
