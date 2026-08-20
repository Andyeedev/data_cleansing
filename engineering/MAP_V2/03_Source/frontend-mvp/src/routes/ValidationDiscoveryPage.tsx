import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRuleDiscovery } from '../hooks/useRuleDiscovery';
import { useValidationFilter } from '../context/ValidationFilterContext';
import { SplitPane } from '../components/shared/SplitPane';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { Modal } from '../components/shared/Modal';
import CascadeDropdowns from '../components/shared/CascadeDropdowns';
import type { DiscoveredRule, DiscoveryMapping, DiscoveryTreeNode } from '../types/rule_discovery';

type SortField = 'rule_id' | 'rule_name' | 'control_id' | 'dataset_name';
type SortDir = 'asc' | 'desc';
type MappingSortField = 'dataset_name' | 'rule_id' | 'rule_name' | 'sql_template';

export function ValidationDiscoveryPage() {
  const { userRoles } = useAuth();
  const { projectId } = useValidationFilter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [selectedRule, setSelectedRule] = useState<DiscoveredRule | null>(null);
  const [selectedMapping, setSelectedMapping] = useState<DiscoveryMapping | null>(null);
  const [detailModalItem, setDetailModalItem] = useState<DiscoveredRule | DiscoveryMapping | null>(null);
  const [detailModalType, setDetailModalType] = useState<'rule' | 'mapping'>('rule');
  const [expandedControlNodes, setExpandedControlNodes] = useState<Record<string, boolean>>({});
  const [expandedDatasetNodes, setExpandedDatasetNodes] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('rule_id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [mappingSortField, setMappingSortField] = useState<MappingSortField>('dataset_name');
  const [mappingSortDir, setMappingSortDir] = useState<SortDir>('asc');
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [selectedDatasetName, setSelectedDatasetName] = useState<string | null>(null);
  const pageSize = 10;

  const {
    rules, mappings, status, loading, error, refetch, triggerDiscovery,
    controlTreeData, datasetTreeData,
  } = useRuleDiscovery(projectId || null);

  const filteredTableData = useMemo(() => {
    if (!rules?.rules) return [];
    let result = rules.rules;
    if (statusFilter === 'enabled') result = result.filter((r) => r.enabled_flag);
    if (statusFilter === 'disabled') result = result.filter((r) => !r.enabled_flag);
    if (selectedControlId) result = result.filter((r) => (r.control_id || 'UNCATEGORIZED') === selectedControlId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) =>
        r.rule_id.toLowerCase().includes(q) ||
        (r.rule_name && r.rule_name.toLowerCase().includes(q)) ||
        (r.dataset_name && r.dataset_name.toLowerCase().includes(q)) ||
        (r.control_id && r.control_id.toLowerCase().includes(q))
      );
    }
    return [...result].sort((a, b) => {
      const aVal = (a[sortField] || '').toString();
      const bVal = (b[sortField] || '').toString();
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [rules?.rules, statusFilter, searchQuery, selectedControlId, sortField, sortDir]);

  const filteredMappingsData = useMemo(() => {
    if (!mappings?.mappings) return [];
    let result = mappings.mappings;
    if (statusFilter !== 'all' && rules?.rules) {
      const matchingRuleIds = new Set(
        rules.rules.filter((r) => statusFilter === 'enabled' ? r.enabled_flag : !r.enabled_flag).map((r) => r.rule_id)
      );
      result = result.filter((m) => matchingRuleIds.has(m.rule_id));
    }
    if (selectedDatasetName) result = result.filter((m) => (m.dataset_name || 'unknown') === selectedDatasetName);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) =>
        m.rule_id.toLowerCase().includes(q) ||
        (m.rule_name && m.rule_name.toLowerCase().includes(q)) ||
        (m.dataset_name && m.dataset_name.toLowerCase().includes(q)) ||
        (m.sql_template && m.sql_template.toLowerCase().includes(q))
      );
    }
    return [...result].sort((a, b) => {
      const aVal = (a[mappingSortField] || '').toString();
      const bVal = (b[mappingSortField] || '').toString();
      return mappingSortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [mappings?.mappings, searchQuery, statusFilter, rules?.rules, selectedDatasetName, mappingSortField, mappingSortDir]);

  const totalPages = Math.ceil(filteredTableData.length / pageSize);
  const paginatedData = filteredTableData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const mappingTotalPages = Math.ceil(filteredMappingsData.length / pageSize);
  const paginatedMappings = filteredMappingsData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleControlNode = useCallback((nodeId: string) => {
    setExpandedControlNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }, []);

  const toggleDatasetNode = useCallback((nodeId: string) => {
    setExpandedDatasetNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }, []);

  const handleControlNodeSelect = useCallback((rule: DiscoveredRule | undefined) => {
    if (rule) {
      setSelectedRule(rule);
      setSelectedControlId(rule.control_id || 'UNCATEGORIZED');
    }
  }, []);

  const handleControlTreeClick = useCallback((controlId: string) => {
    setSelectedControlId(controlId);
    setSelectedRule(null);
  }, []);

  const handleDatasetNodeSelect = useCallback((mapping: DiscoveryMapping | undefined) => {
    if (mapping) {
      setSelectedMapping(mapping);
      setSelectedDatasetName(mapping.dataset_name || 'unknown');
      setCurrentPage(1);
    }
  }, []);

  const handleDatasetTreeClick = useCallback((datasetName: string) => {
    setSelectedDatasetName((prev) => prev === datasetName ? null : datasetName);
    setSelectedMapping(null);
    setCurrentPage(1);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setCurrentPage(1);
  };

  const handleMappingSort = (field: MappingSortField) => {
    if (mappingSortField === field) setMappingSortDir(mappingSortDir === 'asc' ? 'desc' : 'asc');
    else { setMappingSortField(field); setMappingSortDir('asc'); }
    setCurrentPage(1);
  };

  const handleTrigger = async () => {
    const result = await triggerDiscovery();
    if (result) await refetch();
  };

  const expandAllControl = useCallback(() => {
    const all: Record<string, boolean> = {};
    const walk = (nodes: DiscoveryTreeNode[]) => { for (const n of nodes) { if (n.children && n.children.length > 0) { all[n.id] = true; walk(n.children); } } };
    walk(controlTreeData); setExpandedControlNodes(all);
  }, [controlTreeData]);

  const collapseAllControl = useCallback(() => { setExpandedControlNodes({}); }, []);
  const expandAllDataset = useCallback(() => {
    const all: Record<string, boolean> = {};
    const walk = (nodes: DiscoveryTreeNode[]) => { for (const n of nodes) { if (n.children && n.children.length > 0) { all[n.id] = true; walk(n.children); } } };
    walk(datasetTreeData); setExpandedDatasetNodes(all);
  }, [datasetTreeData]);

  const collapseAllDataset = useCallback(() => { setExpandedDatasetNodes({}); }, []);

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', cursor: 'pointer', userSelect: 'none', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)' };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Rule Discovery</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const sortIndicator = (field: string, currentField: string, dir: string) => currentField === field ? (dir === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Rule Discovery"
        description="Auto-discover validation rules based on dataset mappings for a project"
        actions={
          <button onClick={refetch} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
            Refresh
          </button>
        }
      />

      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <CascadeDropdowns showBatch={false} />
        <div style={{ marginTop: 'var(--space-sm)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <button onClick={handleTrigger} disabled={loading || !projectId} style={{ padding: 'var(--space-sm) var(--space-lg)', background: loading || !projectId ? 'var(--color-bg-secondary)' : 'rgba(34, 197, 94, 0.1)', color: loading || !projectId ? 'var(--color-text-secondary)' : 'var(--color-success)', border: `1px solid ${loading || !projectId ? 'var(--color-border)' : 'rgba(34, 197, 94, 0.3)'}`, borderRadius: 'var(--radius)', cursor: loading || !projectId ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-base)', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {loading ? 'Discovering...' : 'Trigger Discovery'}
          </button>
        </div>
      </div>

      {!projectId && <EmptyState title="No Project Selected" description="Enter a project ID above to view discovered rules and mappings." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {projectId && !loading && !error && status && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <MetricCard title="Total Mappings" value={status.total_mappings} />
            <MetricCard title="Rules Discovered" value={status.rules_discovered} />
            <MetricCard title="Last Discovery" value={status.last_discovery_at ? new Date(status.last_discovery_at).toLocaleString() : 'Never'} />
          </div>

          <div style={{ marginBottom: 'var(--space-md)', display: 'flex', gap: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search rules, datasets..." />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as 'all' | 'enabled' | 'disabled'); setCurrentPage(1); }} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
              <option value="all">All Status</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
            {selectedControlId && (
              <button onClick={() => { setSelectedControlId(null); setSelectedRule(null); }} style={{ padding: 'var(--space-xs) var(--space-sm)', fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius)', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', cursor: 'pointer' }}>
                Clear: {selectedControlId} ✕
              </button>
            )}
            {selectedDatasetName && (
              <button onClick={() => { setSelectedDatasetName(null); setSelectedMapping(null); }} style={{ padding: 'var(--space-xs) var(--space-sm)', fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius)', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', cursor: 'pointer' }}>
                Clear: {selectedDatasetName} ✕
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <SplitPane
              left={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                    <h4 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>Controls ({controlTreeData.length})</h4>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <button onClick={expandAllControl} style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', color: 'var(--color-text)', cursor: 'pointer' }}>Expand All</button>
                      <button onClick={collapseAllControl} style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', color: 'var(--color-text)', cursor: 'pointer' }}>Collapse All</button>
                    </div>
                  </div>
                  <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 'var(--space-md)', maxHeight: '300px', overflowY: 'auto' }}>
                    {controlTreeData.length === 0 ? (
                      <EmptyState title="No controls" description="No controls discovered." />
                    ) : (
                      controlTreeData.map((node) => (
                        <DiscoveryTreeNodeComponent key={node.id} node={node} expandedNodes={expandedControlNodes} onToggle={toggleControlNode} onSelect={handleControlNodeSelect} onControlClick={handleControlTreeClick} onDetailClick={(rule) => { setDetailModalItem(rule); setDetailModalType('rule'); }} selectedNodeId={selectedRule?.rule_id || null} level={0} />
                      ))
                    )}
                  </div>
                </div>
              }
              right={
                <div>
                  <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-sm)' }}>Discovered Rules ({filteredTableData.length})</h4>
                  {paginatedData.length === 0 ? (
                    <EmptyState title="No rules" description="No rules match your filters." />
                  ) : (
                    <>
                      <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                          <thead>
                            <tr>
                              <th style={thStyle} onClick={() => handleSort('rule_id')}>Rule ID{sortIndicator('rule_id', sortField, sortDir)}</th>
                              <th style={thStyle} onClick={() => handleSort('rule_name')}>Name{sortIndicator('rule_name', sortField, sortDir)}</th>
                              <th style={thStyle} onClick={() => handleSort('control_id')}>Control{sortIndicator('control_id', sortField, sortDir)}</th>
                              <th style={thStyle} onClick={() => handleSort('dataset_name')}>Dataset{sortIndicator('dataset_name', sortField, sortDir)}</th>
                              <th style={thStyle}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedData.map((row, idx) => (
                              <tr key={`${row.rule_id}-${idx}`} style={{ borderBottom: '1px solid var(--color-border)', background: selectedRule?.rule_id === row.rule_id ? 'var(--color-bg-secondary)' : 'transparent', cursor: 'pointer' }} onClick={() => setSelectedRule(row)}>
                                <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{row.rule_id}</td>
                                <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{row.rule_name}</td>
                                <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{row.control_id}</td>
                                <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{row.dataset_name || '—'}</td>
                                <td style={{ padding: 'var(--space-sm) var(--space-md)' }}><StatusBadge status={row.enabled_flag ? 'Enabled' : 'Disabled'} size="sm" variant={row.enabled_flag ? 'success' : 'warning'} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
                          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredTableData.length)} of {filteredTableData.length}</span>
                          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{currentPage}/{totalPages}</span>
                            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              }
            />

            <SplitPane
              left={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                    <h4 style={{ fontSize: 'var(--font-size-h4)', margin: 0 }}>Datasets ({datasetTreeData.length})</h4>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <button onClick={expandAllDataset} style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', color: 'var(--color-text)', cursor: 'pointer' }}>Expand All</button>
                      <button onClick={collapseAllDataset} style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', color: 'var(--color-text)', cursor: 'pointer' }}>Collapse All</button>
                    </div>
                  </div>
                  <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 'var(--space-md)', maxHeight: '300px', overflowY: 'auto' }}>
                    {datasetTreeData.length === 0 ? (
                      <EmptyState title="No datasets" description="No dataset mappings found." />
                    ) : (
                      datasetTreeData.map((node) => (
                        <MappingTreeNodeComponent key={node.id} node={node} expandedNodes={expandedDatasetNodes} onToggle={toggleDatasetNode} onSelect={handleDatasetNodeSelect} onControlClick={handleDatasetTreeClick} onDetailClick={(mapping) => { setDetailModalItem(mapping); setDetailModalType('mapping'); }} selectedNodeId={selectedMapping?.mapping_id || null} level={0} />
                      ))
                    )}
                  </div>
                </div>
              }
              right={
                <div>
                  <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-sm)' }}>Rule-to-Dataset Mappings ({filteredMappingsData.length})</h4>
                  {paginatedMappings.length === 0 ? (
                    <EmptyState title="No mappings" description="No mappings match your filters." />
                  ) : (
                    <>
                      <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                          <thead>
                            <tr>
                              <th style={thStyle} onClick={() => handleMappingSort('dataset_name')}>Dataset{sortIndicator('dataset_name', mappingSortField, mappingSortDir)}</th>
                              <th style={thStyle} onClick={() => handleMappingSort('rule_id')}>Rule ID{sortIndicator('rule_id', mappingSortField, mappingSortDir)}</th>
                              <th style={thStyle} onClick={() => handleMappingSort('rule_name')}>Rule Name{sortIndicator('rule_name', mappingSortField, mappingSortDir)}</th>
                              <th style={thStyle} onClick={() => handleMappingSort('sql_template')}>SQL Template{sortIndicator('sql_template', mappingSortField, mappingSortDir)}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedMappings.map((m, idx) => (
                              <tr key={`${m.mapping_id}-${idx}`} style={{ borderBottom: '1px solid var(--color-border)', background: selectedMapping?.mapping_id === m.mapping_id ? 'var(--color-bg-secondary)' : 'transparent', cursor: 'pointer' }} onClick={() => setSelectedMapping(m)}>
                                <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{m.dataset_name || '—'}</td>
                                <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{m.rule_id}</td>
                                <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{m.rule_name || '—'}</td>
                                <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{m.sql_template || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {mappingTotalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
                          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredMappingsData.length)} of {filteredMappingsData.length}</span>
                          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{currentPage}/{mappingTotalPages}</span>
                            <button onClick={() => setCurrentPage((p) => Math.min(mappingTotalPages, p + 1))} disabled={currentPage === mappingTotalPages} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === mappingTotalPages ? 0.5 : 1 }}>Next</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              }
            />
          </div>
        </>
      )}

      <Modal open={detailModalItem !== null} onClose={() => setDetailModalItem(null)} title={detailModalType === 'rule' ? 'Rule Details' : 'Mapping Details'}>
        {detailModalItem && detailModalType === 'rule' && 'rule_id' in detailModalItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <DetailRow label="Rule ID" value={(detailModalItem as DiscoveredRule).rule_id} mono />
            <DetailRow label="Rule Name" value={(detailModalItem as DiscoveredRule).rule_name} />
            <DetailRow label="Control" value={(detailModalItem as DiscoveredRule).control_id} mono />
            <DetailRow label="Dataset" value={(detailModalItem as DiscoveredRule).dataset_name} mono />
            <DetailRow label="Mapping ID" value={(detailModalItem as DiscoveredRule).mapping_id} mono />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
              <StatusBadge status={(detailModalItem as DiscoveredRule).enabled_flag ? 'Enabled' : 'Disabled'} size="sm" variant={(detailModalItem as DiscoveredRule).enabled_flag ? 'success' : 'warning'} />
            </div>
          </div>
        )}
        {detailModalItem && detailModalType === 'mapping' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <DetailRow label="Mapping ID" value={(detailModalItem as DiscoveryMapping).mapping_id} mono />
            <DetailRow label="Dataset" value={(detailModalItem as DiscoveryMapping).dataset_name} mono />
            <DetailRow label="Rule ID" value={(detailModalItem as DiscoveryMapping).rule_id} mono />
            <DetailRow label="Rule Name" value={(detailModalItem as DiscoveryMapping).rule_name} />
            <DetailRow label="SQL Template" value={(detailModalItem as DiscoveryMapping).sql_template} mono />
          </div>
        )}
      </Modal>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string | null | undefined; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontFamily: mono ? 'monospace' : undefined }}>{value || '—'}</span>
    </div>
  );
}

