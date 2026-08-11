import React, { useState, useMemo } from 'react';
import { useRuleUsageStats } from '../hooks/useRules';
import { apiGet, apiPost } from '../utils/apiClient';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { TenantFilter } from '../components/shared/TenantFilter';
import type { RuleUsageItem } from '../hooks/useRules';

type FilterMapping = 'all' | 'mapped' | 'unmapped';
type SortField = 'rule_id' | 'rule_name' | 'control_id' | 'severity_level' | 'mapping_count' | 'total_executions';
type SortDir = 'asc' | 'desc';

interface RuleMapping {
  mapping_id: string;
  dataset_name: string;
  is_active: boolean;
  created_at: string | null;
}

export function RuleMappingsUsageTab({ selectedTenant, onTenantChange }: { selectedTenant: string; onTenantChange: (tenant: string) => void }) {
  const { data, loading, error, refetch } = useRuleUsageStats();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMapping, setFilterMapping] = useState<FilterMapping>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('all');
  const [sortField, setSortField] = useState<SortField>('control_id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [autoDiscovering, setAutoDiscovering] = useState(false);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [expandedMappings, setExpandedMappings] = useState<Record<string, RuleMapping[]>>({});
  const [expandedLoading, setExpandedLoading] = useState(false);

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
    setAutoDiscovering(true);
    try {
      await apiPost('/rules/discover', {});
      refetch();
    } catch {
    } finally {
      setAutoDiscovering(false);
    }
  };

  const handleToggleMappings = async (ruleId: string) => {
    if (expandedRuleId === ruleId) {
      setExpandedRuleId(null);
    } else {
      if (!expandedMappings[ruleId]) {
        setExpandedLoading(true);
        try {
          const result = await apiGet<{mappings: RuleMapping[], total: number}>('/rules/' + ruleId + '/mappings');
          setExpandedMappings(prev => ({ ...prev, [ruleId]: result.mappings || [] }));
        } catch {
          setExpandedMappings(prev => ({ ...prev, [ruleId]: [] }));
        } finally {
          setExpandedLoading(false);
        }
      }
      setExpandedRuleId(ruleId);
    }
  };

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 16px', color: '#374151', fontWeight: 700, fontSize: '12px', cursor: 'pointer', userSelect: 'none', background: '#f3f4f6', borderBottom: '2px solid #d1d5db' };
  const tdStyle: React.CSSProperties = { padding: '8px 16px', fontSize: '14px', borderBottom: '1px solid #e5e7eb' };

  if (loading) return <LoadingSkeleton rows={4} variant="card" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <>
      <div style={{ padding: '8px 16px', marginBottom: '16px', background: 'rgba(59,130,246,0.08)', borderRadius: '6px', border: '1px solid rgba(59,130,246,0.2)', fontSize: '12px', color: '#6b7280' }}>
        <strong style={{ color: '#3b82f6' }}>Rule Mappings & Usage</strong> shows which rules are bound to dataset mappings via <code>core.rule_dataset_mapping</code> and their execution history. Rules with <strong>0 mappings</strong> are not applied to any dataset.
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <TenantFilter selectedTenant={selectedTenant} onChange={onTenantChange} />
        <button onClick={handleAutoDiscover} disabled={autoDiscovering} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: autoDiscovering ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: autoDiscovering ? 0.5 : 1 }}>
          {autoDiscovering ? 'Discovering...' : 'Auto-Discover'}
        </button>
        <button onClick={refetch} style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
          Refresh
        </button>
      </div>

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <MetricCard title="Total Rules" value={totalRules} />
            <MetricCard title="Mapped Rules" value={mappedRules} color="#10b981" subtitle={`of ${totalRules} total`} />
            <MetricCard title="Unmapped Rules" value={unmappedRules} color={unmappedRules > 0 ? '#ef4444' : '#10b981'} subtitle={unmappedRules > 0 ? 'Not bound to any dataset' : 'All rules mapped'} />
            <MetricCard title="Total Mappings" value={totalMappings} subtitle="rule-to-dataset bindings" />
          </div>

          {unmappedRules > 0 && (
            <div style={{ padding: '16px', marginBottom: '16px', background: 'rgba(245,158,11,0.1)', borderRadius: '6px', border: '1px solid #f59e0b' }}>
              <div style={{ fontWeight: 600, color: '#f59e0b', marginBottom: '4px' }}>
                {unmappedRules} rule(s) not mapped to any dataset
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                These rules will not execute during migration. Use <strong>Auto-Discover</strong> to bind rules to datasets based on column metadata.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search rules..." />
            </div>
            <select value={filterMapping} onChange={(e) => setFilterMapping(e.target.value as FilterMapping)} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: '#ffffff', color: '#374151' }}>
              <option value="all">All Mapping Status</option>
              <option value="mapped">Mapped</option>
              <option value="unmapped">Unmapped</option>
            </select>
            <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value as 'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW')} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: '#ffffff', color: '#374151' }}>
              <option value="all">All Severity</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {filteredRules.length === 0 ? (
            <EmptyState title="No rules found" description="No rules match your filters." />
          ) : (
            <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'auto', maxHeight: '700px', background: '#fff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th style={thStyle} onClick={() => { setSortField('rule_id'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>
                      Rule ID {sortField === 'rule_id' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
                    </th>
                    <th style={thStyle} onClick={() => { setSortField('rule_name'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>
                      Name {sortField === 'rule_name' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
                    </th>
                    <th style={thStyle} onClick={() => { setSortField('control_id'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>
                      Control {sortField === 'control_id' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
                    </th>
                    <th style={thStyle} onClick={() => { setSortField('severity_level'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>
                      Severity {sortField === 'severity_level' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
                    </th>
                    <th style={thStyle} onClick={() => { setSortField('mapping_count'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>
                      Mappings {sortField === 'mapping_count' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
                    </th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle} onClick={() => { setSortField('total_executions'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>
                      Executions {sortField === 'total_executions' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
                    </th>
                    <th style={thStyle}>Last Execution</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.map((rule: RuleUsageItem, idx: number) => {
                    const rowBg = idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)';
                    const isUnmapped = rule.mapping_count === 0;
                    const isExpanded = expandedRuleId === rule.rule_id;
                    const mappings = expandedMappings[rule.rule_id] || [];
                    return (
                      <React.Fragment key={rule.rule_id}>
                        <tr style={{ background: isUnmapped ? 'rgba(245,158,11,0.05)' : rowBg }}>
                          <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 500 }}>{rule.rule_id}</td>
                          <td style={tdStyle}>{rule.rule_name || '\u2014'}</td>
                          <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{rule.control_id || '\u2014'}</td>
                          <td style={tdStyle}>
                            <StatusBadge status={rule.severity_level || 'UNKNOWN'} size="sm" />
                          </td>
                          <td style={tdStyle}>
                            {isUnmapped ? (
                              <span style={{ color: '#ef4444', fontWeight: 600 }}>0</span>
                            ) : (
                              <button
                                onClick={() => handleToggleMappings(rule.rule_id)}
                                style={{ fontWeight: 600, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px', fontSize: '12px' }}
                              >
                                {rule.mapping_count}
                                {isExpanded ? ' \u2212' : ' +'}
                              </button>
                            )}
                          </td>
                          <td style={tdStyle}>
                            <StatusBadge
                              status={rule.enabled_flag ? 'Enabled' : 'Disabled'}
                              size="sm"
                              variant={rule.enabled_flag ? 'success' : 'warning'}
                            />
                          </td>
                          <td style={tdStyle}>
                            <span style={{ fontWeight: 600 }}>{rule.total_executions}</span>
                          </td>
                          <td style={{ ...tdStyle, fontSize: '12px', color: '#6b7280' }}>
                            {rule.last_execution ? (
                              <span>
                                <StatusBadge
                                  status={rule.last_status ? (
                                    rule.last_status.toLowerCase() === 'pass' ? 'Pass' : 
                                    rule.last_status.toLowerCase() === 'fail' ? 'Fail' : 
                                    rule.last_status.toLowerCase() === 'error' ? 'Error' :
                                    'Unknown'
                                  ) : 'Unknown'}
                                  size="sm"
                                  variant={rule.last_status && rule.last_status.toLowerCase() === 'pass' ? 'success' : 'danger'}
                                />
                                <span style={{ marginLeft: '4px' }}>{new Date(rule.last_execution).toLocaleDateString()}</span>
                              </span>
                            ) : (
                              <span style={{ fontStyle: 'italic' }}>No executions</span>
                            )}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} style={{ padding: '0', borderBottom: '1px solid #e5e7eb' }}>
                              <div style={{ padding: '12px 24px', background: '#f9fafb' }}>
                                {expandedLoading ? (
                                  <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading mappings...</div>
                                ) : mappings.length === 0 ? (
                                  <div style={{ padding: '16px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: '#374151' }}>No mappings found</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>This rule is not bound to any dataset mappings.</div>
                                  </div>
                                ) : (
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                    <thead>
                                      <tr>
                                        <th style={{ textAlign: 'left', padding: '8px 12px', backgroundColor: '#f3f4f6', color: '#374151', fontWeight: 600, borderBottom: '1px solid #d1d5db' }}>Mapping ID</th>
                                        <th style={{ textAlign: 'left', padding: '8px 12px', backgroundColor: '#f3f4f6', color: '#374151', fontWeight: 600, borderBottom: '1px solid #d1d5db' }}>Dataset</th>
                                        <th style={{ textAlign: 'left', padding: '8px 12px', backgroundColor: '#f3f4f6', color: '#374151', fontWeight: 600, borderBottom: '1px solid #d1d5db' }}>Status</th>
                                        <th style={{ textAlign: 'left', padding: '8px 12px', backgroundColor: '#f3f4f6', color: '#374151', fontWeight: 600, borderBottom: '1px solid #d1d5db' }}>Created At</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {mappings.map(m => (
                                        <tr key={m.mapping_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                          <td style={{ padding: '8px 12px', color: '#1f2937', fontFamily: 'monospace' }}>{m.mapping_id}</td>
                                          <td style={{ padding: '8px 12px', color: '#1f2937', fontFamily: 'monospace' }}>{m.dataset_name}</td>
                                          <td style={{ padding: '8px 12px' }}>
                                            <StatusBadge status={m.is_active ? 'Active' : 'Inactive'} size="sm" variant={m.is_active ? 'success' : 'warning'} />
                                          </td>
                                          <td style={{ padding: '8px 12px', color: '#1f2937' }}>{m.created_at ? new Date(m.created_at).toLocaleString() : '\u2014'}</td>
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
    </>
  );
}
