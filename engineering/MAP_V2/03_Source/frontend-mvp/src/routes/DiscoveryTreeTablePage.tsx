import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDiscoverySummary, useDiscoveryTree, useDiscoveryTables, triggerDiscovery, useClearAllDiscovery } from '../hooks/useDiscovery';
import { useSystemList } from '../hooks/useSystems';
import { useMigrationProjects, useMigrationTenants } from '../hooks/useMigration';
import { SplitPane } from '../components/shared/SplitPane';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { TenantFilter } from '../components/shared/TenantFilter';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill } from '../components/reports/reportWidgets';
import { DiscoveryDetailModal } from '../components/DiscoveryDetailModal';
import type { SchemaNode, DiscoveryTableRow } from '../types/discovery';

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
  const { tenants } = useMigrationTenants();

  const selectedTenantName = tenants.find((t) => t.tenant_id === selectedTenant)?.tenant_name || selectedTenant;

  const hasSystems = systems && systems.length > 0;
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

  const [discovering, setDiscovering] = useState(false);
  const [discoveryStatus, setDiscoveryStatus] = useState<string | null>(null);

  const { clearAll, loading: clearingAll } = useClearAllDiscovery();
  const [confirmModal, setConfirmModal] = useState<{ open: boolean }>({ open: false });
  const [confirmText, setConfirmText] = useState('');
  const [clearProgress, setClearProgress] = useState<{ active: boolean; message: string }>({ active: false, message: '' });

  const handleAutoDiscovery = async () => {
    if (!primaryProject || discovering) return;
    setDiscovering(true);
    setDiscoveryStatus('Starting discovery...');
    try {
      const result = await triggerDiscovery(primaryProject.project_id);
      if (result.success) {
        setDiscoveryStatus('Discovering tables and matching...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setDiscoveryStatus('Fetching results...');
        await Promise.all([refetchSummary(), refetchTree(), refetchTables()]);
        setDiscoveryStatus('Discovery complete!');
        setTimeout(() => setDiscoveryStatus(null), 2000);
      } else {
        setDiscoveryStatus('Discovery failed: ' + result.message);
        setTimeout(() => setDiscoveryStatus(null), 3000);
      }
    } catch (err) {
      setDiscoveryStatus('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setTimeout(() => setDiscoveryStatus(null), 3000);
    } finally {
      setDiscovering(false);
    }
  };

  const handleClearAllClick = () => {
    setConfirmModal({ open: true });
    setConfirmText('');
  };

  const handleCancelClear = () => {
    setConfirmModal({ open: false });
    setConfirmText('');
  };

  const handleConfirmClear = async () => {
    setConfirmModal({ open: false });
    setClearProgress({ active: true, message: 'Removing discovery mappings...' });

    const ok = await clearAll(selectedTenant || undefined);

    setClearProgress({ active: true, message: 'Refreshing data...' });
    if (ok) {
      await Promise.all([refetchSummary(), refetchTree(), refetchTables()]);
      setClearProgress({ active: true, message: 'Complete!' });
      setTimeout(() => setClearProgress({ active: false, message: '' }), 800);
    } else {
      setClearProgress({ active: false, message: '' });
    }
  };

  const isConfirmValid = confirmText.toLowerCase() === 'clear all';

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

  const statusPillVariant: Record<string, string> = {
    matched: 'success',
    unmatched_source: 'error',
    unmatched_target: 'warning',
    unmatched: 'error',
    modified: 'warning',
  };

  if (!userRoles.includes('admin')) {
    return (
      <PageContainer>
        <h1 className="text-xl font-bold text-gray-900 mb-4">Discovery</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Discovery Results</h1>
          <p className="text-sm text-gray-500 mt-0.5">Schema discovery and matching results</p>
        </div>
        <div className="flex items-center gap-2">
          {primaryProject && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoDiscovery}
                disabled={discovering}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  discovering
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait'
                    : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                }`}
              >
                {discovering ? '\u23F3 Discovering...' : 'Auto Discovery'}
              </button>
              {discoveryStatus && (
                <span className={`text-xs ${discoveryStatus.includes('failed') || discoveryStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {discoveryStatus}
                </span>
              )}
            </div>
          )}
          <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
          <button
            onClick={handleClearAllClick}
            disabled={clearingAll || !selectedTenant}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              clearingAll || !selectedTenant
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            {clearingAll ? 'Clearing...' : 'Clear All'}
          </button>
          <button
            onClick={() => { refetchSummary(); refetchTree(); refetchTables(); }}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={() => { refetchSummary(); refetchTree(); refetchTables(); }} />}
      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {clearProgress.active && (
        <div className="p-2.5 mb-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <span className="text-xs font-medium text-red-600">{clearProgress.message}</span>
        </div>
      )}

      {!loading && !error && summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <KpiBox label="Systems" value={summary.total_systems} tone="neutral" />
            <KpiBox label="Schemas" value={summary.total_schemas} tone="info" />
            <KpiBox label="Tables" value={summary.total_tables} tone="neutral" />
            <KpiBox label="Matched" value={summary.matched_tables} tone="success" />
          </div>

          <div className="flex gap-3 mb-4 items-center flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search tables..." />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as FilterStatus); setCurrentPage(1); }}
              className="px-2.5 py-1 text-xs border border-gray-200 rounded-md bg-white text-gray-700 cursor-pointer"
            >
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
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">System Tree</h4>
                  <div className="flex gap-1">
                    <button onClick={expandAll} className="px-2 py-0.5 text-[10px] border border-gray-200 rounded bg-white text-gray-700 cursor-pointer hover:bg-gray-50">Expand All</button>
                    <button onClick={collapseAll} className="px-2 py-0.5 text-[10px] border border-gray-200 rounded bg-white text-gray-700 cursor-pointer hover:bg-gray-50">Collapse All</button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-md p-3 max-h-[500px] overflow-y-auto">
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
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Discovery Results</h4>
                {paginatedData.length === 0 ? (
                  <EmptyState title="No results" description="No discovery results match your filters." />
                ) : (
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <table className="w-full text-sm" aria-label="Discovery results">
                      <thead>
                        <tr className="bg-gray-50 border-b-2 border-gray-200">
                          {[
                            { key: 'source_table', label: 'Source Table' },
                            { key: 'target_table', label: 'Target Table' },
                            { key: 'status', label: 'Status' },
                          ].map((col) => (
                            <th
                              key={col.key}
                              onClick={() => { setSortField(col.key as SortField); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}
                              className="text-left px-3 py-2 text-xs font-bold text-gray-700 cursor-pointer select-none"
                            >
                              {col.label} {sortField === col.key ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((row, idx) => (
                          <tr
                            key={`${row.source_table}-${idx}`}
                            className={`border-b border-gray-100 cursor-pointer ${
                              selectedTable?.source_table === row.source_table ? 'bg-gray-50' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleTableRowClick(row)}
                          >
                            <td className="px-3 py-2 font-mono text-xs text-gray-900">{row.source_table}</td>
                            <td className="px-3 py-2 text-gray-700">{row.target_table || '\u2014'}</td>
                            <td className="px-3 py-2">
                              <StatusPill status={statusLabels[row.status] || row.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      {(currentPage - 1) * pageSize + 1}\u2013{Math.min(currentPage * pageSize, filteredTableData.length)} of {filteredTableData.length}
                    </span>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 text-xs border border-gray-200 rounded bg-white text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >Prev</button>
                      <span className="text-xs text-gray-500">{currentPage}/{totalPages}</span>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 text-xs border border-gray-200 rounded bg-white text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >Next</button>
                    </div>
                  </div>
                )}
              </div>
            }
          />

          {selectedTable && selectedTable.column_diff && selectedTable.column_diff.length > 0 && (
            <ReportCard title={`Column Diff: ${selectedTable.source_table} \u2192 ${selectedTable.target_table || '(no target)'}`} className="mt-6">
              <div className="overflow-auto max-h-[250px]">
                <table className="w-full text-sm" aria-label="Column diff">
                  <thead className="sticky top-0 bg-gray-50 z-10">
                    <tr className="border-b-2 border-gray-200">
                      {['Column', 'Source Type', 'Target Type', 'Status'].map((h) => (
                        <th key={h} className="text-left px-3 py-2 text-xs font-bold text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTable.column_diff.map((diff, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="px-3 py-2 font-mono text-xs text-gray-900">{diff.column_name}</td>
                        <td className="px-3 py-2 text-gray-700">{diff.source_type}</td>
                        <td className="px-3 py-2 text-gray-700">{diff.target_type}</td>
                        <td className="px-3 py-2">
                          <StatusPill
                            status={diff.status === 'match' ? 'Matched' : diff.status === 'type_change' ? 'Type Change' : diff.status === 'source_only' ? 'Source Only' : 'Target Only'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportCard>
          )}
        </>
      )}

      <DiscoveryDetailModal
        open={detailModalTable !== null}
        table={detailModalTable}
        onClose={() => setDetailModalTable(null)}
      />

      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-[500px] w-[90%] shadow-xl border border-gray-200 relative z-[10000]">
            <h3 className="text-lg font-bold text-red-600 mb-4">
              {'\u26A0\uFE0F'} Warning: Clear Discovery Data
            </h3>
            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-600 mb-5">
              <p className="text-sm text-gray-900 mb-3 leading-relaxed">
                You are about to remove all discovered dataset mappings for tenant <strong className="text-red-600">{selectedTenantName}</strong>.
              </p>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Column mappings and auto-mapped relationships derived from these datasets will also be cleared.
              </p>
              <p className="text-sm font-bold text-red-600 leading-relaxed">
                This action cannot be undone.
              </p>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Type "clear all" to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-md text-sm bg-gray-50 text-gray-900 outline-none focus:border-blue-500"
                placeholder="clear all"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelClear}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                disabled={!isConfirmValid || clearingAll}
                className={`px-5 py-2.5 rounded-md text-sm font-medium border-none ${
                  isConfirmValid
                    ? 'bg-red-600 text-white cursor-pointer hover:bg-red-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
                }`}
              >
                {clearingAll ? 'Clearing...' : 'Clear Discovery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
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
  const statusColorClass = node.status === 'matched' ? 'text-green-600' : node.status === 'unmatched' ? 'text-red-600' : node.status === 'unmatched_source' ? 'text-red-600' : node.status === 'unmatched_target' ? 'text-yellow-600' : 'text-yellow-600';

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
        className={`flex items-center gap-1 py-0.5 text-sm rounded cursor-pointer ${
          isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
        }`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => {
          if (hasChildren) onToggle(node.id);
          if (node.type === 'table') onSelect(node.id, node.name);
          else onSelect(node.id);
        }}
      >
        {hasChildren ? (
          <span className="w-4 text-center text-[10px] text-gray-500">{isExpanded ? '\u25BC' : '\u25B6'}</span>
        ) : (
          <span className="w-4" />
        )}
        <span className={`${statusColorClass} font-semibold`}>{statusIcon}</span>
        <span className={node.type === 'system' || node.type === 'schema' ? 'font-semibold text-gray-900' : 'font-normal text-gray-700'}>{node.name}</span>
        {node.type === 'table' && <span className="text-[10px] text-gray-500">({node.columns?.length || 0} cols)</span>}
        {node.type === 'table' && node.target_table && <span className="text-[10px] text-gray-500"> \u2192 {node.target_table}</span>}
        {node.type === 'table' && node.mapped_from_table && !node.target_table && <span className="text-[10px] text-gray-500"> \u2190 {node.mapped_from_table}</span>}
        {node.type === 'table' && (
          <button
            onClick={(e) => { e.stopPropagation(); onDetailClick(node); }}
            aria-label={`Additional info for ${node.name}`}
            className="ml-auto border border-gray-200 rounded cursor-pointer text-gray-500 text-[10px] px-1.5 py-0 leading-[14px] font-mono font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors"
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
