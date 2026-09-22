import { SubscriptionPlan } from '@/types';

export type PaymentProvider = 'test' | 'razorpay';

export type PaymentResult = {
  success: boolean;
  subscriptionId?: string;
  error?: string;
};

export interface IPaymentProvider {
  initializeCheckout(userId: string, plan: SubscriptionPlan): Promise<{ checkoutId: string }>;
  handlePaymentSuccess(checkoutId: string, userId: string, plan: SubscriptionPlan): Promise<PaymentResult>;
  handlePaymentFailure(checkoutId: string): Promise<PaymentResult>;
}

export class TestPaymentProvider implements IPaymentProvider {
  async initializeCheckout(userId: string, plan: SubscriptionPlan): Promise<{ checkoutId: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      checkoutId: `test-checkout-${Date.now()}-${userId}`,
    };
  }

  async handlePaymentSuccess(
    checkoutId: string,
    userId: string,
    plan: SubscriptionPlan
  ): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!userId || !plan) {
      return {
        success: false,
        error: 'Invalid payment parameters',
      };
    }

    return {
      success: true,
      subscriptionId: `test-sub-${Date.now()}`,
    };
  }

  async handlePaymentFailure(checkoutId: string): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: false,
      error: 'Payment simulation failed',
    };
  }
}

const currentProvider: PaymentProvider = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER as PaymentProvider) || 'test';

export function getPaymentProvider(): IPaymentProvider {
  if (currentProvider === 'test') {
    return new TestPaymentProvider();
  }
  
  throw new Error(`Payment provider ${currentProvider} not implemented`);
}

export function isTestMode(): boolean {
  return currentProvider === 'test';
}
