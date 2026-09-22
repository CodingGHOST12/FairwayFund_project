export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  role: 'subscriber' | 'admin';
};

export type Profile = {
  userId: string;
  handicap?: number;
  homeClub?: string;
  phoneNumber?: string;
};
