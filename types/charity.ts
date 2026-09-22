export type CharityCategory =
  | 'Youth Sports'
  | 'Health & Wellbeing'
  | 'Education'
  | 'Disability Support'
  | 'Community'
  | 'Environment';

export type CharityEvent = {
  id: string;
  title: string;
  date: Date;
  location?: string;
  description: string;
};

export type Charity = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: CharityCategory | string;
  location: string;
  registrationNumber: string;
  website?: string;
  imageUrl?: string;
  isFeatured: boolean;
  totalContributions: number;
  supporterCount: number;
  events: CharityEvent[];
  createdAt: Date;
  updatedAt?: Date;
};

export type CharitySelection = {
  userId: string;
  charityId: string;
  contributionPercentage: number;
  selectedAt: Date;
  updatedAt?: Date;
};

export type UserCharitySelection = CharitySelection;

export type CharityContribution = {
  id: string;
  charityId: string;
  userId?: string;
  amount: number;
  percentage?: number;
  month: string;
  year: number;
  createdAt: Date;
};

export type IndependentDonation = {
  id: string;
  charityId: string;
  userId?: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  message?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
};
