import { useState, useCallback, useEffect } from 'react';
import { getAIEngine } from '../framework/AIEngine';
import type { AIAuditEntry, AIAuditQuery } from '../framework/AIAudit';

export interface UseAIAuditReturn {
  entries: AIAuditEntry[];
  isLoading: boolean;
  refresh: () => void;
  query: (query: AIAuditQuery) => AIAuditEntry[];
  getEntries: (limit?: number) => AIAuditEntry[];
  getCount: () => number;
}

export const useAIAudit = (): UseAIAuditReturn => {
  const [entries, setEntries] = useState<AIAuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const engine = getAIEngine();

  const refresh = useCallback(() => {
    setIsLoading(true);
    try {
      const auditEntries = engine.getAuditLogger().getEntries(100);
      setEntries(auditEntries);
    } finally {
      setIsLoading(false);
    }
  }, [engine]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const query = useCallback((query: AIAuditQuery) => {
    return engine.getAuditLogger().query(query);
  }, [engine]);

  const getEntries = useCallback((limit?: number) => {
    return engine.getAuditLogger().getEntries(limit);
  }, [engine]);

  const getCount = useCallback(() => {
    return engine.getAuditLogger().getCount();
  }, [engine]);

  return {
    entries,
    isLoading,
    refresh,
    query,
    getEntries,
    getCount
  };
};

export default useAIAudit;
