import React, { useState, useMemo, useEffect } from 'react';
import { useRuleUsageStats, useProjectsForTenant } from '../hooks/useRules';
import { apiGet, apiPost } from '../utils/apiClient';
import { useValidationFilter } from '../context/ValidationFilterContext';
import { KpiBox, StatusPill, EmptyState } from '../components/reports/reportWidgets';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { Modal } from '../components/shared/Modal';
import type { RuleUsageItem } from '../hooks/useRules';

type FilterMapping = 'all' | 'mapped' | 'unmapped';
type SortField = 'rule_id' | 'rule_name' | 'control_id' | 'severity_level' | 'mapping_count' | 'total_executions';
type SortDir = 'asc' | 'desc';

interface RuleMapping {
  mapping_id: string;
  dataset_name: string;
  is_active: boolean;
  created_at: string | null;
  execution_status: string | null;
  delta_value: number | null;
  execution_time_seconds: number | null;
  last_execution_at: string | null;
}

interface ControlRule {
  id: number;
  batch_id: string;
  control_id: string;
  rule_id: string;
  entity_name: string;
  execution_status: string;
  delta_value: number | null;
  execution_time_seconds: number | null;
  severity_level: string | null;
  created_at: string | null;
  detail_json: Record<string, any> | null;
}

