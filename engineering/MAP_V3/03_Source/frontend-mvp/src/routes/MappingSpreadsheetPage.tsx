import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMappingSummary, useMappingColumnsWithPending, useAutoMap, useSaveMappings, useValidateMapping, useClearPairMapping, useClearAllMappings } from '../hooks/useMapping';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { TenantFilter } from '../components/shared/TenantFilter';
import { Pagination } from '../components/shared/Pagination';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill } from '../components/reports/reportWidgets';
import type { MappingRow, TransformType } from '../types/mapping';
import { TRANSFORM_OPTIONS } from '../types/mapping';

type FilterStatus = 'all' | 'matched' | 'unmapped_source' | 'modified' | 'pending';
type SortField = 'source_table' | 'source_column' | 'target_column' | 'match_status' | 'confidence_score';
type SortDir = 'asc' | 'desc';

const TRANSFORM_COLOR_CLASSES: Record<string, string> = {
  none: 'text-gray-500',
  lowercase: 'text-blue-600',
  uppercase: 'text-blue-600',
  trim: 'text-blue-600',
  cast: 'text-yellow-600',
  map: 'text-green-600',
  concat: 'text-yellow-600',
  split: 'text-yellow-600',
  custom: 'text-red-600',
};

interface TableGroup {
  key: string;
  source_table: string;
  target_table: string;
  source_schema: string;
  target_schema: string;
  columns: MappingRow[];
}

const PAGE_SIZES = [10, 25, 50, 100];

