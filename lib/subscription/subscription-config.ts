import { Subscription, SubscriptionPlan } from '@/types';

export type PlanConfig = {
  id: SubscriptionPlan;
  name: string;
  description: string;
  billingInterval: 'month' | 'year';
  price: number;
  currency: string;
  features: string[];
  recommended?: boolean;
};

export const subscriptionConfig = {
  plans: [
    {
      id: 'monthly' as SubscriptionPlan,
      name: 'Monthly',
      description: 'Pay month by month',
      billingInterval: 'month' as const,
      price: 1000,
      currency: 'INR',
      features: [
        'Monthly draw entry',
        'Support your chosen charity',
        'Track your golf scores',
        'Cancel anytime',
      ],
    },
    {
      id: 'yearly' as SubscriptionPlan,
      name: 'Yearly',
      description: 'Pay annually and save',
      billingInterval: 'year' as const,
      price: 10000,
      currency: 'INR',
      features: [
        '12 months of draw entries',
        'Support your chosen charity',
        'Track your golf scores',
        'Best value',
        'Priority support',
      ],
      recommended: true,
    },
  ] as PlanConfig[],

  charityContribution: {
    minimumPercent: 10,
    defaultPercent: 10,
    maxPercent: 100,
  },

  getPlan: (planId: SubscriptionPlan): PlanConfig | undefined => {
    return subscriptionConfig.plans.find(p => p.id === planId);
  },

  getPlanPrice: (planId: SubscriptionPlan): number => {
    const plan = subscriptionConfig.getPlan(planId);
    return plan?.price ?? 0;
  },

  calculateCharityContribution: (planId: SubscriptionPlan, percent?: number): number => {
    const price = subscriptionConfig.getPlanPrice(planId);
    const contributionPercent = percent ?? subscriptionConfig.charityContribution.defaultPercent;
    return Math.round(price * (contributionPercent / 100) * 100) / 100;
  },
};