function DiscoveryTreeNodeComponent({ node, expandedNodes, onToggle, onSelect, onControlClick, onDetailClick, selectedNodeId, level }: {
  node: DiscoveryTreeNode; expandedNodes: Record<string, boolean>; onToggle: (id: string) => void;
  onSelect?: (rule: DiscoveredRule | undefined) => void; onControlClick?: (controlId: string) => void;
  onDetailClick: (rule: DiscoveredRule) => void; selectedNodeId: string | null; level: number;
}) {
  const isExpanded = expandedNodes[node.id] || false;
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;
  const statusIcon = node.status === 'active' ? '✓' : node.status === 'inactive' ? '✗' : '⚠';
  const statusColor = node.status === 'active' ? 'var(--color-success)' : node.status === 'inactive' ? 'var(--color-danger)' : 'var(--color-warning)';

  const handleClick = () => {
    if (hasChildren) {
      onToggle(node.id);
      if (onControlClick) onControlClick(node.id);
    } else if (node.rule && onSelect) {
      onSelect(node.rule);
    }
  };

  return (
    <div role={hasChildren ? 'treeitem' : undefined} aria-expanded={hasChildren ? isExpanded : undefined} tabIndex={0}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', padding: 'var(--space-xs) 0', paddingLeft: `${level * 16}px`, cursor: 'pointer', fontSize: 'var(--font-size-sm)', background: isSelected ? 'var(--color-bg-secondary)' : 'transparent', borderRadius: 'var(--radius)' }}
        onClick={handleClick}>
        {hasChildren ? <span style={{ width: 16, textAlign: 'center', fontSize: 'var(--font-size-xs)' }}>{isExpanded ? '▼' : '▶'}</span> : <span style={{ width: 16 }} />}
        <span style={{ color: statusColor, fontWeight: 600 }}>{statusIcon}</span>
        <span style={{ fontWeight: node.type === 'control' ? 600 : 400 }}>{node.name}</span>
        {node.type === 'control' && <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>({node.children?.length || 0} rules)</span>}
        {node.type === 'rule' && node.rule && (
          <button onClick={(e) => { e.stopPropagation(); onDetailClick(node.rule!); }} aria-label={`Details for ${node.name}`} style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '10px', padding: '1px 6px', fontWeight: 600 }} onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'; (e.target as HTMLElement).style.color = 'var(--color-primary)'; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--color-border)'; (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'; }}>i</button>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div>{node.children!.map((child) => (<DiscoveryTreeNodeComponent key={child.id} node={child} expandedNodes={expandedNodes} onToggle={onToggle} onSelect={onSelect} onControlClick={onControlClick} onDetailClick={onDetailClick} selectedNodeId={selectedNodeId} level={level + 1} />))}</div>
      )}
    </div>
  );
}

