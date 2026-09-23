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
          console.log('[AuthProvider] initAuth - profile fetch:', { 
            userId: currentSession.user.id, 
            profileFound: !!profile, 
            profileRole: profile?.role,
            sessionUserRole: currentSession.user?.role 
          });
          if (mounted) {
            // If profile fetch fails, preserve the role from the session
            const fallbackRole = (profile?.role || currentSession.user?.role) as 'subscriber' | 'admin' | undefined;
            const userWithProfile = profile || mapSupabaseUser(currentSession.user, fallbackRole);
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
        // DEBUG: Log profile fetch result
        console.log('[AuthProvider] SIGNED_IN - profile fetch:', { 
          userId: session.user.id, 
          profileFound: !!profile, 
          profileRole: profile?.role,
          sessionUserRole: session.user?.role 
        });
        // If profile fetch fails, preserve the role from the session (set by login)
        const fallbackRole = (profile?.role || session.user?.role) as 'subscriber' | 'admin' | undefined;
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
        console.log('[AuthProvider] TOKEN_REFRESHED - profile fetch:', { 
          userId: session.user.id, 
          profileFound: !!profile, 
          profileRole: profile?.role,
          sessionUserRole: session.user?.role 
        });
        const fallbackRole = (profile?.role || session.user?.role) as 'subscriber' | 'admin' | undefined;
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
      console.log('[AuthProvider] login - result:', { 
        userId: result.data.user.id, 
        userRole: result.data.user.role 
      });
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
    
    // Signup successful (user created). Session may be null if email confirmation required.
    // User will be authenticated after email confirmation via onAuthStateChange
    return { success: true };
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