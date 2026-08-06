import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRules } from '../hooks/useRules';
import { SplitPane } from '../components/shared/SplitPane';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { Modal } from '../components/shared/Modal';
import type { RuleRegistryItem } from '../types/rules';

type SortField = 'rule_id' | 'rule_name' | 'control_id' | 'severity_level';
type SortDir = 'asc' | 'desc';
type FilterStatus = 'all' | 'enabled' | 'disabled';
type FilterSeverity = 'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface TreeNode {
  id: string;
  name: string;
  type: 'control' | 'rule';
  status: 'active' | 'inactive' | 'critical';
  children?: TreeNode[];
  rule?: RuleRegistryItem;
}

export function ValidationDiscoveryPage() {
  const { userRoles } = useAuth();
  const { data, loading, error, refetch } = useRules();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [severityFilter, setSeverityFilter] = useState<FilterSeverity>('all');
  const [sortField, setSortField] = useState<SortField>('control_id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [selectedRule, setSelectedRule] = useState<RuleRegistryItem | null>(null);
  const [selectedTreeNode, setSelectedTreeNode] = useState<string | null>(null);
  const [detailModalRule, setDetailModalRule] = useState<RuleRegistryItem | null>(null);
  const pageSize = 10;

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Rule Discovery</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const treeData = useMemo((): TreeNode[] => {
    if (!data?.rules) return [];
    const controlMap = new Map<string, TreeNode>();
    for (const rule of data.rules) {
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
      controlNode.children!.push({
        id: rule.rule_id,
        name: rule.rule_name || rule.rule_id,
        type: 'rule',
        status: rule.enabled_flag ? 'active' : 'inactive',
        rule,
      });
    }
    return Array.from(controlMap.values()).sort((a, b) => a.id.localeCompare(b.id));
  }, [data?.rules]);

  const filteredTableData = useMemo(() => {
    if (!data?.rules) return [];
    let result = data.rules;
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
      result = result.filter(
        (r) =>
          r.rule_id.toLowerCase().includes(q) ||
          (r.rule_name && r.rule_name.toLowerCase().includes(q)) ||
          (r.control_id && r.control_id.toLowerCase().includes(q))
      );
    }
    result = [...result].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
    return result;
  }, [data?.rules, statusFilter, severityFilter, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filteredTableData.length / pageSize);
  const paginatedData = filteredTableData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }, []);

  const expandAll = useCallback(() => {
    const all: Record<string, boolean> = {};
    const walk = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        if (n.children && n.children.length > 0) {
          all[n.id] = true;
          walk(n.children);
        }
      }
    };
    walk(treeData);
    setExpandedNodes(all);
  }, [treeData]);

  const collapseAll = useCallback(() => {
    setExpandedNodes({});
  }, []);

  const handleTreeNodeClick = useCallback((nodeId: string, ruleId?: string) => {
    setSelectedTreeNode(nodeId);
    if (ruleId) {
      setSearchQuery(ruleId);
      setCurrentPage(1);
    }
  }, []);

  const handleTableRowClick = useCallback((row: RuleRegistryItem) => {
    setSelectedRule(row);
    setSelectedTreeNode(row.rule_id);
    setExpandedNodes((prev) => ({
      ...prev,
      [row.control_id || 'UNCATEGORIZED']: true,
    }));
  }, []);

  const enabledCount = data?.rules?.filter((r) => r.enabled_flag).length || 0;
  const criticalCount = data?.rules?.filter((r) => r.severity_level === 'CRITICAL').length || 0;
  const controlCount = new Set(data?.rules?.map((r) => r.control_id)).size || 0;

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', cursor: 'pointer', userSelect: 'none', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)' };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Rule Discovery"
        description="Browse validation rules organized by control hierarchy"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
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
            <MetricCard title="Total Rules" value={data.rules.length} />
            <MetricCard title="Controls" value={controlCount} />
            <MetricCard title="Enabled" value={enabledCount} color="var(--color-success)" />
            <MetricCard title="Critical" value={criticalCount} color="var(--color-danger)" />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search rules..." />
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

          <SplitPane
            left={
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                  <h4 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>Control Tree</h4>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <button onClick={expandAll} style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', color: 'var(--color-text)', cursor: 'pointer' }}>Expand All</button>
                    <button onClick={collapseAll} style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', color: 'var(--color-text)', cursor: 'pointer' }}>Collapse All</button>
                  </div>
                </div>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 'var(--space-md)', maxHeight: '500px', overflowY: 'auto' }}>
                  {treeData.length === 0 ? (
                    <EmptyState title="No controls" description="No controls registered." />
                  ) : (
                    treeData.map((node) => (
                      <TreeNodeComponent
                        key={node.id}
                        node={node}
                        expandedNodes={expandedNodes}
                        onToggle={toggleNode}
                        onSelect={handleTreeNodeClick}
                        onDetailClick={setDetailModalRule}
                        selectedNodeId={selectedTreeNode}
                        level={0}
                      />
                    ))
                  )}
                </div>
              </div>
            }
            right={
              <div>
                <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-sm)' }}>All Rules</h4>
                {paginatedData.length === 0 ? (
                  <EmptyState title="No rules" description="No rules match your filters." />
                ) : (
                  <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
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
                          <th style={thStyle}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((row, idx) => (
                          <tr
                            key={`${row.rule_id}-${idx}`}
                            style={{ borderBottom: '1px solid var(--color-border)', background: selectedRule?.rule_id === row.rule_id ? 'var(--color-bg-secondary)' : 'transparent', cursor: 'pointer' }}
                            onClick={() => handleTableRowClick(row)}
                          >
                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{row.rule_id}</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{row.rule_name}</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{row.control_id}</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                              <StatusBadge status={row.severity_level || 'UNKNOWN'} size="sm" />
                            </td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                              <StatusBadge status={row.enabled_flag ? 'Enabled' : 'Disabled'} size="sm" variant={row.enabled_flag ? 'success' : 'warning'} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      {(currentPage - 1) * pageSize + 1}\u2013{Math.min(currentPage * pageSize, filteredTableData.length)} of {filteredTableData.length}
                    </span>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                      <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{currentPage}/{totalPages}</span>
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
                    </div>
                  </div>
                )}
              </div>
            }
          />

          {selectedRule && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
              <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>
                Rule Detail: {selectedRule.rule_id}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                <div style={{ padding: 'var(--space-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Properties</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Rule ID</span>
                      <span style={{ fontFamily: 'monospace' }}>{selectedRule.rule_id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Rule Name</span>
                      <span>{selectedRule.rule_name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Control</span>
                      <span style={{ fontFamily: 'monospace' }}>{selectedRule.control_id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Severity</span>
                      <StatusBadge status={selectedRule.severity_level || 'UNKNOWN'} size="sm" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
                      <StatusBadge status={selectedRule.enabled_flag ? 'Enabled' : 'Disabled'} size="sm" variant={selectedRule.enabled_flag ? 'success' : 'warning'} />
                    </div>
                  </div>
                </div>
                <div style={{ padding: 'var(--space-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Configuration</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>SQL Template</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{selectedRule.sql_template_file || '\u2014'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Created At</span>
                      <span>{selectedRule.created_at ? new Date(selectedRule.created_at).toLocaleString() : '\u2014'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        open={detailModalRule !== null}
        onClose={() => setDetailModalRule(null)}
        title="Rule Details"
      >
        {detailModalRule && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Rule ID</span>
              <span style={{ fontFamily: 'monospace' }}>{detailModalRule.rule_id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Rule Name</span>
              <span>{detailModalRule.rule_name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Control</span>
              <span style={{ fontFamily: 'monospace' }}>{detailModalRule.control_id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Severity</span>
              <StatusBadge status={detailModalRule.severity_level || 'UNKNOWN'} size="sm" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
              <StatusBadge status={detailModalRule.enabled_flag ? 'Enabled' : 'Disabled'} size="sm" variant={detailModalRule.enabled_flag ? 'success' : 'warning'} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>SQL Template</span>
              <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{detailModalRule.sql_template_file || '\u2014'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Created At</span>
              <span>{detailModalRule.created_at ? new Date(detailModalRule.created_at).toLocaleString() : '\u2014'}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function TreeNodeComponent({ node, expandedNodes, onToggle, onSelect, onDetailClick, selectedNodeId, level }: {
  node: TreeNode;
  expandedNodes: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSelect: (id: string, ruleId?: string) => void;
  onDetailClick: (rule: RuleRegistryItem) => void;
  selectedNodeId: string | null;
  level: number;
}) {
  const isExpanded = expandedNodes[node.id] || false;
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;

  const statusIcon = node.status === 'active' ? '\u2713' : node.status === 'inactive' ? '\u2717' : '\u26A0';
  const statusColor = node.status === 'active' ? 'var(--color-success)' : node.status === 'inactive' ? 'var(--color-danger)' : 'var(--color-warning)';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (hasChildren) onToggle(node.id);
      if (node.type === 'rule' && node.rule) onSelect(node.id, node.rule.rule_id);
    } else if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
      e.preventDefault();
      onToggle(node.id);
    } else if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
      e.preventDefault();
      onToggle(node.id);
    }
  };

  return (
    <div role={hasChildren ? 'treeitem' : undefined} aria-expanded={hasChildren ? isExpanded : undefined} tabIndex={0} onKeyDown={handleKeyDown}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-xs)',
          padding: 'var(--space-xs) 0', paddingLeft: `${level * 16}px`,
          cursor: hasChildren ? 'pointer' : 'default',
          fontSize: 'var(--font-size-sm)',
          background: isSelected ? 'var(--color-bg-secondary)' : 'transparent',
          borderRadius: 'var(--radius)',
        }}
        onClick={() => {
          if (hasChildren) onToggle(node.id);
          if (node.type === 'rule' && node.rule) onSelect(node.id, node.rule.rule_id);
          else onSelect(node.id);
        }}
      >
        {hasChildren ? (
          <span style={{ width: 16, textAlign: 'center', fontSize: 'var(--font-size-xs)' }}>{isExpanded ? '\u25BC' : '\u25B6'}</span>
        ) : (
          <span style={{ width: 16 }} />
        )}
        <span style={{ color: statusColor, fontWeight: 600 }}>{statusIcon}</span>
        <span style={{ fontWeight: node.type === 'control' ? 600 : 400 }}>{node.name}</span>
        {node.type === 'control' && <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>({node.children?.length || 0} rules)</span>}
        {node.type === 'rule' && node.rule && (
          <button
            onClick={(e) => { e.stopPropagation(); onDetailClick(node.rule!); }}
            aria-label={`Details for ${node.name}`}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              fontSize: '10px',
              padding: '1px 6px',
              lineHeight: '14px',
              fontFamily: 'monospace',
              fontWeight: 600,
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'; (e.target as HTMLElement).style.color = 'var(--color-primary)'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--color-border)'; (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'; }}
          >
            i
          </button>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeComponent key={child.id} node={child} expandedNodes={expandedNodes} onToggle={onToggle} onSelect={onSelect} onDetailClick={onDetailClick} selectedNodeId={selectedNodeId} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
