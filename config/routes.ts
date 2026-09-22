export const routes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  howItWorks: '/how-it-works',
  pricing: '/pricing',
  charities: '/charities',
  charityDetail: (id: string) => `/charities/${id}`,
  app: '/app',
  dashboard: '/dashboard',
  admin: '/admin',
} as const;
