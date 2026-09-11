import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/apiClient';

export interface SubscriptionLimit {
  current: number;
  max: number;
}

export interface SubscriptionData {
  plan_tier: string | null;
  plan_name: string | null;
  status: string;
  trial_end_date: string | null;
  billing_cycle: string | null;
  end_date: string | null;
  limits: {
    projects: SubscriptionLimit;
    users: SubscriptionLimit;
    connections: SubscriptionLimit;
  };
}

interface SubscriptionResult {
  subscription: SubscriptionData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isAtLimit: (kind: 'projects' | 'users' | 'connections') => boolean;
  isNearLimit: (kind: 'projects' | 'users' | 'connections', threshold?: number) => boolean;
  usagePercent: (kind: 'projects' | 'users' | 'connections') => number;
  daysUntilTrialEnd: () => number | null;
}

export function useSubscription(): SubscriptionResult {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiGet<{ subscription: SubscriptionData }>('/auth/me');
      setSubscription(res?.subscription ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isAtLimit = useCallback((kind: 'projects' | 'users' | 'connections'): boolean => {
    if (!subscription) return false;
    const limit = subscription.limits[kind];
    return limit.current >= limit.max;
  }, [subscription]);

  const isNearLimit = useCallback((kind: 'projects' | 'users' | 'connections', threshold = 0.8): boolean => {
    if (!subscription) return false;
    const limit = subscription.limits[kind];
    if (limit.max === 0) return false;
    return limit.current >= limit.max * threshold;
  }, [subscription]);

  const usagePercent = useCallback((kind: 'projects' | 'users' | 'connections'): number => {
    if (!subscription) return 0;
    const limit = subscription.limits[kind];
    if (limit.max === 0) return 0;
    return Math.round((limit.current / limit.max) * 100);
  }, [subscription]);

  const daysUntilTrialEnd = useCallback((): number | null => {
    if (!subscription?.trial_end_date) return null;
    const end = new Date(subscription.trial_end_date);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [subscription]);

  return {
    subscription,
    isLoading,
    error,
    refetch: fetchSubscription,
    isAtLimit,
    isNearLimit,
    usagePercent,
    daysUntilTrialEnd,
  };
}
