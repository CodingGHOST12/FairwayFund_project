'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from './auth-context';
import { AuthUser, AuthSession } from '@/types/auth';
import { authService } from '@/lib/services/auth.service';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentSession = await authService.getCurrentSession();
        if (currentSession) {
          setUser(currentSession.user);
          setSession(currentSession);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    
    if (result.error) {
      return { success: false, error: result.error.message };
    }
    
    if (result.data) {
      setUser(result.data.user);
      setSession(result.data);
      return { success: true };
    }
    
    return { success: false, error: 'Login failed' };
  };

  const signup = async (email: string, password: string, name: string) => {
    const result = await authService.signup({ email, password, name });
    
    if (result.error) {
      return { success: false, error: result.error.message };
    }
    
    if (result.data) {
      setUser(result.data.user);
      setSession(result.data);
      return { success: true };
    }
    
    return { success: false, error: 'Signup failed' };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setSession(null);
    router.push('/');
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: user !== null,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
