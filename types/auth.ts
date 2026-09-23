import { User } from './user';

export type AuthUser = User;

export type AuthSession = {
  user: AuthUser;
  expiresAt: Date;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = {
  email: string;
  password: string;
  name: string;
};

export type AuthResult<T> = {
  data?: T;
  error?: AuthError;
};

export type AuthError = {
  message: string;
  code?: string;
};

export type AuthState = 
  | { status: 'loading' }
  | { status: 'authenticated'; user: AuthUser; session: AuthSession }
  | { status: 'unauthenticated' }
  | { status: 'error'; error: AuthError };