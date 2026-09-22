import { Subscription, SubscriptionPlan, SubscriptionStatus } from '@/types';
import { authStorage } from '@/lib/auth/auth-storage';

const inMemorySubscriptions: Map<string, Subscription> = new Map();

export const subscriptionService = {
  async getSubscription(userId: string): Promise<Subscription | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const subscription = inMemorySubscriptions.get(userId);
    
    if (subscription) {
      if (subscription.status === 'active' && new Date() > subscription.currentPeriodEnd) {
        const expiredSub = { ...subscription, status: 'expired' as SubscriptionStatus };
        inMemorySubscriptions.set(userId, expiredSub);
        return expiredSub;
      }
      return subscription;
    }
    
    return null;
  },

  async createSubscription(userId: string, plan: SubscriptionPlan): Promise<Subscription> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date();
    const periodEnd = new Date(now);
    
    if (plan === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }
    
    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      userId,
      plan,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      createdAt: now,
      updatedAt: now,
    };
    
    inMemorySubscriptions.set(userId, newSubscription);
    
    return newSubscription;
  },

  async changePlan(userId: string, newPlan: SubscriptionPlan): Promise<Subscription> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existing = inMemorySubscriptions.get(userId);
    
    if (!existing) {
      return this.createSubscription(userId, newPlan);
    }
    
    const now = new Date();
    const periodEnd = new Date(now);
    
    if (newPlan === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }
    
    const updated: Subscription = {
      ...existing,
      plan: newPlan,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      updatedAt: now,
    };
    
    inMemorySubscriptions.set(userId, updated);
    
    return updated;
  },

  async cancelSubscription(userId: string): Promise<Subscription> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existing = inMemorySubscriptions.get(userId);
    
    if (!existing) {
      throw new Error('No subscription found');
    }
    
    const updated: Subscription = {
      ...existing,
      cancelAtPeriodEnd: true,
      updatedAt: new Date(),
    };
    
    inMemorySubscriptions.set(userId, updated);
    
    return updated;
  },

  async reactivateSubscription(userId: string): Promise<Subscription> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existing = inMemorySubscriptions.get(userId);
    
    if (!existing) {
      throw new Error('No subscription found');
    }
    
    const updated: Subscription = {
      ...existing,
      cancelAtPeriodEnd: false,
      status: 'active',
      updatedAt: new Date(),
    };
    
    inMemorySubscriptions.set(userId, updated);
    
    return updated;
  },

  async checkSubscriptionAccess(userId: string): Promise<boolean> {
    const subscription = await this.getSubscription(userId);
    
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;
    if (subscription.cancelAtPeriodEnd && new Date() > subscription.currentPeriodEnd) return false;
    if (new Date() > subscription.currentPeriodEnd) return false;
    
    return true;
  },

  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus | 'none'> {
    const subscription = await this.getSubscription(userId);
    
    if (!subscription) return 'none';
    
    if (subscription.status === 'expired') return 'expired';
    if (subscription.cancelAtPeriodEnd && new Date() > subscription.currentPeriodEnd) return 'expired';
    if (subscription.cancelAtPeriodEnd) return 'cancelled';
    if (new Date() > subscription.currentPeriodEnd) return 'expired';
    
    return subscription.status;
  },
};