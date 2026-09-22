import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.smith@example.com',
    name: 'John Smith',
    createdAt: new Date('2025-06-01'),
    role: 'subscriber',
  },
  {
    id: 'user-2',
    email: 'sarah.jones@example.com',
    name: 'Sarah Jones',
    createdAt: new Date('2025-07-15'),
    role: 'subscriber',
  },
  {
    id: 'user-admin',
    email: 'admin@fairwayfund.com',
    name: 'Admin User',
    createdAt: new Date('2024-12-01'),
    role: 'admin',
  },
];
