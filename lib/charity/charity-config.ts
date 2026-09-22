export const charityConfig = {
  minimumContributionPercentage: 10,
  defaultContributionPercentage: 10,
  maximumContributionPercentage: 100,

  presetPercentages: [10, 15, 20, 25, 50, 100] as const,

  categories: [
    'Youth Sports',
    'Health & Wellbeing',
    'Education',
    'Disability Support',
    'Community',
    'Environment',
  ] as const,

  isValidPercentage(val: number): boolean {
    return (
      Number.isInteger(val) &&
      val >= charityConfig.minimumContributionPercentage &&
      val <= charityConfig.maximumContributionPercentage
    );
  },
};
