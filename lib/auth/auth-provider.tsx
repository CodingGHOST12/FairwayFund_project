'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from './auth-context';
import { AuthUser, AuthSession } from '@/types/auth';
import { supabaseAuthService } from '@/lib/services/supabase-auth.service';
import { getSupabaseClient } from '@/lib/supabaseClient';

type AuthProviderProps = {
  children: ReactNode;
};

function mapSupabaseUser(supabaseUser: any, role?: 'subscriber' | 'admin'): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || '',
    createdAt: new Date(supabaseUser.created_at),
    role: role || (supabaseUser.user_metadata?.role as 'subscriber' | 'admin') || 'subscriber',
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const currentSession = await supabaseAuthService.getCurrentSession();
        if (currentSession) {
          const profile = await supabaseAuthService.getProfile(currentSession.user.id);
          if (mounted) {
            const userWithProfile = profile || mapSupabaseUser(currentSession.user, currentSession.user.role);
            setUser(userWithProfile);
            setSession({
              ...currentSession,
              user: userWithProfile,
            });
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth state changes
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        const profile = await supabaseAuthService.getProfile(session.user.id);
        const fallbackRole = profile?.role;
        const userWithProfile = profile || mapSupabaseUser(session.user, fallbackRole);
        setUser(userWithProfile);
        setSession({
          user: userWithProfile,
          expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Session refreshed, fetch profile to get current role
        const profile = await supabaseAuthService.getProfile(session.user.id);
        const fallbackRole = profile?.role;
        const userWithProfile = profile || mapSupabaseUser(session.user, fallbackRole);
        setUser(userWithProfile);
        setSession({
          user: userWithProfile,
          expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const result = await supabaseAuthService.login({ email, password });
    
    if (result.error) {
      return { success: false, error: result.error.message };
    }
    
    if (result.data) {
      // Session already includes profile role from the service
      setUser(result.data.user);
      setSession(result.data);
      return { success: true };
    }
    
    return { success: false, error: 'Login failed' };
  };

  const signup = async (email: string, password: string, name: string) => {
    const result = await supabaseAuthService.signup({ email, password, name });
    
    if (result.error) {
      return { success: false, error: result.error.message };
    }
    
    if (result.data) {
      // Signup successful but email confirmation may be required
      // User will be authenticated after email confirmation via onAuthStateChange
      return { success: true };
    }
    
    return { success: false, error: 'Signup failed' };
  };

  const logout = async () => {
    await supabaseAuthService.logout();
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