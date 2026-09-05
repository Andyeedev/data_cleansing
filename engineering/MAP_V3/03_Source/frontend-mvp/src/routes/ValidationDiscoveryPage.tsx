import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRuleDiscovery } from '../hooks/useRuleDiscovery';
import { useValidationFilter } from '../context/ValidationFilterContext';
import { SplitPane } from '../components/shared/SplitPane';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { Modal } from '../components/shared/Modal';
import CascadeDropdowns from '../components/shared/CascadeDropdowns';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill, EmptyState } from '../components/reports/reportWidgets';
import type { DiscoveredRule, DiscoveryMapping, DiscoveryTreeNode } from '../types/rule_discovery';

type SortField = 'rule_id' | 'rule_name' | 'control_id' | 'dataset_name';
type SortDir = 'asc' | 'desc';
type MappingSortField = 'dataset_name' | 'rule_id' | 'rule_name' | 'sql_template';

const AUTO_REFRESH_MS = 15000;

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
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pageSize = 10;

  const {
    rules, mappings, status, loading, error, refetch, triggerDiscovery,
    controlTreeData, datasetTreeData,
  } = useRuleDiscovery(projectId || null);

  const refetchAll = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isLive && projectId) {
      intervalRef.current = setInterval(refetchAll, AUTO_REFRESH_MS);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive, refetchAll, projectId]);

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

  if (!userRoles.includes('admin')) {
    return (
      <PageContainer>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Rule Discovery</h1>
        </div>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  const sortIndicator = (field: string, currentField: string, dir: string) => currentField === field ? (dir === 'asc' ? ' \u2191' : ' \u2193') : '';

  return (
    <PageContainer>
      {/* ========== PAGE HEADER ========== */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rule Discovery</h1>
          <p className="text-sm text-gray-500 mt-1">
            {status ? `${status.rules_discovered} rules from ${status.total_mappings} mappings` : 'Auto-discover validation rules from dataset mappings'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CascadeDropdowns showBatch={false} />
          <button
            onClick={handleTrigger}
            disabled={loading || !projectId}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              loading || !projectId
                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
            }`}
          >
            {loading ? 'Discovering...' : 'Trigger Discovery'}
          </button>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              isLive
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-white' : 'bg-gray-400'}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={refetchAll}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {!projectId && <EmptyState message="No Project Selected. Select a project above to view discovered rules and mappings." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {projectId && !loading && !error && status && (
        <>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <KpiBox label="Total Mappings" value={status.total_mappings} tone="info" />
            <KpiBox label="Rules Discovered" value={status.rules_discovered} tone="info" />
            <KpiBox label="Last Discovery" value={status.last_discovery_at ? new Date(status.last_discovery_at).toLocaleString() : 'Never'} tone="neutral" />
          </div>

          {/* Filters row */}
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search rules, datasets..." />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as 'all' | 'enabled' | 'disabled'); setCurrentPage(1); }}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors appearance-auto"
            >
              <option value="all">All Status</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
            {selectedControlId && (
              <button
                onClick={() => { setSelectedControlId(null); setSelectedRule(null); }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                {selectedControlId}
                <span className="text-blue-400">&times;</span>
              </button>
            )}
            {selectedDatasetName && (
              <button
                onClick={() => { setSelectedDatasetName(null); setSelectedMapping(null); }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                {selectedDatasetName}
                <span className="text-blue-400">&times;</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {/* Controls + Rules SplitPane */}
            <SplitPane
              left={
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">Controls ({controlTreeData.length})</h4>
                    <div className="flex gap-1">
                      <button onClick={expandAllControl} className="px-2 py-0.5 text-[10px] font-medium rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors">Expand All</button>
                      <button onClick={collapseAllControl} className="px-2 py-0.5 text-[10px] font-medium rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors">Collapse All</button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 max-h-[300px] overflow-y-auto">
                    {controlTreeData.length === 0 ? (
                      <EmptyState message="No controls discovered." />
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
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Discovered Rules ({filteredTableData.length})</h4>
                  {paginatedData.length === 0 ? (
                    <EmptyState message="No rules match your filters." />
                  ) : (
                    <>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                              <th onClick={() => handleSort('rule_id')} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none">Rule ID{sortIndicator('rule_id', sortField, sortDir)}</th>
                              <th onClick={() => handleSort('rule_name')} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none">Name{sortIndicator('rule_name', sortField, sortDir)}</th>
                              <th onClick={() => handleSort('control_id')} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none">Control{sortIndicator('control_id', sortField, sortDir)}</th>
                              <th onClick={() => handleSort('dataset_name')} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none">Dataset{sortIndicator('dataset_name', sortField, sortDir)}</th>
                              <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedData.map((row, idx) => (
                              <tr
                                key={`${row.rule_id}-${idx}`}
                                className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedRule?.rule_id === row.rule_id ? 'bg-blue-50' : ''}`}
                                onClick={() => setSelectedRule(row)}
                              >
                                <td className="px-3 py-2.5 font-mono text-gray-900">{row.rule_id}</td>
                                <td className="px-3 py-2.5 text-gray-700">{row.rule_name}</td>
                                <td className="px-3 py-2.5 font-mono text-gray-900">{row.control_id}</td>
                                <td className="px-3 py-2.5 font-mono text-gray-900">{row.dataset_name || '\u2014'}</td>
                                <td className="px-3 py-2.5">
                                  <StatusPill status={row.enabled_flag ? 'ENABLED' : 'DISABLED'} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between px-3 py-3 border-t border-gray-200 mt-2">
                          <span className="text-[11px] text-gray-500">
                            {(currentPage - 1) * pageSize + 1}&ndash;{Math.min(currentPage * pageSize, filteredTableData.length)} of {filteredTableData.length}
                          </span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2.5 py-1 text-[11px] rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">Prev</button>
                            <span className="text-[11px] text-gray-500">{currentPage}/{totalPages}</span>
                            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2.5 py-1 text-[11px] rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">Next</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              }
            />

            {/* Datasets + Mappings SplitPane */}
            <SplitPane
              left={
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">Datasets ({datasetTreeData.length})</h4>
                    <div className="flex gap-1">
                      <button onClick={expandAllDataset} className="px-2 py-0.5 text-[10px] font-medium rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors">Expand All</button>
                      <button onClick={collapseAllDataset} className="px-2 py-0.5 text-[10px] font-medium rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors">Collapse All</button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 max-h-[300px] overflow-y-auto">
                    {datasetTreeData.length === 0 ? (
                      <EmptyState message="No dataset mappings found." />
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
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Rule-to-Dataset Mappings ({filteredMappingsData.length})</h4>
                  {paginatedMappings.length === 0 ? (
                    <EmptyState message="No mappings match your filters." />
                  ) : (
                    <>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                              <th onClick={() => handleMappingSort('dataset_name')} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none">Dataset{sortIndicator('dataset_name', mappingSortField, mappingSortDir)}</th>
                              <th onClick={() => handleMappingSort('rule_id')} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none">Rule ID{sortIndicator('rule_id', mappingSortField, mappingSortDir)}</th>
                              <th onClick={() => handleMappingSort('rule_name')} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none">Rule Name{sortIndicator('rule_name', mappingSortField, mappingSortDir)}</th>
                              <th onClick={() => handleMappingSort('sql_template')} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none">SQL Template{sortIndicator('sql_template', mappingSortField, mappingSortDir)}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedMappings.map((m, idx) => (
                              <tr
                                key={`${m.mapping_id}-${idx}`}
                                className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedMapping?.mapping_id === m.mapping_id ? 'bg-blue-50' : ''}`}
                                onClick={() => setSelectedMapping(m)}
                              >
                                <td className="px-3 py-2.5 font-mono text-gray-900">{m.dataset_name || '\u2014'}</td>
                                <td className="px-3 py-2.5 font-mono text-gray-900">{m.rule_id}</td>
                                <td className="px-3 py-2.5 text-gray-700">{m.rule_name || '\u2014'}</td>
                                <td className="px-3 py-2.5 font-mono text-[11px] text-gray-500">{m.sql_template || '\u2014'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {mappingTotalPages > 1 && (
                        <div className="flex items-center justify-between px-3 py-3 border-t border-gray-200 mt-2">
                          <span className="text-[11px] text-gray-500">
                            {(currentPage - 1) * pageSize + 1}&ndash;{Math.min(currentPage * pageSize, filteredMappingsData.length)} of {filteredMappingsData.length}
                          </span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2.5 py-1 text-[11px] rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">Prev</button>
                            <span className="text-[11px] text-gray-500">{currentPage}/{mappingTotalPages}</span>
                            <button onClick={() => setCurrentPage((p) => Math.min(mappingTotalPages, p + 1))} disabled={currentPage === mappingTotalPages} className="px-2.5 py-1 text-[11px] rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">Next</button>
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
          <div className="flex flex-col gap-2">
            <DetailRow label="Rule ID" value={(detailModalItem as DiscoveredRule).rule_id} mono />
            <DetailRow label="Rule Name" value={(detailModalItem as DiscoveredRule).rule_name} />
            <DetailRow label="Control" value={(detailModalItem as DiscoveredRule).control_id} mono />
            <DetailRow label="Dataset" value={(detailModalItem as DiscoveredRule).dataset_name} mono />
            <DetailRow label="Mapping ID" value={(detailModalItem as DiscoveredRule).mapping_id} mono />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <StatusPill status={(detailModalItem as DiscoveredRule).enabled_flag ? 'ENABLED' : 'DISABLED'} />
            </div>
          </div>
        )}
        {detailModalItem && detailModalType === 'mapping' && (
          <div className="flex flex-col gap-2">
            <DetailRow label="Mapping ID" value={(detailModalItem as DiscoveryMapping).mapping_id} mono />
            <DetailRow label="Dataset" value={(detailModalItem as DiscoveryMapping).dataset_name} mono />
            <DetailRow label="Rule ID" value={(detailModalItem as DiscoveryMapping).rule_id} mono />
            <DetailRow label="Rule Name" value={(detailModalItem as DiscoveryMapping).rule_name} />
            <DetailRow label="SQL Template" value={(detailModalItem as DiscoveryMapping).sql_template} mono />
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string | null | undefined; mono?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={mono ? 'font-mono' : ''}>{value || '\u2014'}</span>
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
  const statusIcon = node.status === 'active' ? '\u2713' : node.status === 'inactive' ? '\u2717' : '\u26A0';
  const statusColor = node.status === 'active' ? 'text-green-600' : node.status === 'inactive' ? 'text-red-500' : 'text-yellow-500';

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
      <div
        className={`flex items-center gap-1 py-0.5 px-1 cursor-pointer text-sm rounded ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={handleClick}
      >
        {hasChildren ? <span className="w-4 text-center text-[10px] text-gray-500">{isExpanded ? '\u25BC' : '\u25B6'}</span> : <span className="w-4" />}
        <span className={`${statusColor} font-semibold`}>{statusIcon}</span>
        <span className={node.type === 'control' ? 'font-semibold text-gray-900' : 'text-gray-700'}>{node.name}</span>
        {node.type === 'control' && <span className="text-[10px] text-gray-400">({node.children?.length || 0} rules)</span>}
        {node.type === 'rule' && node.rule && (
          <button
            onClick={(e) => { e.stopPropagation(); onDetailClick(node.rule!); }}
            aria-label={`Details for ${node.name}`}
            className="ml-auto text-gray-400 border border-gray-200 rounded px-1.5 py-0 text-[10px] font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors bg-transparent"
          >
            i
          </button>
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
  const statusIcon = node.status === 'active' ? '\u2713' : node.status === 'inactive' ? '\u2717' : '\u26A0';
  const statusColor = node.status === 'active' ? 'text-green-600' : node.status === 'inactive' ? 'text-red-500' : 'text-yellow-500';

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
      <div
        className={`flex items-center gap-1 py-0.5 px-1 cursor-pointer text-sm rounded ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={handleClick}
      >
        {hasChildren ? <span className="w-4 text-center text-[10px] text-gray-500">{isExpanded ? '\u25BC' : '\u25B6'}</span> : <span className="w-4" />}
        <span className={`${statusColor} font-semibold`}>{statusIcon}</span>
        <span className={node.type === 'dataset' ? 'font-semibold text-gray-900' : 'text-gray-700'}>{node.name}</span>
        {node.type === 'dataset' && <span className="text-[10px] text-gray-400">({node.children?.length || 0} rules)</span>}
        {node.type === 'rule' && node.mapping && (
          <button
            onClick={(e) => { e.stopPropagation(); onDetailClick(node.mapping!); }}
            aria-label={`Details for ${node.name}`}
            className="ml-auto text-gray-400 border border-gray-200 rounded px-1.5 py-0 text-[10px] font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors bg-transparent"
          >
            i
          </button>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div>{node.children!.map((child) => (<MappingTreeNodeComponent key={child.id} node={child} expandedNodes={expandedNodes} onToggle={onToggle} onSelect={onSelect} onControlClick={onControlClick} onDetailClick={onDetailClick} selectedNodeId={selectedNodeId} level={level + 1} />))}</div>
      )}
    </div>
  );
}
