import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiGet, apiPost } from '../utils/apiClient';
import type {
  DiscoveredRulesResponse,
  DiscoveryMappingsResponse,
  DiscoveryStatusResponse,
  DiscoveryTriggerResponse,
  DiscoveryTreeNode,
} from '../types/rule_discovery';

export function useRuleDiscovery(projectId: string | null) {
  const [rules, setRules] = useState<DiscoveredRulesResponse | null>(null);
  const [mappings, setMappings] = useState<DiscoveryMappingsResponse | null>(null);
  const [status, setStatus] = useState<DiscoveryStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<DiscoveredRulesResponse>(`/rules/discovery/${projectId}`);
      setRules(result);
    } catch (err: any) {
      const code = err?.response?.status;
      setError(
        code === 401
          ? 'Unauthorized - please log in'
          : err instanceof Error
            ? err.message
            : 'Failed to fetch discovered rules'
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchMappings = useCallback(async () => {
    if (!projectId) return;
    try {
      const result = await apiGet<DiscoveryMappingsResponse>(`/rules/discovery/${projectId}/mappings`);
      setMappings(result);
    } catch (err: any) {
      const code = err?.response?.status;
      setError(
        code === 401
          ? 'Unauthorized - please log in'
          : err instanceof Error
            ? err.message
            : 'Failed to fetch mappings'
      );
    }
  }, [projectId]);

  const fetchStatus = useCallback(async () => {
    if (!projectId) return;
    try {
      const result = await apiGet<DiscoveryStatusResponse>(`/rules/discovery/${projectId}/status`);
      setStatus(result);
    } catch (err: any) {
      const code = err?.response?.status;
      setError(
        code === 401
          ? 'Unauthorized - please log in'
          : err instanceof Error
            ? err.message
            : 'Failed to fetch status'
      );
    }
  }, [projectId]);

  const triggerDiscovery = useCallback(async (): Promise<DiscoveryTriggerResponse | null> => {
    if (!projectId) return null;
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost<DiscoveryTriggerResponse>(
        `/rules/discovery/${projectId}/trigger`,
        {}
      );
      return result;
    } catch (err: any) {
      const code = err?.response?.status;
      setError(
        code === 401
          ? 'Unauthorized - please log in'
          : err instanceof Error
            ? err.message
            : 'Failed to trigger discovery'
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchRules();
      fetchMappings();
      fetchStatus();
    } else {
      setRules(null);
      setMappings(null);
      setStatus(null);
    }
  }, [projectId, fetchRules, fetchMappings, fetchStatus]);

  const refetch = useCallback(() => {
    fetchRules();
    fetchMappings();
    fetchStatus();
  }, [fetchRules, fetchMappings, fetchStatus]);

  const controlTreeData = useMemo((): DiscoveryTreeNode[] => {
    if (!rules?.rules) return [];
    const controlMap = new Map<string, DiscoveryTreeNode>();
    for (const rule of rules.rules) {
      const controlId = rule.control_id || 'UNCATEGORIZED';
      if (!controlMap.has(controlId)) {
        controlMap.set(controlId, {
          id: controlId,
          name: `Control ${controlId}`,
          type: 'control',
          status: 'active',
          children: [],
        });
      }
      const controlNode = controlMap.get(controlId)!;
      const displayName = rule.dataset_name
        ? `${rule.rule_name || rule.rule_id} (${rule.dataset_name})`
        : rule.rule_name || rule.rule_id;
      controlNode.children!.push({
        id: rule.rule_id + '-' + rule.mapping_id,
        name: displayName,
        type: 'rule',
        status: rule.enabled_flag ? 'active' : 'inactive',
        rule,
      });
    }
    return Array.from(controlMap.values()).sort((a, b) => a.id.localeCompare(b.id));
  }, [rules?.rules]);

  const datasetTreeData = useMemo((): DiscoveryTreeNode[] => {
    if (!mappings?.mappings) return [];
    const datasetMap = new Map<string, DiscoveryTreeNode>();
    for (const m of mappings.mappings) {
      const datasetName = m.dataset_name || 'unknown';
      if (!datasetMap.has(datasetName)) {
        datasetMap.set(datasetName, {
          id: datasetName,
          name: datasetName,
          type: 'dataset',
          status: 'active',
          children: [],
        });
      }
      const datasetNode = datasetMap.get(datasetName)!;
      datasetNode.children!.push({
        id: m.mapping_id,
        name: m.rule_name || m.rule_id,
        type: 'rule',
        status: 'active',
        mapping: m,
      });
    }
    return Array.from(datasetMap.values()).sort((a, b) => a.id.localeCompare(b.id));
  }, [mappings?.mappings]);

  return {
    rules,
    mappings,
    status,
    loading,
    error,
    refetch,
    triggerDiscovery,
    controlTreeData,
    datasetTreeData,
  };
}
