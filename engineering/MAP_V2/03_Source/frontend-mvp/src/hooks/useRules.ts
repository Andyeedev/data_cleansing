import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';
import type {
  RuleRegistryItem,
  RuleRegistryListResponse,
  RuleRegistryCreateRequest,
  RuleRegistryUpdateRequest
} from '../types/rules';

export interface RuleUsageItem extends RuleRegistryItem {
  mapping_count: number;
  last_execution: string | null;
  last_status: 'pass' | 'fail' | 'error' | null;
  total_executions: number;
}

export interface RuleUsageStatsResponse {
  rules: RuleUsageItem[];
  total: number;
}

export function useRules() {
  const [data, setData] = useState<RuleRegistryListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<RuleRegistryListResponse>('/rules');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useRuleById(ruleId: string | null) {
  const [data, setData] = useState<RuleRegistryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!ruleId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<RuleRegistryItem>(`/rules/${ruleId}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rule');
    } finally {
      setLoading(false);
    }
  }, [ruleId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useRulesByControl(controlId: string | null) {
  const [data, setData] = useState<RuleRegistryListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!controlId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<RuleRegistryListResponse>(`/rules/control/${controlId}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  }, [controlId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useRuleMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRule = useCallback(async (request: RuleRegistryCreateRequest): Promise<RuleRegistryItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost<RuleRegistryItem>('/rules', request);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create rule');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRule = useCallback(async (ruleId: string, request: RuleRegistryUpdateRequest): Promise<RuleRegistryItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPut<RuleRegistryItem>(`/rules/${ruleId}`, request);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rule');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRule = useCallback(async (ruleId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/rules/${ruleId}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete rule');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createRule, updateRule, deleteRule, loading, error };
}

export function useRuleUsageStats() {
  const [data, setData] = useState<RuleUsageStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<RuleUsageStatsResponse>('/rules/usage-stats');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rule usage stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}
