import { useState, useCallback, useEffect } from 'react';
import { getAIEngine } from '../framework/AIEngine';
import { useAIContext } from '../framework/AIContext';
import type { AIUsageEntry, AIUsageSummary } from '../framework/AIUsage';

export interface UseAIUsageReturn {
  summary: AIUsageSummary | null;
  entries: AIUsageEntry[];
  isLoading: boolean;
  refresh: () => void;
  getSummary: (params?: {
    startDate?: Date;
    endDate?: Date;
    module?: string;
  }) => AIUsageSummary;
  getEntries: (params?: {
    startDate?: Date;
    endDate?: Date;
    module?: string;
    limit?: number;
    offset?: number;
  }) => AIUsageEntry[];
}

export const useAIUsage = (): UseAIUsageReturn => {
  const [summary, setSummary] = useState<AIUsageSummary | null>(null);
  const [entries, setEntries] = useState<AIUsageEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const context = useAIContext();
  const engine = getAIEngine();

  const refresh = useCallback(() => {
    setIsLoading(true);
    try {
      const usageSummary = engine.getUsageTracker().getSummary({
        tenantId: context.tenantId ?? undefined,
        userId: context.user?.id ?? undefined
      });
      setSummary(usageSummary);

      const usageEntries = engine.getUsageTracker().getEntries({
        tenantId: context.tenantId ?? undefined,
        userId: context.user?.id ?? undefined,
        limit: 100
      });
      setEntries(usageEntries);
    } finally {
      setIsLoading(false);
    }
  }, [context.tenantId, context.user?.id, engine]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getSummary = useCallback((params?: {
    startDate?: Date;
    endDate?: Date;
    module?: string;
  }) => {
    return engine.getUsageTracker().getSummary({
      ...params,
      tenantId: context.tenantId ?? undefined,
      userId: context.user?.id ?? undefined
    });
  }, [context.tenantId, context.user?.id, engine]);

  const getEntries = useCallback((params?: {
    startDate?: Date;
    endDate?: Date;
    module?: string;
    limit?: number;
    offset?: number;
  }) => {
    return engine.getUsageTracker().getEntries({
      ...params,
      tenantId: context.tenantId ?? undefined,
      userId: context.user?.id ?? undefined
    });
  }, [context.tenantId, context.user?.id, engine]);

  return {
    summary,
    entries,
    isLoading,
    refresh,
    getSummary,
    getEntries
  };
};

export default useAIUsage;
