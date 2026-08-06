import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRules, useRuleMutations } from '../hooks/useRules';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import type { RuleRegistryItem, RuleRegistryUpdateRequest } from '../types/rules';

type FilterStatus = 'all' | 'enabled' | 'disabled';
type FilterSeverity = 'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface ControlGroup {
  control_id: string;
  rules: RuleRegistryItem[];
}

const PAGE_SIZE = 50;

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: 'var(--color-danger)',
  HIGH: 'var(--color-warning)',
  MEDIUM: 'var(--color-info)',
  LOW: 'var(--color-success)',
};

export function ValidationRulesPage() {
  const { userRoles } = useAuth();
  const { data, loading, error, refetch } = useRules();
  const { updateRule, loading: mutationLoading } = useRuleMutations();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [severityFilter, setSeverityFilter] = useState<FilterSeverity>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [localChanges, setLocalChanges] = useState<Record<string, Partial<RuleRegistryItem>>>({});

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Validation Rules</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const mergedRules = useMemo(() => {
    if (!data?.rules) return [];
    return data.rules.map((rule) => {
      const change = localChanges[rule.rule_id];
      return change ? { ...rule, ...change } : rule;
    });
  }, [data?.rules, localChanges]);

  const filteredRules = useMemo(() => {
    let result = mergedRules;
    if (statusFilter !== 'all') {
      result = result.filter((r) => {
        if (statusFilter === 'enabled') return r.enabled_flag;
        if (statusFilter === 'disabled') return !r.enabled_flag;
        return true;
      });
    }
    if (severityFilter !== 'all') {
      result = result.filter((r) => r.severity_level === severityFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) =>
        r.rule_id.toLowerCase().includes(q) ||
        (r.rule_name && r.rule_name.toLowerCase().includes(q)) ||
        (r.control_id && r.control_id.toLowerCase().includes(q))
      );
    }
    return result;
  }, [mergedRules, statusFilter, severityFilter, searchQuery]);

  const controlGroups = useMemo(() => {
    const groupMap = new Map<string, ControlGroup>();
    for (const rule of filteredRules) {
      const key = rule.control_id || 'UNCATEGORIZED';
      if (!groupMap.has(key)) {
        groupMap.set(key, { control_id: key, rules: [] });
      }
      groupMap.get(key)!.rules.push(rule);
    }
    return Array.from(groupMap.values()).sort((a, b) => a.control_id.localeCompare(b.control_id));
  }, [filteredRules]);

  const totalPages = Math.ceil(controlGroups.length / PAGE_SIZE);
  const paginatedGroups = controlGroups.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const enabledCount = mergedRules.filter((r) => r.enabled_flag).length;
  const disabledCount = mergedRules.filter((r) => !r.enabled_flag).length;
  const criticalCount = mergedRules.filter((r) => r.severity_level === 'CRITICAL').length;

  const handleEnabledChange = (ruleId: string, enabled: boolean) => {
    setLocalChanges((prev) => ({ ...prev, [ruleId]: { ...prev[ruleId], enabled_flag: enabled } }));
  };

  const handleSeverityChange = (ruleId: string, severity: string) => {
    setLocalChanges((prev) => ({ ...prev, [ruleId]: { ...prev[ruleId], severity_level: severity } }));
  };

  const handleSave = async () => {
    for (const [ruleId, changes] of Object.entries(localChanges)) {
      await updateRule(ruleId, changes as RuleRegistryUpdateRequest);
    }
    setLocalChanges({});
    refetch();
  };

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 1 };
  const tdStyle: React.CSSProperties = { padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-sm)', borderBottom: '1px solid var(--color-border)' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-xs)', background: 'var(--color-background)', color: 'var(--color-text)', boxSizing: 'border-box' };
  const groupHeaderStyle: React.CSSProperties = { padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)', fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Validation Rules"
        description="Manage validation rules grouped by control — rules define what to check, controls group related rules"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <button onClick={handleSave} disabled={mutationLoading || Object.keys(localChanges).length === 0} style={{ padding: 'var(--space-sm) var(--space-md)', background: Object.keys(localChanges).length > 0 ? 'var(--color-success)' : 'var(--color-bg-secondary)', color: Object.keys(localChanges).length > 0 ? '#fff' : 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: mutationLoading ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: mutationLoading || Object.keys(localChanges).length === 0 ? 0.5 : 1 }}>
              {mutationLoading ? 'Saving...' : `Save${Object.keys(localChanges).length > 0 ? ` (${Object.keys(localChanges).length})` : ''}`}
            </button>
            <button onClick={refetch} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
              Refresh
            </button>
          </div>
        }
      />

      {error && <ErrorState message={error} onRetry={refetch} />}
      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {!loading && !error && data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <MetricCard title="Total Rules" value={mergedRules.length} />
            <MetricCard title="Enabled" value={enabledCount} color="var(--color-success)" />
            <MetricCard title="Disabled" value={disabledCount} color="var(--color-warning)" />
            <MetricCard title="Critical" value={criticalCount} color="var(--color-danger)" />
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
              <span>Enabled Rate</span>
              <span>{mergedRules.length > 0 ? Math.round((enabledCount / mergedRules.length) * 100) : 0}%</span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--color-bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${mergedRules.length > 0 ? (enabledCount / mergedRules.length) * 100 : 0}%`, height: '100%', background: 'var(--color-success)', borderRadius: 4, transition: 'width 0.3s' }} />
            </div>
          </div>

          <div style={{ padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-md)', background: 'rgba(var(--color-info-rgb, 59,130,246), 0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(var(--color-info-rgb, 59,130,246), 0.2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            <strong style={{ color: 'var(--color-info)' }}>Validation Rules</strong> define what to check during migration. <strong>Controls</strong> group related rules (e.g., C01 = Record Completeness). Rules are auto-discovered from column metadata or manually configured.
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search rules or controls..." />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as FilterStatus); setCurrentPage(1); }} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
              <option value="all">All Status</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
            <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value as FilterSeverity); setCurrentPage(1); }} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
              <option value="all">All Severity</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {paginatedGroups.length === 0 ? (
            <EmptyState title="No rules found" description="No validation rules match your filters." />
          ) : (
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'auto', maxHeight: '700px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Rule ID</th>
                    <th style={thStyle}>Rule Name</th>
                    <th style={thStyle}>Severity</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>SQL Template</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedGroups.map((group) => (
                    <React.Fragment key={group.control_id}>
                      <tr>
                        <td colSpan={5} style={groupHeaderStyle}>
                          <span style={{ color: 'var(--color-primary)' }}>Control: {group.control_id}</span>
                          <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--color-text-secondary)', fontWeight: 400 }}>({group.rules.length} rules)</span>
                          <span style={{ marginLeft: 'var(--space-sm)' }}>
                            <StatusBadge
                              status={group.rules.some((r) => r.enabled_flag) ? 'Active' : 'Inactive'}
                              size="sm"
                              variant={group.rules.some((r) => r.enabled_flag) ? 'success' : 'warning'}
                            />
                          </span>
                        </td>
                      </tr>
                      {group.rules.map((rule, idx) => {
                        const isChanged = !!localChanges[rule.rule_id];
                        const rowBg = idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)';
                        return (
                          <tr key={rule.rule_id} style={{ background: isChanged ? 'rgba(var(--color-primary-rgb, 59,130,246), 0.05)' : rowBg }}>
                            <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 500 }}>{rule.rule_id}</td>
                            <td style={tdStyle}>{rule.rule_name}</td>
                            <td style={tdStyle}>
                              <select
                                value={rule.severity_level || 'MEDIUM'}
                                onChange={(e) => handleSeverityChange(rule.rule_id, e.target.value)}
                                style={{ ...inputStyle, width: 110, color: SEVERITY_COLORS[rule.severity_level || 'MEDIUM'] || 'var(--color-text)' }}
                              >
                                <option value="CRITICAL">CRITICAL</option>
                                <option value="HIGH">HIGH</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="LOW">LOW</option>
                              </select>
                            </td>
                            <td style={tdStyle}>
                              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={rule.enabled_flag ?? true}
                                  onChange={(e) => handleEnabledChange(rule.rule_id, e.target.checked)}
                                  style={{ cursor: 'pointer' }}
                                />
                                <StatusBadge
                                  status={rule.enabled_flag ? 'Enabled' : 'Disabled'}
                                  size="sm"
                                  variant={rule.enabled_flag ? 'success' : 'warning'}
                                />
                              </label>
                            </td>
                            <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                              {rule.sql_template_file || '\u2014'}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                {controlGroups.length} control group(s) \u2022 Page {currentPage}/{totalPages}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{currentPage}/{totalPages}</span>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
