import { AuthSession } from '@/types/auth';

const AUTH_STORAGE_KEY = 'fairwayfund_auth_session';

export const authStorage = {
  getStoredSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return null;
      
      const session: AuthSession = JSON.parse(stored);
      
      if (new Date(session.expiresAt) < new Date()) {
        this.clearStoredSession();
        return null;
      }
      
      return {
        ...session,
        expiresAt: new Date(session.expiresAt),
        user: {
          ...session.user,
          createdAt: new Date(session.user.createdAt),
        },
      };
    } catch (error) {
      console.error('Failed to parse stored session:', error);
      this.clearStoredSession();
      return null;
    }
  },

  setStoredSession(session: AuthSession): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to store session:', error);
    }
  },

  clearStoredSession(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  },
};
