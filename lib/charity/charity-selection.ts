import { Charity, CharitySelection } from '@/types';
import { charityConfig } from './charity-config';

export function calculateEstimatedContribution(
  subscriptionPrice: number,
  percentage: number = charityConfig.minimumContributionPercentage
): number {
  if (subscriptionPrice <= 0 || percentage < charityConfig.minimumContributionPercentage) {
    return 0;
  }
  return Math.round(subscriptionPrice * (percentage / 100) * 100) / 100;
}

export function formatContributionSummary(
  selection: CharitySelection | null,
  charity: Charity | null
): string {
  if (!selection || !charity) {
    return 'No charity currently selected';
  }
  return `${charity.name} (${selection.contributionPercentage}% contribution)`;
}
