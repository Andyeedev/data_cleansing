import React, { useState, useMemo } from 'react';
import { useRules, useRuleMutations, useProjectsForTenant } from '../hooks/useRules';
import { apiPost } from '../utils/apiClient';
import { useValidationFilter } from '../context/ValidationFilterContext';
import { KpiBox, StatusPill, EmptyState } from '../components/reports/reportWidgets';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { Modal } from '../components/shared/Modal';
import type { RuleRegistryItem, RuleRegistryUpdateRequest } from '../types/rules';

type FilterStatus = 'all' | 'enabled' | 'disabled';
type FilterSeverity = 'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface ControlGroup {
  control_id: string;
  rules: RuleRegistryItem[];
}

interface ValidationIssue {
  rule_id: string;
  issue: string;
  severity: 'error' | 'warning';
}

const PAGE_SIZE = 50;

const SEVERITY_CLASSES: Record<string, string> = {
  CRITICAL: 'text-red-600',
  HIGH: 'text-yellow-600',
  MEDIUM: 'text-blue-600',
  LOW: 'text-green-600',
};

export function RuleDefinitionsTab() {
  const { tenantId } = useValidationFilter();
  const selectedTenant = tenantId || '';
  const { data, loading, error, refetch } = useRules(tenantId || undefined);
  const { data: projects } = useProjectsForTenant(tenantId || undefined);
  const { updateRule, loading: mutationLoading } = useRuleMutations();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [severityFilter, setSeverityFilter] = useState<FilterSeverity>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [localChanges, setLocalChanges] = useState<Record<string, Partial<RuleRegistryItem>>>({});
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[] | null>(null);
  const [validating, setValidating] = useState(false);
  const [autoDiscovering, setAutoDiscovering] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; type: 'delete' | 'enableAll' | 'disableAll'; control_id?: string; rule_id?: string; rule_name?: string; count?: number }>({ open: false, type: 'delete' });
  const [confirmText, setConfirmText] = useState('');

  const mergedRules = useMemo(() => {
    if (!data?.rules) return [];
    return data.rules.map((rule) => {
      const change = localChanges[rule.rule_id];
      return change ? { ...rule, ...change } : rule;
    });
  }, [data?.rules, localChanges]);

   const filteredRules = useMemo(() => {
    let result = mergedRules;
    if (selectedTenant) {
      result = result.filter((r) => r.tenant_id === selectedTenant);
    }
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
  }, [mergedRules, selectedTenant, statusFilter, severityFilter, searchQuery]);

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

  const unmappedRules = useMemo(() => {
    return mergedRules.filter((r) => !r.control_id);
  }, [mergedRules]);

  const totalPages = Math.ceil(controlGroups.length / PAGE_SIZE);
  const paginatedGroups = controlGroups.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const enabledCount = mergedRules.filter((r) => r.enabled_flag).length;
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

  const handleValidate = async () => {
    setValidating(true);
    try {
      const issues: ValidationIssue[] = [];
      for (const rule of mergedRules) {
        if (!rule.rule_name) {
          issues.push({ rule_id: rule.rule_id, issue: 'Missing rule name', severity: 'error' });
        }
        if (!rule.severity_level) {
          issues.push({ rule_id: rule.rule_id, issue: 'Missing severity level', severity: 'warning' });
        }
        if (!rule.sql_template_file) {
          issues.push({ rule_id: rule.rule_id, issue: 'No SQL template configured', severity: 'warning' });
        }
        if (!rule.control_id) {
          issues.push({ rule_id: rule.rule_id, issue: 'No control assigned', severity: 'error' });
        }
      }
      setValidationIssues(issues);
    } finally {
      setValidating(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Rule ID', 'Rule Name', 'Control', 'Severity', 'Status', 'SQL Template', 'Created At'];
    const rows = filteredRules.map((rule) => [
      rule.rule_id, rule.rule_name || '', rule.control_id || '', rule.severity_level || '',
      rule.enabled_flag ? 'Enabled' : 'Disabled', rule.sql_template_file || '', rule.created_at || ''
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'validation-rules-export.csv'; a.click();
    URL.revokeObjectURL(url);
  };

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

  const handleEnableAllInGroup = (controlId: string, count: number) => {
    setConfirmModal({ open: true, type: 'enableAll', control_id: controlId, count });
    setConfirmText('');
  };

  const handleDisableAllInGroup = (controlId: string, count: number) => {
    setConfirmModal({ open: true, type: 'disableAll', control_id: controlId, count });
    setConfirmText('');
  };

  const handleConfirmGroupAction = async () => {
    if (!confirmModal.control_id) return;
    const group = controlGroups.find((g) => g.control_id === confirmModal.control_id);
    if (!group) return;

    const enable = confirmModal.type === 'enableAll';
    for (const rule of group.rules) {
      await updateRule(rule.rule_id, { enabled_flag: enable } as RuleRegistryUpdateRequest);
    }
    setConfirmModal({ open: false, type: 'delete' });
    setConfirmText('');
    refetch();
  };

  const handleCancelGroupAction = () => {
    setConfirmModal({ open: false, type: 'delete' });
    setConfirmText('');
  };

  const isGroupConfirmValid = confirmModal.type === 'enableAll'
    ? confirmText.toLowerCase() === 'enable all'
    : confirmText.toLowerCase() === 'disable all';

  if (loading) return <LoadingSkeleton rows={4} variant="card" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <>
      {/* ========== TOOLBAR ========== */}
      <div className="flex gap-2 items-center mb-4 flex-wrap">
        <button onClick={handleAutoDiscover} disabled={autoDiscovering} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {autoDiscovering ? 'Discovering...' : 'Auto-Discover'}
        </button>
        <button onClick={handleValidate} disabled={validating} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm border border-gray-300 rounded-md cursor-pointer disabled:cursor-not-allowed">
          {validating ? 'Validating...' : 'Validate'}
        </button>
        <button
          onClick={handleSave}
          disabled={mutationLoading || Object.keys(localChanges).length === 0}
          className={`px-4 py-2 text-sm rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            Object.keys(localChanges).length > 0
              ? 'bg-green-600 text-white border-none'
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}
        >
          {mutationLoading ? 'Saving...' : `Save${Object.keys(localChanges).length > 0 ? ` (${Object.keys(localChanges).length})` : ''}`}
        </button>
        <button onClick={handleExportCSV} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm border border-gray-300 rounded-md cursor-pointer">
          Export CSV
        </button>
      </div>

      {data && (
        <>
          {/* ========== KPI ROW ========== */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-6">
            <KpiBox label="Total Rules" value={mergedRules.length} tone="info" />
            <KpiBox label="Controls" value={controlGroups.length} tone="info" />
            <KpiBox label="Enabled" value={enabledCount} tone="success" />
            <KpiBox label="Critical" value={criticalCount} tone="error" />
          </div>

          {/* ========== PROGRESS BAR ========== */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Enabled Rate</span>
              <span>{mergedRules.length > 0 ? Math.round((enabledCount / mergedRules.length) * 100) : 0}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
              <div
                className="h-full bg-green-500 rounded transition-all duration-300"
                style={{ width: `${mergedRules.length > 0 ? (enabledCount / mergedRules.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* ========== INFO BANNER ========== */}
          <div className="p-3 mb-4 bg-blue-50 rounded-md border border-blue-200 text-xs text-gray-500">
            <strong className="text-blue-600">Validation Rules</strong> define what to check during migration. <strong>Controls</strong> group related rules (e.g., C01 = Record Completeness). Use <strong>Auto-Discover</strong> to generate rules from column metadata.
          </div>

          {/* ========== VALIDATION ISSUES ========== */}
          {validationIssues && validationIssues.length > 0 && (
            <div className="p-4 mb-4 bg-yellow-50 rounded-md border border-yellow-400">
              <div className="font-semibold text-yellow-600 mb-2">
                Validation found {validationIssues.length} issue(s)
              </div>
              {validationIssues.slice(0, 10).map((issue, i) => (
                <div key={i} className="text-xs text-gray-600 mb-0.5">
                  <StatusPill status={issue.severity === 'error' ? 'Error' : 'Warning'} />
                  <span className="ml-1">{issue.rule_id}: {issue.issue}</span>
                </div>
              ))}
              {validationIssues.length > 10 && (
                <div className="text-xs text-gray-500 mt-1">
                  ...and {validationIssues.length - 10} more issues
                </div>
              )}
            </div>
          )}

          {validationIssues !== null && validationIssues.length === 0 && (
            <div className="p-4 mb-4 bg-green-50 rounded-md border border-green-500">
              <div className="font-semibold text-green-600">All rules passed validation</div>
            </div>
          )}

          {/* ========== UNMAPPED RULES ========== */}
          {unmappedRules.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <div className="text-sm font-semibold mb-2">Rules Without Control ({unmappedRules.length})</div>
              <div className="flex flex-wrap gap-1">
                {unmappedRules.map((rule) => (
                  <span key={rule.rule_id} className="px-2 py-0.5 bg-red-50 rounded text-xs text-red-600">{rule.rule_id}</span>
                ))}
              </div>
            </div>
          )}

          {/* ========== FILTERS ========== */}
          <div className="flex gap-4 mb-4 items-center flex-wrap">
            <div className="flex-1 min-w-52">
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search rules or controls..." />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as FilterStatus); setCurrentPage(1); }} className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">
              <option value="all">All Status</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
            <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value as FilterSeverity); setCurrentPage(1); }} className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">
              <option value="all">All Severity</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* ========== TABLE ========== */}
          {paginatedGroups.length === 0 ? (
            <EmptyState title="No rules found" description="No validation rules match your filters." />
          ) : (
            <div className="border border-gray-200 rounded-md overflow-auto max-h-[700px]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-2 text-gray-700 font-bold text-xs bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-1">Rule ID</th>
                    <th className="text-left px-4 py-2 text-gray-700 font-bold text-xs bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-1">Rule Name</th>
                    <th className="text-left px-4 py-2 text-gray-700 font-bold text-xs bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-1">Severity</th>
                    <th className="text-left px-4 py-2 text-gray-700 font-bold text-xs bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-1">Status</th>
                    <th className="text-left px-4 py-2 text-gray-700 font-bold text-xs bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-1">SQL Template</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedGroups.map((group) => (
                    <React.Fragment key={group.control_id}>
                      {/* Group header */}
                      <tr>
                        <td colSpan={5} className="px-4 py-2 bg-gray-50 border-b-2 border-gray-200 font-semibold text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">Control: {group.control_id}</span>
                            <span className="text-gray-500 font-normal">({group.rules.length} rules)</span>
                            <StatusBadge
                              status={group.rules.some((r) => r.enabled_flag) ? 'Active' : 'Inactive'}
                              size="sm"
                              variant={group.rules.some((r) => r.enabled_flag) ? 'success' : 'warning'}
                            />
                            <div className="ml-auto flex gap-1">
                              <button
                                onClick={() => handleEnableAllInGroup(group.control_id, group.rules.length)}
                                className="px-2 py-0.5 bg-transparent text-green-600 border border-green-600 rounded cursor-pointer text-xs"
                              >
                                Enable All
                              </button>
                              <button
                                onClick={() => handleDisableAllInGroup(group.control_id, group.rules.length)}
                                className="px-2 py-0.5 bg-transparent text-red-600 border border-red-600 rounded cursor-pointer text-xs"
                              >
                                Disable All
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {/* Rule rows */}
                      {group.rules.map((rule, idx) => {
                        const isChanged = !!localChanges[rule.rule_id];
                        const rowBg = idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-50/30';
                        return (
                          <tr key={rule.rule_id} className={isChanged ? 'bg-blue-50/30' : rowBg}>
                            <td className="px-4 py-2 font-mono text-sm font-medium border-b border-gray-200">{rule.rule_id}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{rule.rule_name}</td>
                            <td className="px-4 py-2 border-b border-gray-200">
                              <select
                                value={rule.severity_level || 'MEDIUM'}
                                onChange={(e) => handleSeverityChange(rule.rule_id, e.target.value)}
                                className={`w-28 px-2 py-1 border border-gray-300 rounded text-xs bg-white ${SEVERITY_CLASSES[rule.severity_level || 'MEDIUM'] || 'text-gray-700'}`}
                              >
                                <option value="CRITICAL">CRITICAL</option>
                                <option value="HIGH">HIGH</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="LOW">LOW</option>
                              </select>
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">
                              <label className="inline-flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={rule.enabled_flag ?? true}
                                  onChange={(e) => handleEnabledChange(rule.rule_id, e.target.checked)}
                                  className="cursor-pointer"
                                />
                                <StatusBadge
                                  status={rule.enabled_flag ? 'Enabled' : 'Disabled'}
                                  size="sm"
                                  variant={rule.enabled_flag ? 'success' : 'warning'}
                                />
                              </label>
                            </td>
                            <td className="px-4 py-2 font-mono text-xs text-gray-500 border-b border-gray-200">
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

          {/* ========== PAGINATION ========== */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                {controlGroups.length} control group(s) \u2022 Page {currentPage}/{totalPages}
              </span>
              <div className="flex gap-2 items-center">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded bg-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
                <span className="text-sm text-gray-500">{currentPage}/{totalPages}</span>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded bg-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========== CONFIRMATION MODAL ========== */}
      <Modal
        open={confirmModal.open}
        title={confirmModal.type === 'enableAll' ? 'Enable All Rules' : 'Disable All Rules'}
        onClose={handleCancelGroupAction}
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancelGroupAction}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-md cursor-pointer text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmGroupAction}
              disabled={!isGroupConfirmValid || mutationLoading}
              className={`px-5 py-2.5 rounded-md text-sm font-medium border-none cursor-pointer ${
                isGroupConfirmValid
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
              }`}
            >
              {mutationLoading ? 'Updating...' : confirmModal.type === 'enableAll' ? 'Enable All' : 'Disable All'}
            </button>
          </div>
        }
      >
        <div className="p-4 bg-red-50 rounded-lg border-2 border-red-600 mb-5">
          <p className="text-sm mb-3 text-gray-800 leading-relaxed">
            You are about to {confirmModal.type === 'enableAll' ? 'enable' : 'disable'} <strong className="text-red-600">{confirmModal.count || 0} rule(s)</strong> in control <strong className="text-gray-800">{confirmModal.control_id}</strong>.
          </p>
          <p className="text-sm font-bold text-red-600 leading-relaxed">
            This will affect all rules in this control group.
          </p>
        </div>
        <div className="mb-5">
          <label className="block text-sm mb-2 text-gray-600 font-medium">
            Type &quot;{confirmModal.type === 'enableAll' ? 'enable all' : 'disable all'}&quot; to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-md text-sm bg-gray-50 text-gray-800 box-border outline-none"
            placeholder={confirmModal.type === 'enableAll' ? 'enable all' : 'disable all'}
            autoFocus
          />
        </div>
      </Modal>
    </>
  );
}
