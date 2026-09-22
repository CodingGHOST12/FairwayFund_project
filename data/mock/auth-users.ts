import { User } from '@/types';

export const mockAuthUsers: Array<User & { password: string }> = [
  {
    id: 'user-subscriber-1',
    email: 'subscriber@example.local',
    password: 'subscriber123',
    name: 'Test Subscriber',
    role: 'subscriber',
    createdAt: new Date('2026-01-15'),
  },
  {
    id: 'user-admin-1',
    email: 'admin@example.local',
    password: 'admin123',
    name: 'Test Admin',
    role: 'admin',
    createdAt: new Date('2025-12-01'),
  },
];

export const findUserByEmail = (email: string) => {
  return mockAuthUsers.find((u) => u.email === email);
};

export const validateCredentials = (email: string, password: string) => {
  const user = findUserByEmail(email);
  if (!user) return null;
  if (user.password !== password) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
