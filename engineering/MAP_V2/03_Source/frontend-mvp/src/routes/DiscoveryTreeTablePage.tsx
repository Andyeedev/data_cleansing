import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDiscoverySummary, useDiscoveryTree, useDiscoveryTables, triggerDiscovery } from '../hooks/useDiscovery';
import { useSystemList } from '../hooks/useSystems';
import { useMigrationProjects } from '../hooks/useMigration';
import { SplitPane } from '../components/shared/SplitPane';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { TenantFilter } from '../components/shared/TenantFilter';
import { DiscoveryDetailModal } from '../components/DiscoveryDetailModal';
import type { SchemaNode, DiscoveryTableRow, ColumnDiff } from '../types/discovery';

type SortField = 'source_table' | 'target_table' | 'status';
type SortDir = 'asc' | 'desc';
type FilterStatus = 'all' | 'matched' | 'unmatched_source' | 'unmatched_target' | 'modified';

export function DiscoveryTreeTablePage() {
  const { userRoles, tenantId: userTenantId } = useAuth();
  const [selectedTenant, setSelectedTenant] = useState<string>(userTenantId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('source_table');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [selectedTable, setSelectedTable] = useState<DiscoveryTableRow | null>(null);
  const [selectedTreeNode, setSelectedTreeNode] = useState<string | null>(null);
  const [detailModalTable, setDetailModalTable] = useState<SchemaNode | null>(null);
  const pageSize = 10;

  const { data: summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useDiscoverySummary(selectedTenant || undefined);
  const { data: treeData, loading: treeLoading, error: treeError, refetch: refetchTree } = useDiscoveryTree(selectedTenant || undefined);
  const { data: tableData, loading: tableLoading, error: tableError, refetch: refetchTables } = useDiscoveryTables(selectedTenant || undefined);
  const { data: systems } = useSystemList(selectedTenant || undefined);
  const { projects } = useMigrationProjects(undefined, selectedTenant || undefined);

  const hasSystems = systems && systems.length > 0;
  const hasMappings = summary && summary.total_tables > 0;
  const showAutoDiscovery = hasSystems && !hasMappings;
  const primaryProject = projects && projects.length > 0 ? projects[0] : null;

  const loading = summaryLoading || treeLoading || tableLoading;
  const error = summaryError || treeError || tableError;

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }, []);

  const expandAll = useCallback(() => {
    const all: Record<string, boolean> = {};
    const walk = (nodes: SchemaNode[]) => {
      for (const n of nodes) {
        if (n.columns && n.columns.length > 0) {
          all[n.id] = true;
          walk(n.columns);
        }
      }
    };
    walk(treeData);
    setExpandedNodes(all);
  }, [treeData]);

  const collapseAll = useCallback(() => {
    setExpandedNodes({});
  }, []);

  const handleTreeNodeClick = useCallback((nodeId: string, tableName?: string) => {
    setSelectedTreeNode(nodeId);
    if (tableName) {
      setSearchQuery(tableName);
      setCurrentPage(1);
    }
  }, []);

  const handleTableRowClick = useCallback((row: DiscoveryTableRow) => {
    setSelectedTable(row);
    // Find and expand the source system in tree
    if (treeData.length > 0) {
      const firstSystem = treeData[0];
      if (firstSystem.columns) {
        for (const schema of firstSystem.columns) {
          if (schema.columns) {
            for (const table of schema.columns) {
              if (table.name === row.source_table) {
                setSelectedTreeNode(table.id);
                setExpandedNodes((prev) => ({
                  ...prev,
                  [firstSystem.id]: true,
                  [schema.id]: true,
                }));
                return;
              }
            }
          }
        }
      }
    }
  }, [treeData]);

  const handleAutoDiscovery = async () => {
    if (!primaryProject) return;
    const result = await triggerDiscovery(primaryProject.project_id);
    if (result.success) {
      setTimeout(() => {
        refetchSummary();
        refetchTree();
        refetchTables();
      }, 2000);
    }
  };

  const filteredTableData = useMemo(() => {
    let result = tableData;
    if (statusFilter !== 'all') {
      result = result.filter((row) => row.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (row) =>
          row.source_table.toLowerCase().includes(q) ||
          (row.target_table && row.target_table.toLowerCase().includes(q))
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
  }, [tableData, statusFilter, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filteredTableData.length / pageSize);
  const paginatedData = filteredTableData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statusLabels: Record<string, string> = {
    matched: 'Matched',
    unmatched_source: 'Source Only',
    unmatched_target: 'Target Only',
    unmatched: 'Unmatched',
    modified: 'Modified',
  };

  const statusBadgeVariant: Record<string, 'success' | 'danger' | 'warning'> = {
    matched: 'success',
    unmatched_source: 'danger',
    unmatched_target: 'warning',
    unmatched: 'danger',
    modified: 'warning',
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Discovery</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', cursor: 'pointer', userSelect: 'none', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)' };
  const selectStyle: React.CSSProperties = { padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)', background: 'var(--color-background)', color: 'var(--color-text)', cursor: 'pointer' };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Discovery Results"
        description="Schema discovery and matching results"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            {showAutoDiscovery && primaryProject && (
              <button onClick={handleAutoDiscovery} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                Auto Discovery
              </button>
            )}
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            <button onClick={() => { refetchSummary(); refetchTree(); refetchTables(); }} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
              Refresh
            </button>
          </div>
        }
      />

      {error && <ErrorState message={error} onRetry={() => { refetchSummary(); refetchTree(); refetchTables(); }} />}
      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {!loading && !error && summary && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <MetricCard title="Systems" value={summary.total_systems} />
            <MetricCard title="Schemas" value={summary.total_schemas} />
            <MetricCard title="Tables" value={summary.total_tables} />
            <MetricCard title="Matched" value={summary.matched_tables} color="var(--color-success)" subtitle={`${summary.match_rate_percent}% match rate`} />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search tables..." />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as FilterStatus); setCurrentPage(1); }} style={selectStyle}>
              <option value="all">All Statuses</option>
              <option value="matched">Matched</option>
              <option value="unmatched_source">Source Only</option>
              <option value="unmatched_target">Target Only</option>
              <option value="modified">Modified</option>
            </select>
          </div>

          <SplitPane
            left={
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                  <h4 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>System Tree</h4>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <button onClick={expandAll} style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', color: 'var(--color-text)', cursor: 'pointer' }}>Expand All</button>
                    <button onClick={collapseAll} style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', color: 'var(--color-text)', cursor: 'pointer' }}>Collapse All</button>
                  </div>
                </div>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 'var(--space-md)', maxHeight: '500px', overflowY: 'auto' }}>
                  {treeData.length === 0 ? (
                    <EmptyState title="No systems" description="No systems registered." />
                  ) : (
                    treeData.map((node) => (
                      <TreeNode
                        key={node.id}
                        node={node}
                        expandedNodes={expandedNodes}
                        onToggle={toggleNode}
                        onSelect={handleTreeNodeClick}
                        onDetailClick={setDetailModalTable}
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
                <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-sm)' }}>Discovery Results</h4>
                {paginatedData.length === 0 ? (
                  <EmptyState title="No results" description="No discovery results match your filters." />
                ) : (
                  <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                      <thead>
                        <tr>
                          <th style={thStyle} onClick={() => { setSortField('source_table'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>
                            Source Table {sortField === 'source_table' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
                          </th>
                          <th style={thStyle} onClick={() => { setSortField('target_table'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>
                            Target Table {sortField === 'target_table' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
                          </th>
                          <th style={thStyle} onClick={() => { setSortField('status'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>
                            Status {sortField === 'status' ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((row, idx) => (
                          <tr
                            key={`${row.source_table}-${idx}`}
                            style={{ borderBottom: '1px solid var(--color-border)', background: selectedTable?.source_table === row.source_table ? 'var(--color-bg-secondary)' : 'transparent', cursor: 'pointer' }}
                            onClick={() => handleTableRowClick(row)}
                          >
                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{row.source_table}</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{row.target_table || '\u2014'}</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                              <StatusBadge status={statusLabels[row.status]} size="sm" variant={statusBadgeVariant[row.status]} />
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

          {selectedTable && selectedTable.column_diff && selectedTable.column_diff.length > 0 && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
              <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>
                Column Diff: {selectedTable.source_table} \u2192 {selectedTable.target_table || '(no target)'}
              </h4>
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'auto', maxHeight: 250 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-secondary)', zIndex: 1 }}>
                    <tr>
                      <th style={thStyle}>Column</th>
                      <th style={thStyle}>Source Type</th>
                      <th style={thStyle}>Target Type</th>
                      <th style={thStyle}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTable.column_diff.map((diff, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{diff.column_name}</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{diff.source_type}</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{diff.target_type}</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                          <StatusBadge
                            status={diff.status === 'match' ? 'Matched' : diff.status === 'type_change' ? 'Type Change' : diff.status === 'source_only' ? 'Source Only' : 'Target Only'}
                            size="sm"
                            variant={diff.status === 'match' ? 'success' : diff.status === 'type_change' ? 'warning' : 'danger'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <DiscoveryDetailModal
        open={detailModalTable !== null}
        table={detailModalTable}
        onClose={() => setDetailModalTable(null)}
      />
    </div>
  );
}

function TreeNode({ node, expandedNodes, onToggle, onSelect, onDetailClick, selectedNodeId, level }: {
  node: SchemaNode;
  expandedNodes: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSelect: (id: string, tableName?: string) => void;
  onDetailClick: (node: SchemaNode) => void;
  selectedNodeId: string | null;
  level: number;
}) {
  const isExpanded = expandedNodes[node.id] || false;
  const hasChildren = node.columns && node.columns.length > 0;
  const isSelected = selectedNodeId === node.id;

  const statusIcon = node.status === 'matched' ? '\u2713' : node.status === 'unmatched' ? '\u2717' : node.status === 'unmatched_source' ? '\u2717' : node.status === 'unmatched_target' ? '\u2717' : '\u26A0';
  const statusColor = node.status === 'matched' ? 'var(--color-success)' : node.status === 'unmatched' ? 'var(--color-danger)' : node.status === 'unmatched_source' ? 'var(--color-danger)' : node.status === 'unmatched_target' ? 'var(--color-warning)' : 'var(--color-warning)';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (hasChildren) onToggle(node.id);
      if (node.type === 'table') onSelect(node.id, node.name);
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
          if (node.type === 'table') onSelect(node.id, node.name);
          else onSelect(node.id);
        }}
      >
        {hasChildren ? (
          <span style={{ width: 16, textAlign: 'center', fontSize: 'var(--font-size-xs)' }}>{isExpanded ? '\u25BC' : '\u25B6'}</span>
        ) : (
          <span style={{ width: 16 }} />
        )}
        <span style={{ color: statusColor, fontWeight: 600 }}>{statusIcon}</span>
        <span style={{ fontWeight: node.type === 'system' || node.type === 'schema' ? 600 : 400 }}>{node.name}</span>
        {node.type === 'table' && <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>({node.columns?.length || 0} cols)</span>}
        {node.type === 'table' && node.target_table && <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}> \u2192 {node.target_table}</span>}
        {node.type === 'table' && node.mapped_from_table && !node.target_table && <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}> \u2190 {node.mapped_from_table}</span>}
        {node.type === 'table' && (
          <button
            onClick={(e) => { e.stopPropagation(); onDetailClick(node); }}
            aria-label={`Additional info for ${node.name}`}
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
          {node.columns!.map((child) => (
            <TreeNode key={child.id} node={child} expandedNodes={expandedNodes} onToggle={onToggle} onSelect={onSelect} onDetailClick={onDetailClick} selectedNodeId={selectedNodeId} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
