export type SubscriptionPlan = 'monthly' | 'yearly';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due';

export type Subscription = {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
};
