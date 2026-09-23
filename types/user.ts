export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  role: 'subscriber' | 'admin';
  handicap?: number;
  homeClub?: string;
  phoneNumber?: string;
};

export type Profile = User;