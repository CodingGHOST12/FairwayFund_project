import { User } from '@/types';
import { AuthSession, AuthResult, AuthError, LoginCredentials, SignupCredentials } from '@/types/auth';
import { validateCredentials, findUserByEmail } from '@/data/mock/auth-users';
import { authStorage } from '@/lib/auth/auth-storage';

const createSession = (user: User): AuthSession => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  return {
    user,
    expiresAt,
  };
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult<AuthSession>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = validateCredentials(credentials.email, credentials.password);
    
    if (!user) {
      return { 
        error: { 
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        } 
      };
    }
    
    const session = createSession(user);
    authStorage.setStoredSession(session);
    
    return { data: session };
  },

  async signup(credentials: SignupCredentials): Promise<AuthResult<AuthSession>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingUser = findUserByEmail(credentials.email);
    if (existingUser) {
      return { 
        error: { 
          message: 'Email already registered',
          code: 'EMAIL_EXISTS'
        } 
      };
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date(),
      role: 'subscriber',
    };
    
    const session = createSession(newUser);
    authStorage.setStoredSession(session);
    
    return { data: session };
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    authStorage.clearStoredSession();
  },

  async getCurrentSession(): Promise<AuthSession | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return authStorage.getStoredSession();
  },

  async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return session !== null;
  },
};