function MappingTreeNodeComponent({ node, expandedNodes, onToggle, onSelect, onControlClick, onDetailClick, selectedNodeId, level }: {
  node: DiscoveryTreeNode; expandedNodes: Record<string, boolean>; onToggle: (id: string) => void;
  onSelect?: (mapping: DiscoveryMapping | undefined) => void; onControlClick?: (controlId: string) => void;
  onDetailClick: (mapping: DiscoveryMapping) => void; selectedNodeId: string | null; level: number;
}) {
  const isExpanded = expandedNodes[node.id] || false;
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;
  const statusIcon = node.status === 'active' ? '✓' : node.status === 'inactive' ? '✗' : '⚠';
  const statusColor = node.status === 'active' ? 'var(--color-success)' : node.status === 'inactive' ? 'var(--color-danger)' : 'var(--color-warning)';

  const handleClick = () => {
    if (hasChildren) {
      onToggle(node.id);
      if (onControlClick) onControlClick(node.id);
    } else if (node.mapping && onSelect) {
      onSelect(node.mapping);
    }
  };

  return (
    <div role={hasChildren ? 'treeitem' : undefined} aria-expanded={hasChildren ? isExpanded : undefined} tabIndex={0}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', padding: 'var(--space-xs) 0', paddingLeft: `${level * 16}px`, cursor: 'pointer', fontSize: 'var(--font-size-sm)', background: isSelected ? 'var(--color-bg-secondary)' : 'transparent', borderRadius: 'var(--radius)' }}
        onClick={handleClick}>
        {hasChildren ? <span style={{ width: 16, textAlign: 'center', fontSize: 'var(--font-size-xs)' }}>{isExpanded ? '▼' : '▶'}</span> : <span style={{ width: 16 }} />}
        <span style={{ color: statusColor, fontWeight: 600 }}>{statusIcon}</span>
        <span style={{ fontWeight: node.type === 'dataset' ? 600 : 400 }}>{node.name}</span>
        {node.type === 'dataset' && <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>({node.children?.length || 0} rules)</span>}
        {node.type === 'rule' && node.mapping && (
          <button onClick={(e) => { e.stopPropagation(); onDetailClick(node.mapping!); }} aria-label={`Details for ${node.name}`} style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '10px', padding: '1px 6px', fontWeight: 600 }} onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'; (e.target as HTMLElement).style.color = 'var(--color-primary)'; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--color-border)'; (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'; }}>i</button>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div>{node.children!.map((child) => (<MappingTreeNodeComponent key={child.id} node={child} expandedNodes={expandedNodes} onToggle={onToggle} onSelect={onSelect} onControlClick={onControlClick} onDetailClick={onDetailClick} selectedNodeId={selectedNodeId} level={level + 1} />))}</div>
      )}
    </div>
  );
}
