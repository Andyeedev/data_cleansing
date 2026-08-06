import { useState, useMemo } from 'react';
import { useRuleUsageStats } from '../hooks/useRules';
import { apiPost } from '../utils/apiClient';
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

export function RuleMappingsUsageTab() {
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const { data, loading, error, refetch } = useRuleUsageStats();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMapping, setFilterMapping] = useState<FilterMapping>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('all');
  const [sortField, setSortField] = useState<SortField>('control_id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [autoDiscovering, setAutoDiscovering] = useState(false);

  const filteredRules = useMemo(() => {
    if (!data?.rules) return [];
    let result = data.rules;
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
  }, [data?.rules, filterMapping, filterSeverity, searchQuery, sortField, sortDir]);

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

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', cursor: 'pointer', userSelect: 'none', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)' };
  const tdStyle: React.CSSProperties = { padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-sm)', borderBottom: '1px solid var(--color-border)' };

  if (loading) return <LoadingSkeleton rows={4} variant="card" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <>
      <div style={{ padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-md)', background: 'rgba(var(--color-info-rgb, 59,130,246), 0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(var(--color-info-rgb, 59,130,246), 0.2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
        <strong style={{ color: 'var(--color-info)' }}>Rule Mappings & Usage</strong> shows which rules are bound to dataset mappings via <code>core.rule_dataset_mapping</code> and their execution history. Rules with <strong>0 mappings</strong> are not applied to any dataset.
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
        <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
        <button onClick={handleAutoDiscover} disabled={autoDiscovering} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: autoDiscovering ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: autoDiscovering ? 0.5 : 1 }}>
          {autoDiscovering ? 'Discovering...' : 'Auto-Discover'}
        </button>
        <button onClick={refetch} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
          Refresh
        </button>
      </div>

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <MetricCard title="Total Rules" value={totalRules} />
            <MetricCard title="Mapped Rules" value={mappedRules} color="var(--color-success)" subtitle={`of ${totalRules} total`} />
            <MetricCard title="Unmapped Rules" value={unmappedRules} color={unmappedRules > 0 ? 'var(--color-danger)' : 'var(--color-success)'} subtitle={unmappedRules > 0 ? 'Not bound to any dataset' : 'All rules mapped'} />
            <MetricCard title="Total Mappings" value={totalMappings} subtitle="rule-to-dataset bindings" />
          </div>

          {unmappedRules > 0 && (
            <div style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-md)', background: 'rgba(var(--color-warning-rgb, 245,158,11), 0.1)', borderRadius: 'var(--radius)', border: '1px solid var(--color-warning)' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-warning)', marginBottom: 'var(--space-xs)' }}>
                {unmappedRules} rule(s) not mapped to any dataset
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                These rules will not execute during migration. Use <strong>Auto-Discover</strong> to bind rules to datasets based on column metadata.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search rules..." />
            </div>
            <select value={filterMapping} onChange={(e) => setFilterMapping(e.target.value as FilterMapping)} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
              <option value="all">All Mapping Status</option>
              <option value="mapped">Mapped</option>
              <option value="unmapped">Unmapped</option>
            </select>
            <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value as 'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW')} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
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
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'auto', maxHeight: '700px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
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
                    return (
                      <tr key={rule.rule_id} style={{ background: isUnmapped ? 'rgba(var(--color-warning-rgb, 245,158,11), 0.05)' : rowBg }}>
                        <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 500 }}>{rule.rule_id}</td>
                        <td style={tdStyle}>{rule.rule_name || '\u2014'}</td>
                        <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{rule.control_id || '\u2014'}</td>
                        <td style={tdStyle}>
                          <StatusBadge status={rule.severity_level || 'UNKNOWN'} size="sm" />
                        </td>
                        <td style={tdStyle}>
                          {isUnmapped ? (
                            <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>0</span>
                          ) : (
                            <span style={{ fontWeight: 600 }}>{rule.mapping_count}</span>
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
                        <td style={{ ...tdStyle, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                          {rule.last_execution ? (
                            <span>
                              <StatusBadge
                                status={rule.last_status === 'pass' ? 'Pass' : rule.last_status === 'fail' ? 'Fail' : 'Error'}
                                size="sm"
                                variant={rule.last_status === 'pass' ? 'success' : 'danger'}
                              />
                              <span style={{ marginLeft: 'var(--space-xs)' }}>{new Date(rule.last_execution).toLocaleDateString()}</span>
                            </span>
                          ) : (
                            <span style={{ fontStyle: 'italic' }}>No executions</span>
                          )}
                        </td>
                      </tr>
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
