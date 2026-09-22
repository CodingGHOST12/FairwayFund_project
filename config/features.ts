export const features = {
  authentication: {
    enabled: true,
    providers: ['local'],
  },
  subscriptions: {
    enabled: true,
    plans: ['monthly', 'yearly'],
  },
  draws: {
    enabled: true,
    frequency: 'monthly',
  },
  charities: {
    enabled: true,
    minContribution: 10,
  },
} as const;
