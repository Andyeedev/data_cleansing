import { useState, useCallback, useEffect } from 'react';
import { getAIEngine } from '../framework/AIEngine';
import { useAIContext } from '../framework/AIContext';
import type { AIRequest, AIRequestResponse, AIModuleType, AIRequestType } from '../types/AIRequests';
import type { AIQuotaStatus } from '../framework/AIQuota';
import type { AIUsageSummary } from '../framework/AIUsage';

export interface UseAIReturn {
  processRequest: (params: {
    prompt: string;
    module: AIModuleType;
    type?: AIRequestType;
  }) => Promise<AIRequestResponse>;
  isLoading: boolean;
  error: string | null;
  lastResponse: AIRequestResponse | null;
  quotaStatus: AIQuotaStatus | null;
  usageSummary: AIUsageSummary | null;
  clearError: () => void;
}

export const useAI = (): UseAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<AIRequestResponse | null>(null);
  const [quotaStatus, setQuotaStatus] = useState<AIQuotaStatus | null>(null);
  const [usageSummary, setUsageSummary] = useState<AIUsageSummary | null>(null);

  const context = useAIContext();
  const engine = getAIEngine();

  useEffect(() => {
    const status = engine.getQuotaManager().checkQuota();
    setQuotaStatus(status);

    const summary = engine.getUsageTracker().getSummary({
      tenantId: context.tenantId ?? undefined,
      userId: context.user?.id ?? undefined
    });
    setUsageSummary(summary);
  }, [context.tenantId, context.user?.id, engine]);

  const processRequest = useCallback(async (params: {
    prompt: string;
    module: AIModuleType;
    type?: AIRequestType;
  }): Promise<AIRequestResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const request: AIRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: params.type ?? 'chat',
        module: params.module,
        prompt: params.prompt,
        context: {
          portal: context.portal ?? 'unknown',
          report: context.report ?? undefined,
          dataset: context.dataset ?? undefined,
          sessionId: context.sessionId,
          conversationHistory: context.conversationHistory,
          permissions: context.permissions,
          preferences: context.preferences
        },
        priority: 'medium',
        metadata: {},
        timestamp: new Date(),
        userId: context.user?.id ?? 'anonymous',
        tenantId: context.tenantId ?? 'default'
      };

      const response = await engine.processRequest(request);
      setLastResponse(response);

      const status = engine.getQuotaManager().checkQuota();
      setQuotaStatus(status);

      const summary = engine.getUsageTracker().getSummary({
        tenantId: context.tenantId ?? undefined,
        userId: context.user?.id ?? undefined
      });
      setUsageSummary(summary);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [context, engine]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    processRequest,
    isLoading,
    error,
    lastResponse,
    quotaStatus,
    usageSummary,
    clearError
  };
};

export default useAI;