export function MappingSpreadsheetPage() {
  const { userRoles, tenantId: userTenantId } = useAuth();
  const [selectedTenant, setSelectedTenant] = useState<string>(userTenantId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [localChanges, setLocalChanges] = useState<Record<string, Partial<MappingRow>>>({});
  const [validationResult, setValidationResult] = useState<{ valid: boolean; issues: unknown[]; type_mismatches: number } | null>(null);

  const [sortField, setSortField] = useState<SortField>('source_table');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [autoMapProgress, setAutoMapProgress] = useState<{ active: boolean; message: string }>({ active: false, message: '' });
  const [clearProgress, setClearProgress] = useState<{ active: boolean; message: string }>({ active: false, message: '' });
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; type: 'pair' | 'all'; mappingId?: string; tableName?: string; count: number } | { open: boolean; type: null; count: 0 }>({ open: false, type: null, count: 0 });
  const [confirmText, setConfirmText] = useState('');

  const { data: summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useMappingSummary(selectedTenant || undefined);
  const { data: columns, loading: columnsLoading, error: columnsError, refetch: refetchColumns } = useMappingColumnsWithPending(selectedTenant || undefined);
  const { autoMap, loading: autoMapping } = useAutoMap();
  const { save, loading: saving } = useSaveMappings();
  const { validate, loading: validating } = useValidateMapping();
  const { clearPair, loading: clearingPair } = useClearPairMapping();
  const { clearAll, loading: clearingAll } = useClearAllMappings();

  const loading = summaryLoading || columnsLoading;
  const error = summaryError || columnsError;

  const getRowKey = (col: MappingRow) => col.column_mapping_id || `pending_${col.mapping_id}_${col.source_column}`;

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    };
  }, []);

  const handleRefresh = useCallback(() => {
    const scrollY = window.scrollY;
    refetchSummary();
    refetchColumns();
    requestAnimationFrame(() => window.scrollTo(0, scrollY));
  }, [refetchSummary, refetchColumns]);

  const mergedColumns = useMemo(() => {
    if (!columns) return [];
    return columns.map((col) => {
      const key = getRowKey(col);
      const change = localChanges[key];
      return change ? { ...col, ...change } : col;
    });
  }, [columns, localChanges]);

  const filteredColumns = useMemo(() => {
    let result = mergedColumns;
    if (statusFilter !== 'all') {
      result = result.filter((col) => {
        if (statusFilter === 'matched') return col.match_status === 'AUTO_MATCHED' || col.match_status === 'MANUAL';
        if (statusFilter === 'unmapped_source') return !col.target_column;
        if (statusFilter === 'modified') return col.match_status === 'REVIEW_REQUIRED';
        if (statusFilter === 'pending') return col.match_status === 'PENDING';
        return true;
      });
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((col) =>
        col.source_column.toLowerCase().includes(q) ||
        (col.target_column && col.target_column.toLowerCase().includes(q)) ||
        col.source_table.toLowerCase().includes(q) ||
        (col.target_table && col.target_table.toLowerCase().includes(q))
      );
    }
    return result;
  }, [mergedColumns, statusFilter, searchQuery]);

  const sortedColumns = useMemo(() => {
    const sorted = [...filteredColumns];
    sorted.sort((a, b) => {
      let aVal = '';
      let bVal = '';
      switch (sortField) {
        case 'source_table': aVal = a.source_table; bVal = b.source_table; break;
        case 'source_column': aVal = a.source_column; bVal = b.source_column; break;
        case 'target_column': aVal = a.target_column || ''; bVal = b.target_column || ''; break;
        case 'match_status': aVal = a.match_status; bVal = b.match_status; break;
        case 'confidence_score': return ((a.confidence_score || 0) - (b.confidence_score || 0)) * (sortDir === 'asc' ? 1 : -1);
      }
      return aVal.localeCompare(bVal) * (sortDir === 'asc' ? 1 : -1);
    });
    return sorted;
  }, [filteredColumns, sortField, sortDir]);

  const tableGroups = useMemo(() => {
    const groupMap = new Map<string, TableGroup>();
    for (const col of sortedColumns) {
      const key = `${col.source_table}→${col.target_table || '(unmapped)'}`;
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          key,
          source_table: col.source_table,
          target_table: col.target_table || '(unmapped)',
          source_schema: col.source_schema || 'public',
          target_schema: col.target_schema || 'public',
          columns: [],
        });
      }
      groupMap.get(key)!.columns.push(col);
    }
    return Array.from(groupMap.values());
  }, [sortedColumns]);

  const totalPages = Math.ceil(tableGroups.length / pageSize);
  const paginatedGroups = tableGroups.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalRows = filteredColumns.length;

  const unmappedSource = useMemo(() => {
    if (!mergedColumns) return [];
    return mergedColumns.filter((c) => !c.target_column).map((c) => `${c.source_table}.${c.source_column}`);
  }, [mergedColumns]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="opacity-30 text-[10px]">{'\u2195'}</span>;
    return <span className="text-[10px]">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>;
  };

  const toggleGroupCollapse = (key: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleRow = (col: MappingRow) => {
    const key = getRowKey(col);
    if (col.match_status === 'PENDING' || !col.target_column) {
      setLocalChanges((prev) => ({
        ...prev,
        [key]: {
          target_column: col.source_column,
          match_status: 'MANUAL',
        },
      }));
    } else {
      setLocalChanges((prev) => ({
        ...prev,
        [key]: {
          target_column: null,
          match_status: 'PENDING',
        },
      }));
    }
  };

  const handleTransformChange = (colId: string, transform: TransformType) => {
    setLocalChanges((prev) => ({ ...prev, [colId]: { ...prev[colId], transformation: transform } }));
  };

  const handleAutoMap = async () => {
    if (!selectedTenant) return;
    const scrollY = window.scrollY;
    setAutoMapProgress({ active: true, message: 'Analyzing source columns...' });

    progressTimerRef.current = setTimeout(() => {
      setAutoMapProgress({ active: true, message: 'Matching target columns...' });
    }, 1000);

    const ok = await autoMap(selectedTenant);

    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    setAutoMapProgress({ active: true, message: 'Saving column mappings...' });

    if (ok) {
      setLocalChanges({});
      await refetchColumns();
      await refetchSummary();
      setAutoMapProgress({ active: true, message: 'Complete!' });
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
      setTimeout(() => setAutoMapProgress({ active: false, message: '' }), 800);
    } else {
      setAutoMapProgress({ active: false, message: '' });
    }
  };

  const handleConfirmClear = async () => {
    const scrollY = window.scrollY;
    if (confirmModal.type === 'pair' && confirmModal.mappingId) {
      const ok = await clearPair(confirmModal.mappingId);
      if (ok) {
        setConfirmModal({ open: false, type: null, count: 0 });
        await refetchColumns();
        await refetchSummary();
        requestAnimationFrame(() => window.scrollTo(0, scrollY));
      }
    } else if (confirmModal.type === 'all') {
      setConfirmModal({ open: false, type: null, count: 0 });
      setClearProgress({ active: true, message: 'Removing column mappings...' });

      const ok = await clearAll(selectedTenant || undefined);

      setClearProgress({ active: true, message: 'Refreshing data...' });
      if (ok) {
        await refetchColumns();
        await refetchSummary();
        setClearProgress({ active: true, message: 'Complete!' });
        requestAnimationFrame(() => window.scrollTo(0, scrollY));
        setTimeout(() => setClearProgress({ active: false, message: '' }), 800);
      } else {
        setClearProgress({ active: false, message: '' });
      }
    }
  };

  const handleSave = async () => {
    const scrollY = window.scrollY;
    const changedRows = Object.entries(localChanges)
      .filter(([id]) => !id.startsWith('pending_'))
      .map(([id, change]) => ({
        column_mapping_id: id,
        ...change,
      }));
    const ok = await save(changedRows.length > 0 ? changedRows : []);
    if (ok) {
      setLocalChanges({});
      await refetchColumns();
      await refetchSummary();
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
    }
  };

  const handleValidate = async () => {
    const result = await validate();
    if (result) setValidationResult(result);
  };

  const handleExportCSV = () => {
    const headers = ['Source Table', 'Source Column', 'Source Type', 'Target Table', 'Target Column', 'Target Type', 'Status', 'Confidence', 'Transform'];
    const rows = filteredColumns.map((col) => [
      col.source_table, col.source_column, col.source_data_type || '', col.target_table || '', col.target_column || '', col.target_data_type || '',
      col.match_status, String(col.confidence_score || ''), col.transformation || ''
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mapping-export.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearPairClick = (mappingId: string, tableName: string, count: number) => {
    setConfirmModal({ open: true, type: 'pair', mappingId, tableName, count });
    setConfirmText('');
  };

  const handleClearAllClick = () => {
    const totalActive = columns?.filter(c => c.match_status !== 'PENDING').length || 0;
    setConfirmModal({ open: true, type: 'all', count: totalActive });
    setConfirmText('');
  };

  const handleCancelClear = () => {
    setConfirmModal({ open: false, type: null, count: 0 });
    setConfirmText('');
  };

  const isConfirmValid = confirmModal.type === 'all'
    ? confirmText.toLowerCase() === 'clear all'
    : confirmText === confirmModal.tableName;

  if (!userRoles.includes('admin')) {
    return (
      <PageContainer>
        <h1 className="text-xl font-bold text-gray-900 mb-4">Migration Mappings</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  const isBusy = autoMapping || clearingPair || clearingAll;
  const progressActive = autoMapProgress.active || clearProgress.active;
  const progressMessage = autoMapProgress.active ? autoMapProgress.message : clearProgress.active ? clearProgress.message : '';

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Migration Mappings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Committed column relationships for data migration — these are actual mappings stored in the database, not potential matches from discovery
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
          <button onClick={handleRefresh} disabled={loading || isBusy} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Refresh</button>
          <button onClick={handleAutoMap} disabled={autoMapping || !selectedTenant} className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">{autoMapping ? 'Mapping...' : 'Auto Map'}</button>
          <button onClick={handleSave} disabled={saving || Object.keys(localChanges).length === 0} className={`px-3 py-1.5 text-xs font-medium rounded-md border ${Object.keys(localChanges).length > 0 ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'} disabled:opacity-50 disabled:cursor-not-allowed`}>{saving ? 'Saving...' : `Save${Object.keys(localChanges).length > 0 ? ` (${Object.keys(localChanges).length})` : ''}`}</button>
          <button onClick={handleExportCSV} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">Export CSV</button>
          <button onClick={handleClearAllClick} disabled={!selectedTenant || clearingAll || columns?.filter(c => c.match_status !== 'PENDING').length === 0} className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">{clearingAll ? 'Clearing...' : 'Clear All'}</button>
        </div>
      </div>

      {progressActive && (
        <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-blue-700 font-medium">{progressMessage}</span>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={() => { refetchSummary(); refetchColumns(); }} />}
      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {!loading && !error && summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <KpiBox label="Active Table Pairs" value={summary.tables_mapped} tone="neutral" />
            <KpiBox label="Columns Defined" value={summary.columns_mapped} tone="info" />
            <KpiBox label="Match Rate" value={`${summary.match_rate_percent}%`} tone={summary.match_rate_percent > 80 ? 'success' : summary.match_rate_percent > 50 ? 'warning' : 'error'} />
          </div>

          <ReportCard title="Match Rate" className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Match Rate</span>
              <span>{summary.match_rate_percent}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${summary.match_rate_percent > 80 ? 'bg-green-500' : summary.match_rate_percent > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${summary.match_rate_percent}%` }}
              />
            </div>
          </ReportCard>

          <div className="p-2.5 mb-4 bg-blue-50 border border-blue-200 rounded-md text-xs text-gray-500">
            <strong className="text-blue-700">Migration Mappings</strong> show actual column relationships stored in the database. Click a row to toggle mapping. Use <strong>Auto Map</strong> to populate from discovery results.
          </div>

          <div className="flex gap-3 mb-4 items-center flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search columns or tables..." />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as FilterStatus); setCurrentPage(1); }} className="px-2.5 py-1 text-xs border border-gray-200 rounded-md bg-white text-gray-700">
              <option value="all">All Statuses</option>
              <option value="matched">Matched</option>
              <option value="unmapped_source">Unmapped Source</option>
              <option value="modified">Modified</option>
              <option value="pending">Pending (No Columns)</option>
            </select>
            <button onClick={handleValidate} disabled={validating} className="px-2.5 py-1 text-xs border border-gray-200 rounded-md bg-white text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">{validating ? 'Validating...' : 'Validate'}</button>
          </div>

          {validationResult && !validationResult.valid && (
            <div className="p-3 mb-4 bg-red-50 border border-red-300 rounded-md">
              <div className="font-semibold text-red-600 mb-1">
                {validationResult.type_mismatches} type mismatch(es) found
              </div>
              {(validationResult.issues as Array<{ source_column: string; target_column: string; source_type: string; target_type: string }>).slice(0, 5).map((issue, i) => (
                <div key={i} className="text-xs text-gray-500">
                  {issue.source_column} ({issue.source_type}) {'\u2192'} {issue.target_column} ({issue.target_type})
                </div>
              ))}
            </div>
          )}

          {paginatedGroups.length === 0 ? (
            <EmptyState title="No mappings defined" description="No column mappings found. Use Auto Map to populate from discovery results." />
          ) : (
            <ReportCard title="Column Mappings" className="mb-6">
              <div className="overflow-auto max-h-[700px]">
                <table className="w-full text-sm" aria-label="Column mappings">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th onClick={() => handleSort('source_table')} className="text-left px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 sticky top-0 z-10 cursor-pointer select-none whitespace-nowrap">
                        <span className="flex items-center justify-between"><span>{'\u25B6'} Source</span><SortIcon field="source_table" /></span>
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 sticky top-0 z-10 whitespace-nowrap">Type</th>
                      <th className="text-left px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 sticky top-0 z-10 whitespace-nowrap">Transform</th>
                      <th className="text-left px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 sticky top-0 z-10 whitespace-nowrap">Rule</th>
                      <th onClick={() => handleSort('target_column')} className="text-left px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 sticky top-0 z-10 cursor-pointer select-none whitespace-nowrap">
                        <span className="flex items-center justify-between"><span>Target</span><SortIcon field="target_column" /></span>
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 sticky top-0 z-10 whitespace-nowrap">Type</th>
                      <th onClick={() => handleSort('match_status')} className="text-left px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 sticky top-0 z-10 cursor-pointer select-none whitespace-nowrap">
                        <span className="flex items-center justify-between"><span>Status</span><SortIcon field="match_status" /></span>
                      </th>
                      <th className="text-center px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 sticky top-0 z-10 w-10">{'\u2713'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedGroups.map((group) => {
                      const isCollapsed = collapsedGroups[group.key] || false;
                      const mappedCount = group.columns.filter(c => c.target_column).length;
                      return (
                        <React.Fragment key={group.key}>
                          <tr onClick={() => toggleGroupCollapse(group.key)} className="cursor-pointer bg-gray-50 border-b-2 border-gray-200">
                            <td colSpan={8} className="px-3 py-2 font-semibold text-sm text-gray-900">
                              <span className="mr-2 text-[10px]">{isCollapsed ? '\u25B6' : '\u25BC'}</span>
                              <span className="text-blue-600">{group.source_schema}.{group.source_table}</span>
                              <span className="mx-2 text-gray-400">{'\u2192'}</span>
                              <span className="text-green-600">{group.target_schema}.{group.target_table}</span>
                              <span className="ml-2 text-gray-500 font-normal">
                                ({mappedCount}/{group.columns.length} mapped)
                              </span>
                              <span className="ml-2">
                                <StatusPill status={mappedCount === group.columns.length ? 'Active' : mappedCount > 0 ? 'Partial' : 'Empty'} />
                              </span>
                              {mappedCount > 0 && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleClearPairClick(group.columns[0].mapping_id, group.source_table, mappedCount); }}
                                  disabled={clearingPair}
                                  className="ml-2 px-2 py-0.5 text-[10px] text-red-600 border border-red-300 rounded bg-transparent cursor-pointer disabled:opacity-50"
                                >
                                  Clear
                                </button>
                              )}
                            </td>
                          </tr>
                          {!isCollapsed && group.columns.map((col, idx) => {
                            const rowKey = getRowKey(col);
                            const isChanged = !!localChanges[rowKey];
                            const transform = col.transformation || 'none';
                            const isMapped = !!col.target_column;
                            return (
                              <tr
                                key={rowKey}
                                onClick={() => handleToggleRow(col)}
                                className={`cursor-pointer ${isChanged ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-50`}
                                title={isMapped ? 'Click to unmap' : 'Click to map'}
                              >
                                <td className="px-3 py-2 font-mono text-xs font-medium text-gray-900 border-b border-gray-100">{col.source_column}</td>
                                <td className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">{col.source_data_type || '\u2014'}</td>
                                <td className="px-3 py-2 border-b border-gray-100" onClick={(e) => e.stopPropagation()}>
                                  <select value={transform} onChange={(e) => handleTransformChange(rowKey, e.target.value as TransformType)} className={`w-[110px] px-2 py-1 text-[10px] border border-gray-200 rounded bg-white ${TRANSFORM_COLOR_CLASSES[transform] || 'text-gray-900'}`}>
                                    {TRANSFORM_OPTIONS.map((opt) => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-3 py-2 border-b border-gray-100" onClick={(e) => e.stopPropagation()}>
                                  <input className="w-[100px] px-2 py-1 text-[10px] border border-gray-200 rounded bg-white text-gray-900 box-border" placeholder="rule..." value={localChanges[rowKey]?.transformation || ''} onChange={(e) => handleTransformChange(rowKey, e.target.value)} />
                                </td>
                                <td className="px-3 py-2 font-mono text-xs font-medium text-gray-900 border-b border-gray-100">{col.target_column || '\u2014'}</td>
                                <td className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">{col.target_data_type || '\u2014'}</td>
                                <td className="px-3 py-2 border-b border-gray-100" onClick={(e) => e.stopPropagation()}>
                                  <StatusPill
                                    status={col.match_status === 'AUTO_MATCHED' ? 'Matched' : col.match_status === 'MANUAL' ? 'Manual' : col.match_status === 'REVIEW_REQUIRED' ? 'Review' : 'Unmapped'}
                                  />
                                </td>
                                <td className="px-3 py-2 text-center border-b border-gray-100" onClick={(e) => e.stopPropagation()}>
                                  <span className={`text-xs ${isMapped ? 'text-green-600' : 'text-gray-400'}`}>
                                    {isMapped ? '\u2717' : '\u2717'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </ReportCard>
          )}

          <div className="flex justify-end items-center mt-4 gap-6 flex-wrap">
            <Pagination page={currentPage} pageSize={pageSize} total={tableGroups.length} onPageChange={setCurrentPage} />
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {totalRows} column(s) across {tableGroups.length} table pair(s)
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500 whitespace-nowrap">Page size:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-1.5 py-0.5 text-[10px] border border-gray-200 rounded bg-white text-gray-700"
                >
                  {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {unmappedSource.length > 0 && (
            <div className="mt-6 p-3 bg-gray-50 rounded-md">
              <div className="text-xs font-semibold text-gray-700 mb-2">Source Columns Without Target ({unmappedSource.length})</div>
              <div className="flex flex-wrap gap-1">
                {unmappedSource.map((col) => (
                  <span key={col} className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px]">{col}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-[500px] w-[90%] shadow-xl border border-gray-200 relative z-[10000]">
            <h3 className="text-lg font-bold text-red-600 mb-4">
              {'\u26A0\uFE0F'} Warning: Remove Column Mappings
            </h3>
            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-600 mb-5">
              <p className="text-sm text-gray-900 mb-3 leading-relaxed">
                You are about to remove <strong className="text-red-600">{confirmModal.count} column mapping(s)</strong>.
              </p>
              {confirmModal.type === 'pair' && confirmModal.tableName && (
                <p className="text-sm text-gray-900 mb-3 leading-relaxed">
                  Table pair: <strong className="text-gray-900">{confirmModal.tableName}</strong>
                </p>
              )}
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                These mappings may have been used by MAP CLI for data migration. Reports generated from these mappings may become invalid.
              </p>
              <p className="text-sm font-bold text-red-600 leading-relaxed">
                This action cannot be undone.
              </p>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {confirmModal.type === 'all'
                  ? 'Type "clear all" to confirm:'
                  : `Type "${confirmModal.tableName}" to confirm:`}
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-md text-sm bg-gray-50 text-gray-900 outline-none focus:border-blue-500"
                placeholder={confirmModal.type === 'all' ? 'clear all' : confirmModal.tableName}
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={handleCancelClear} className="px-5 py-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200">Cancel</button>
              <button
                onClick={handleConfirmClear}
                disabled={!isConfirmValid || clearingPair || clearingAll}
                className={`px-5 py-2.5 rounded-md text-sm font-medium border-none ${
                  isConfirmValid
                    ? 'bg-red-600 text-white cursor-pointer hover:bg-red-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
                }`}
              >
                {clearingPair || clearingAll ? 'Removing...' : 'Remove Mappings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
