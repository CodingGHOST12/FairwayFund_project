import { SubscriptionPlan } from '@/types';

export type CheckoutSession = {
  id: string;
  url: string;
};

export type PaymentStatus = {
  status: 'success' | 'pending' | 'failed';
  subscriptionId?: string;
};

export const paymentService = {
  async createCheckoutSession(
    userId: string,
    plan: SubscriptionPlan
  ): Promise<CheckoutSession> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: `cs_${Date.now()}`,
      url: '/checkout/success',
    };
  },

  async getPaymentStatus(sessionId: string): Promise<PaymentStatus> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 'success',
      subscriptionId: `sub-${Date.now()}`,
    };
  },

  async handleWebhook(payload: unknown, signature: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
  },
};
