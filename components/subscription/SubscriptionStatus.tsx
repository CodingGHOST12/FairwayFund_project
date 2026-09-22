import { Badge } from '@/components/ui/Badge';
import { Subscription } from '@/types';
import { getStatusBadgeVariant, getSubscriptionDisplayStatus } from '@/lib/subscription/subscription-utils';

type SubscriptionStatusProps = {
  subscription: Subscription | null;
};

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  if (!subscription) {
    return <Badge variant="error">No subscription</Badge>;
  }

  const status = subscription.cancelAtPeriodEnd ? 'cancelled' : subscription.status;
  const displayStatus = getSubscriptionDisplayStatus(subscription);
  const variant = getStatusBadgeVariant(status);

  return <Badge variant={variant}>{displayStatus}</Badge>;
}