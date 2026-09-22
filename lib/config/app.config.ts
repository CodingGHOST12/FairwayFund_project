export const appConfig = {
  name: 'FairwayFund',
  description: 'Play golf, support charities, win prizes',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  score: {
    min: 1,
    max: 45,
    maxRetained: 5,
  },
  
  charity: {
    minContributionPercent: 10,
  },
  
  draw: {
    matchTypes: {
      fiveMatch: {
        poolPercent: 40,
        label: '5-Match',
      },
      fourMatch: {
        poolPercent: 35,
        label: '4-Match',
      },
      threeMatch: {
        poolPercent: 25,
        label: '3-Match',
      },
    },
  },
} as const;
