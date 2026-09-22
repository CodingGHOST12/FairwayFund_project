import { z } from 'zod';

export const subscriptionPlanSchema = z.enum(['monthly', 'yearly']);

export const subscriptionSelectionSchema = z.object({
  plan: subscriptionPlanSchema,
});

export type SubscriptionSelectionData = z.infer<typeof subscriptionSelectionSchema>;

export const subscriptionChangePlanSchema = z.object({
  newPlan: subscriptionPlanSchema,
});

export type SubscriptionChangePlanData = z.infer<typeof subscriptionChangePlanSchema>;