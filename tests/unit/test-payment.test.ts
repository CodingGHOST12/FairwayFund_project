import { describe, it, expect, beforeEach } from 'vitest';
import { TestPaymentProvider } from '@/lib/payment/payment-provider';

describe('Test Payment Provider', () => {
  let provider: TestPaymentProvider;

  beforeEach(() => {
    provider = new TestPaymentProvider();
  });

  describe('initializeCheckout', () => {
    it('creates a checkout session with valid ID', async () => {
      const result = await provider.initializeCheckout('user-123', 'monthly');
      
      expect(result.checkoutId).toBeDefined();
      expect(result.checkoutId).toContain('test-checkout-');
      expect(result.checkoutId).toContain('user-123');
    });

    it('handles yearly plan', async () => {
      const result = await provider.initializeCheckout('user-456', 'yearly');
      
      expect(result.checkoutId).toBeDefined();
      expect(result.checkoutId).toContain('test-checkout-');
    });
  });

  describe('handlePaymentSuccess', () => {
    it('returns success for valid payment', async () => {
      const checkoutId = 'test-checkout-123';
      const result = await provider.handlePaymentSuccess(checkoutId, 'user-123', 'monthly');
      
      expect(result.success).toBe(true);
      expect(result.subscriptionId).toBeDefined();
      expect(result.subscriptionId).toContain('test-sub-');
      expect(result.error).toBeUndefined();
    });

    it('returns error for invalid userId', async () => {
      const checkoutId = 'test-checkout-123';
      const result = await provider.handlePaymentSuccess(checkoutId, '', 'monthly');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid payment parameters');
    });

    it('handles yearly plan success', async () => {
      const checkoutId = 'test-checkout-456';
      const result = await provider.handlePaymentSuccess(checkoutId, 'user-456', 'yearly');
      
      expect(result.success).toBe(true);
      expect(result.subscriptionId).toBeDefined();
    });
  });

  describe('handlePaymentFailure', () => {
    it('returns failure result', async () => {
      const checkoutId = 'test-checkout-789';
      const result = await provider.handlePaymentFailure(checkoutId);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Payment simulation failed');
      expect(result.subscriptionId).toBeUndefined();
    });
  });
});
