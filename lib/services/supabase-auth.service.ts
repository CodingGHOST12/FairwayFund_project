import { getSupabaseClient } from '@/lib/supabaseClient';
import { AuthResult, SignupCredentials, AuthSession, AuthUser } from '@/types/auth';

const mapSession = (session: any, role?: 'subscriber' | 'admin'): AuthSession => {
  const user = session.user;
  return {
    user: {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || '',
      createdAt: new Date(user.created_at),
      role: role || (user.user_metadata?.role as 'subscriber' | 'admin') || 'subscriber',
    },
    expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
};

const fetchProfile = async (userId: string): Promise<AuthUser | null> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, name, role, avatar_url, phone, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role as 'subscriber' | 'admin',
    handicap: undefined,
    homeClub: data.avatar_url || undefined,
    phoneNumber: data.phone || undefined,
    createdAt: new Date(data.created_at),
  };
};

export const supabaseAuthService = {
  async signup(credentials: SignupCredentials): Promise<AuthResult<AuthSession | null>> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { 
          name: credentials.name 
        },
        emailRedirectTo: `${appUrl}/auth/callback`,
      },
    });

    if (error) {
      return { error };
    }

    if (data.user) {
      // User created successfully. Session may be null if email confirmation required.
      const session = data.session ? mapSession(data.session) : null;
      return { data: session };
    }

    return { error: { message: 'No user data returned from Supabase' } };
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResult<AuthSession>> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { error };
    }

    if (data.user && data.session) {
      const profile = await fetchProfile(data.user.id);
      console.log('[supabaseAuthService] login - profile fetch:', { 
        userId: data.user.id, 
        profileFound: !!profile, 
        profileRole: profile?.role 
      });
      return { data: mapSession(data.session, profile?.role) };
    }

    return { error: { message: 'No session returned from Supabase' } };
  },

  async logout(): Promise<void> {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  },

  async getCurrentSession(): Promise<AuthSession | null> {
    const supabase = getSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session || !session.user) {
      return null;
    }

    const profile = await fetchProfile(session.user.id);
    console.log('[supabaseAuthService] getCurrentSession - profile fetch:', { 
      userId: session.user.id, 
      profileFound: !!profile, 
      profileRole: profile?.role 
    });
    return mapSession(session, profile?.role);
  },

  async getProfile(userId: string): Promise<AuthUser | null> {
    return fetchProfile(userId);
  },
};