function ControlReportModal({ isOpen, onClose, controlId, controlName, projectId }: { isOpen: boolean; onClose: () => void; controlId: string; controlName: string; projectId: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !controlId || !projectId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const batchResult = await apiGet<{ batch_id: string | null; message?: string }>(
          `/execution/${projectId}/control/${controlId}/latest-batch`
        );
        const batchId = batchResult.batch_id;
        if (!batchId) {
          setError(batchResult.message || 'No execution found for this control');
          setData([]);
          return;
        }
        const result = await apiGet<any[]>(
          `/execution/${batchId}/control/${controlId}/rules`
        );
        setData(Array.isArray(result) ? result : (result.items || []));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch control rules');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, controlId, projectId]);

  return (
    <Modal open={isOpen} title={`Control Rules: ${controlId}`} onClose={onClose}>
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading rules...</div>
      ) : error ? (
        <div className="py-12 text-center text-red-600">{error}</div>
      ) : data.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-gray-50 z-1">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left font-bold text-xs text-gray-500 bg-gray-50 border-b-2 border-gray-200 whitespace-nowrap">Rule ID</th>
                <th className="px-4 py-2 text-left font-bold text-xs text-gray-500 bg-gray-50 border-b-2 border-gray-200 whitespace-nowrap">Entity</th>
                <th className="px-4 py-2 text-left font-bold text-xs text-gray-500 bg-gray-50 border-b-2 border-gray-200 whitespace-nowrap">Status</th>
                <th className="px-4 py-2 text-left font-bold text-xs text-gray-500 bg-gray-50 border-b-2 border-gray-200 whitespace-nowrap">Delta</th>
                <th className="px-4 py-2 text-left font-bold text-xs text-gray-500 bg-gray-50 border-b-2 border-gray-200 whitespace-nowrap">Time (s)</th>
                <th className="px-4 py-2 text-left font-bold text-xs text-gray-500 bg-gray-50 border-b-2 border-gray-200 whitespace-nowrap">Details</th>
              </tr>
            </thead>
            <tbody>
              {data.map((rule: any) => (
                <tr key={rule.id} className="border-b border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">{rule.rule_id}</td>
                  <td className="px-4 py-2">{rule.entity_name}</td>
                  <td className="px-4 py-2"><StatusPill status={rule.execution_status} /></td>
                  <td className="px-4 py-2">{rule.delta_value ?? '\u2014'}</td>
                  <td className="px-4 py-2">{rule.execution_time_seconds?.toFixed(2) ?? '\u2014'}</td>
                  <td className="px-4 py-2">
                    {rule.detail_json && Object.keys(rule.detail_json).length > 0 ? (
                      <details className="cursor-pointer">
                        <summary className="text-blue-600 text-xs">View Details</summary>
                        <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-48">
                          {JSON.stringify(rule.detail_json, null, 2)}
                        </pre>
                      </details>
                    ) : (
                      <span className="text-gray-400 text-xs">No details</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">No rules found for this control.</div>
      )}
    </Modal>
  );
}

export function RuleMappingsUsageTab() {
  const { tenantId } = useValidationFilter();
  const selectedTenant = tenantId || '';
  const { data, loading, error, refetch } = useRuleUsageStats(tenantId || undefined);
  const { data: projects } = useProjectsForTenant(tenantId || undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMapping, setFilterMapping] = useState<FilterMapping>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('all');
  const [sortField, setSortField] = useState<SortField>('control_id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [autoDiscovering, setAutoDiscovering] = useState(false);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [expandedMappings, setExpandedMappings] = useState<Record<string, RuleMapping[]>>({});
  const [expandedLoading, setExpandedLoading] = useState(false);

  const [controlReportModal, setControlReportModal] = useState<{
    isOpen: boolean;
    controlId: string | null;
    controlName: string | null;
    projectId: string | null;
  }>({
    isOpen: false,
    controlId: null,
    controlName: null,
    projectId: null,
  });

  useEffect(() => {
    setExpandedRuleId(null);
    setExpandedMappings({});
  }, [selectedTenant]);

  const filteredRules = useMemo(() => {
    if (!data?.rules) return [];
    let result = data.rules;
    if (selectedTenant) {
      result = result.filter((r) => r.tenant_id === selectedTenant);
    }
    if (filterMapping === 'mapped') {
      result = result.filter((r) => r.mapping_count > 0);
    } else if (filterMapping === 'unmapped') {
      result = result.filter((r) => r.mapping_count === 0);
    }
    if (filterSeverity !== 'all') {
      result = result.filter((r) => r.severity_level === filterSeverity);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) =>
        r.rule_id.toLowerCase().includes(q) ||
        (r.rule_name && r.rule_name.toLowerCase().includes(q)) ||
        (r.control_id && r.control_id.toLowerCase().includes(q))
      );
    }
    result = [...result].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
    return result;
  }, [data?.rules, selectedTenant, filterMapping, filterSeverity, searchQuery, sortField, sortDir]);

  const totalRules = data?.total ?? 0;
  const mappedRules = data?.rules?.filter((r) => r.mapping_count > 0).length ?? 0;
  const unmappedRules = data?.rules?.filter((r) => r.mapping_count === 0).length ?? 0;
  const totalMappings = data?.rules?.reduce((sum, r) => sum + r.mapping_count, 0) ?? 0;

  const handleAutoDiscover = async () => {
    if (!projects || projects.length === 0) {
      return;
    }
    setAutoDiscovering(true);
    try {
      const projectId = projects[0].project_id;
      await apiPost(`/rules/discovery/${projectId}/trigger`, {});
      refetch();
    } catch {
    } finally {
      setAutoDiscovering(false);
    }
  };

  const handleToggleMappings = async (ruleId: string) => {
    const cacheKey = selectedTenant ? `${ruleId}:${selectedTenant}` : ruleId;
    if (expandedRuleId === ruleId) {
      setExpandedRuleId(null);
    } else {
      if (!expandedMappings[cacheKey]) {
        setExpandedLoading(true);
        try {
          const params = new URLSearchParams();
          if (selectedTenant) params.set('tenant_id', selectedTenant);
          const qs = params.toString() ? `?${params.toString()}` : '';
          const result = await apiGet<{mappings: RuleMapping[], total: number}>('/rules/' + ruleId + '/mappings' + qs);
          setExpandedMappings(prev => ({ ...prev, [cacheKey]: result.mappings || [] }));
        } catch {
          setExpandedMappings(prev => ({ ...prev, [cacheKey]: [] }));
        } finally {
          setExpandedLoading(false);
        }
      }
      setExpandedRuleId(ruleId);
    }
  };

  const handleSort = (field: SortField) => {
    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const sortArrow = (field: SortField) => sortField === field ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : '';

  if (loading) return <LoadingSkeleton rows={4} variant="card" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <>
      {/* ========== INFO BANNER ========== */}
      <div className="p-4 mb-4 bg-blue-50 rounded-md border border-blue-200 text-xs text-gray-500">
        <strong className="text-blue-600">Rule Mappings &amp; Usage</strong> shows which rules are bound to dataset mappings via <code>core.rule_dataset_mapping</code> and their execution history. Rules with <strong>0 mappings</strong> are not applied to any dataset.
      </div>

      {/* ========== TOOLBAR ========== */}
      <div className="flex gap-2 items-center mb-4 flex-wrap">
        <button onClick={handleAutoDiscover} disabled={autoDiscovering} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {autoDiscovering ? 'Discovering...' : 'Auto-Discover'}
        </button>
        <button onClick={refetch} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm border border-gray-300 rounded-md cursor-pointer">
          Refresh
        </button>
      </div>

      {data && (
        <>
          {/* ========== KPI ROW ========== */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-6">
            <KpiBox label="Total Rules" value={totalRules} tone="info" />
            <KpiBox label="Mapped Rules" value={mappedRules} tone="success" />
            <KpiBox label="Unmapped Rules" value={unmappedRules} tone={unmappedRules > 0 ? 'error' : 'success'} />
            <KpiBox label="Total Mappings" value={totalMappings} tone="info" />
          </div>

          {/* ========== UNMAPPED WARNING ========== */}
          {unmappedRules > 0 && (
            <div className="p-4 mb-4 bg-yellow-50 rounded-md border border-yellow-400">
              <div className="font-semibold text-yellow-600 mb-1">
                {unmappedRules} rule(s) not mapped to any dataset
              </div>
              <div className="text-xs text-gray-500">
                These rules will not execute during migration. Use <strong>Auto-Discover</strong> to bind rules to datasets based on column metadata.
              </div>
            </div>
          )}

          {/* ========== FILTERS ========== */}
          <div className="flex gap-4 mb-4 items-center flex-wrap">
            <div className="flex-1 min-w-52">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search rules..." />
            </div>
            <select value={filterMapping} onChange={(e) => setFilterMapping(e.target.value as FilterMapping)} className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">
              <option value="all">All Mapping Status</option>
              <option value="mapped">Mapped</option>
              <option value="unmapped">Unmapped</option>
            </select>
            <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value as 'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW')} className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">
              <option value="all">All Severity</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* ========== TABLE ========== */}
          {filteredRules.length === 0 ? (
            <EmptyState title="No rules found" description="No rules match your filters." />
          ) : (
            <div className="border border-gray-300 rounded-md overflow-auto max-h-[700px] bg-white">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('rule_id')} className="text-left px-4 py-2 text-gray-700 font-bold text-xs cursor-pointer select-none bg-gray-50 border-b-2 border-gray-300">Rule ID{sortArrow('rule_id')}</th>
                    <th onClick={() => handleSort('rule_name')} className="text-left px-4 py-2 text-gray-700 font-bold text-xs cursor-pointer select-none bg-gray-50 border-b-2 border-gray-300">Name{sortArrow('rule_name')}</th>
                    <th onClick={() => handleSort('control_id')} className="text-left px-4 py-2 text-gray-700 font-bold text-xs cursor-pointer select-none bg-gray-50 border-b-2 border-gray-300">Control{sortArrow('control_id')}</th>
                    <th onClick={() => handleSort('severity_level')} className="text-left px-4 py-2 text-gray-700 font-bold text-xs cursor-pointer select-none bg-gray-50 border-b-2 border-gray-300">Severity{sortArrow('severity_level')}</th>
                    <th onClick={() => handleSort('mapping_count')} className="text-left px-4 py-2 text-gray-700 font-bold text-xs cursor-pointer select-none bg-gray-50 border-b-2 border-gray-300">Mappings{sortArrow('mapping_count')}</th>
                    <th className="text-left px-4 py-2 text-gray-700 font-bold text-xs bg-gray-50 border-b-2 border-gray-300">Status</th>
                    <th onClick={() => handleSort('total_executions')} className="text-left px-4 py-2 text-gray-700 font-bold text-xs cursor-pointer select-none bg-gray-50 border-b-2 border-gray-300">Executions{sortArrow('total_executions')}</th>
                    <th className="text-left px-4 py-2 text-gray-700 font-bold text-xs bg-gray-50 border-b-2 border-gray-300">Last Execution</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.map((rule: RuleUsageItem, idx: number) => {
                    const rowBg = idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-50/30';
                    const isUnmapped = rule.mapping_count === 0;
                    const isExpanded = expandedRuleId === rule.rule_id;
                    const cacheKey = selectedTenant ? `${rule.rule_id}:${selectedTenant}` : rule.rule_id;
                    const mappings = expandedMappings[cacheKey] || [];
                    return (
                      <React.Fragment key={`${rule.rule_id}-${idx}`}>
                        <tr className={isUnmapped ? 'bg-yellow-50/30' : rowBg}>
                          <td className="px-4 py-2 font-mono text-sm font-medium border-b border-gray-200">{rule.rule_id}</td>
                          <td className="px-4 py-2 border-b border-gray-200">{rule.rule_name || '\u2014'}</td>
                          <td className="px-4 py-2 font-mono border-b border-gray-200">{rule.control_id || '\u2014'}</td>
                          <td className="px-4 py-2 border-b border-gray-200">
                            <StatusPill status={rule.severity_level || 'UNKNOWN'} />
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200">
                            {isUnmapped ? (
                              <span className="text-red-500 font-semibold">0</span>
                            ) : (
                              <button
                                onClick={() => handleToggleMappings(rule.rule_id)}
                                className="font-semibold text-blue-600 bg-transparent border-none cursor-pointer px-2 py-0.5 text-xs"
                              >
                                {rule.mapping_count}
                                {isExpanded ? ' \u2212' : ' +'}
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200">
                            <StatusBadge
                              status={rule.enabled_flag ? 'Enabled' : 'Disabled'}
                              size="sm"
                              variant={rule.enabled_flag ? 'success' : 'warning'}
                            />
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200">
                            <span className="font-semibold">{rule.total_executions}</span>
                          </td>
                          <td className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
                            {rule.last_execution ? (
                              <span>
                                <StatusPill
                                  status={
                                    rule.last_status?.toLowerCase() === 'pass' ? 'Pass' :
                                    rule.last_status?.toLowerCase() === 'fail' ? 'Fail' :
                                    rule.last_status?.toLowerCase() === 'error' ? 'Error' :
                                    'Unknown'
                                  }
                                />
                                <span className="ml-1">{new Date(rule.last_execution).toLocaleDateString()}</span>
                              </span>
                            ) : (
                              <span className="italic">No executions</span>
                            )}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="p-0 border-b border-gray-200">
                              <div className="p-3 pl-10 bg-gray-50">
                                {expandedLoading ? (
                                  <div className="py-5 text-center text-gray-500">Loading mappings...</div>
                                ) : mappings.length === 0 ? (
                                  <div className="py-4 text-center">
                                    <div className="text-sm font-semibold text-gray-700 mb-1">No mappings found</div>
                                    <div className="text-xs text-gray-500">This rule is not bound to any dataset mappings.</div>
                                  </div>
                                ) : (
                                  <table className="w-full border-collapse text-xs">
                                    <thead>
                                      <tr>
                                        <th className="text-left px-3 py-2 bg-gray-50 text-gray-700 font-semibold border-b border-gray-300">Dataset</th>
                                        <th className="text-left px-3 py-2 bg-gray-50 text-gray-700 font-semibold border-b border-gray-300">Mapping</th>
                                        <th className="text-left px-3 py-2 bg-gray-50 text-gray-700 font-semibold border-b border-gray-300">Last Run</th>
                                        <th className="text-right px-3 py-2 bg-gray-50 text-gray-700 font-semibold border-b border-gray-300">Delta</th>
                                        <th className="text-right px-3 py-2 bg-gray-50 text-gray-700 font-semibold border-b border-gray-300">Time (s)</th>
                                        <th className="text-left px-3 py-2 bg-gray-50 text-gray-700 font-semibold border-b border-gray-300">Run Date</th>
                                        <th className="text-center px-3 py-2 bg-gray-50 text-gray-700 font-semibold border-b border-gray-300">
                                          {(() => {
                                            const expandedRule = filteredRules.find((r) => r.rule_id === expandedRuleId);
                                            const controlId = expandedRule?.control_id;
                                            const projectId = projects?.[0]?.project_id;
                                            return controlId && projectId ? (
                                              <span
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setControlReportModal({ isOpen: true, controlId, controlName: `Control ${controlId}`, projectId });
                                                }}
                                                className="cursor-pointer text-blue-600 text-[11px]"
                                                title={`Open report for ${controlId}`}
                                              >
                                                \uD83D\uDD0D
                                              </span>
                                            ) : null;
                                          })()}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {mappings.map((m) => (
                                        <tr key={m.mapping_id} className={`border-b border-gray-200 ${m.execution_status === 'FAIL' ? 'bg-red-50/30' : m.execution_status === 'ERROR' ? 'bg-yellow-50/30' : ''}`}>
                                          <td className="px-3 py-2 text-gray-800 font-mono">{m.dataset_name}</td>
                                          <td className="px-3 py-2">
                                            <StatusBadge status={m.is_active ? 'Active' : 'Inactive'} size="sm" variant={m.is_active ? 'success' : 'warning'} />
                                          </td>
                                          <td className="px-3 py-2">
                                            {m.execution_status ? (
                                              <StatusPill
                                                status={
                                                  m.execution_status === 'PASS' ? 'Pass' :
                                                  m.execution_status === 'FAIL' ? 'Fail' :
                                                  m.execution_status === 'ERROR' ? 'Error' :
                                                  m.execution_status === 'SKIPPED' ? 'Skipped' :
                                                  m.execution_status
                                                }
                                              />
                                            ) : (
                                              <span className="text-gray-400 italic">Not run</span>
                                            )}
                                          </td>
                                          <td className="px-3 py-2 text-right font-mono text-gray-700">
                                            {m.delta_value != null ? m.delta_value.toLocaleString() : '\u2014'}
                                          </td>
                                          <td className="px-3 py-2 text-right font-mono text-gray-500">
                                            {m.execution_time_seconds != null ? m.execution_time_seconds.toFixed(2) : '\u2014'}
                                          </td>
                                          <td className="px-3 py-2 text-gray-500 text-[11px]">
                                            {m.last_execution_at ? new Date(m.last_execution_at).toLocaleString() : '\u2014'}
                                          </td>
                                          <td className="px-3 py-2 text-center">
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ControlReportModal
        isOpen={controlReportModal.isOpen}
        onClose={() => setControlReportModal(prev => ({ ...prev, isOpen: false }))}
        controlId={controlReportModal.controlId || ''}
        controlName={controlReportModal.controlName || ''}
        projectId={controlReportModal.projectId || ''}
      />
    </>
  );
}


