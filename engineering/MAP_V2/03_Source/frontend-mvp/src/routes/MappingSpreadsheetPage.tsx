import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMappingSummary, useMappingColumnsWithPending, useAutoMap, useSaveMappings, useValidateMapping, useClearPairMapping, useClearAllMappings } from '../hooks/useMapping';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { TenantFilter } from '../components/shared/TenantFilter';
import { Pagination } from '../components/shared/Pagination';
import type { MappingRow, TransformType } from '../types/mapping';
import { TRANSFORM_OPTIONS } from '../types/mapping';

type FilterStatus = 'all' | 'matched' | 'unmapped_source' | 'modified' | 'pending';
type SortField = 'source_table' | 'source_column' | 'target_column' | 'match_status' | 'confidence_score';
type SortDir = 'asc' | 'desc';

const TRANSFORM_COLORS: Record<string, string> = {
  none: 'var(--color-text-secondary)',
  lowercase: 'var(--color-info)',
  uppercase: 'var(--color-info)',
  trim: 'var(--color-info)',
  cast: 'var(--color-warning)',
  map: 'var(--color-success)',
  concat: 'var(--color-warning)',
  split: 'var(--color-warning)',
  custom: 'var(--color-danger)',
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

  // Sorting
  const [sortField, setSortField] = useState<SortField>('source_table');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Collapse/expand
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Progress tracking
  const [autoMapProgress, setAutoMapProgress] = useState<{ active: boolean; message: string }>({ active: false, message: '' });
  const [clearProgress, setClearProgress] = useState<{ active: boolean; message: string }>({ active: false, message: '' });
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // REF 1: Confirmation modal state
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

  // Unique row key generator (handles PENDING rows with null column_mapping_id)
  const getRowKey = (col: MappingRow) => col.column_mapping_id || `pending_${col.mapping_id}_${col.source_column}`;

  // Cleanup progress timer on unmount
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

  // Sorting
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

  // =========================
  // Sorting handler
  // =========================
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
    if (sortField !== field) return <span style={{ opacity: 0.3, fontSize: '10px' }}>{'\u2195'}</span>;
    return <span style={{ fontSize: '10px' }}>{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>;
  };

  // =========================
  // Collapse/expand
  // =========================
  const toggleGroupCollapse = (key: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // =========================
  // Individual row toggle (map/unmap)
  // =========================
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

  // =========================
  // Auto Map with progress simulation
  // =========================
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

  // =========================
  // Clear All with progress simulation
  // =========================
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

  // =========================
  // REF 1: Clear pair / Clear all handlers
  // =========================
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
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Migration Mappings</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 1, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' };
  const tdStyle: React.CSSProperties = { padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-sm)', borderBottom: '1px solid var(--color-border)' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-xs)', background: 'var(--color-background)', color: 'var(--color-text)', boxSizing: 'border-box' };
  const groupHeaderStyle: React.CSSProperties = { padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)', fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', cursor: 'pointer' };

  const isBusy = autoMapping || clearingPair || clearingAll;
  const progressActive = autoMapProgress.active || clearProgress.active;
  const progressMessage = autoMapProgress.active ? autoMapProgress.message : clearProgress.active ? clearProgress.message : '';

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Migration Mappings"
        description="Committed column relationships for data migration — these are actual mappings stored in the database, not potential matches from discovery"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            <button onClick={handleRefresh} disabled={loading || isBusy} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: loading || isBusy ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: loading || isBusy ? 0.5 : 1 }}>
              Refresh
            </button>
            <button onClick={handleAutoMap} disabled={autoMapping || !selectedTenant} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: autoMapping || !selectedTenant ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: autoMapping || !selectedTenant ? 0.5 : 1 }}>
              {autoMapping ? 'Mapping...' : 'Auto Map'}
            </button>
            <button onClick={handleSave} disabled={saving || Object.keys(localChanges).length === 0} style={{ padding: 'var(--space-sm) var(--space-md)', background: Object.keys(localChanges).length > 0 ? 'var(--color-success)' : 'var(--color-bg-secondary)', color: Object.keys(localChanges).length > 0 ? '#fff' : 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: saving ? 0.5 : 1 }}>
              {saving ? 'Saving...' : `Save${Object.keys(localChanges).length > 0 ? ` (${Object.keys(localChanges).length})` : ''}`}
            </button>
            <button onClick={handleExportCSV} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
              Export CSV
            </button>
            <button onClick={handleClearAllClick} disabled={!selectedTenant || clearingAll || columns?.filter(c => c.match_status !== 'PENDING').length === 0} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-danger)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: !selectedTenant || clearingAll ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: !selectedTenant || clearingAll || columns?.filter(c => c.match_status !== 'PENDING').length === 0 ? 0.5 : 1 }}>
              {clearingAll ? 'Clearing...' : 'Clear All'}
            </button>
          </div>
        }
      />

      {/* ========================= Progress Bar ========================= */}
      {progressActive && (
        <div style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)', background: 'rgba(var(--color-info-rgb, 59,130,246), 0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(var(--color-info-rgb, 59,130,246), 0.2)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div style={{ width: 16, height: 16, border: '2px solid var(--color-info)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-info)', fontWeight: 500 }}>{progressMessage}</span>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {error && <ErrorState message={error} onRetry={() => { refetchSummary(); refetchColumns(); }} />}
      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {!loading && !error && summary && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <MetricCard title="Active Table Pairs" value={summary.tables_mapped} />
            <MetricCard title="Columns Defined" value={summary.columns_mapped} />
            <MetricCard title="Match Rate" value={`${summary.match_rate_percent}%`} color={summary.match_rate_percent > 80 ? 'var(--color-success)' : summary.match_rate_percent > 50 ? 'var(--color-warning)' : 'var(--color-danger)'} />
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
              <span>Match Rate</span>
              <span>{summary.match_rate_percent}%</span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--color-bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${summary.match_rate_percent}%`, height: '100%', background: summary.match_rate_percent > 80 ? 'var(--color-success)' : summary.match_rate_percent > 50 ? 'var(--color-warning)' : 'var(--color-danger)', borderRadius: 4, transition: 'width 0.3s' }} />
            </div>
          </div>

          <div style={{ padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-md)', background: 'rgba(var(--color-info-rgb, 59,130,246), 0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(var(--color-info-rgb, 59,130,246), 0.2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            <strong style={{ color: 'var(--color-info)' }}>Migration Mappings</strong> show actual column relationships stored in the database. Click a row to toggle mapping. Use <strong>Auto Map</strong> to populate from discovery results.
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search columns or tables..." />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as FilterStatus); setCurrentPage(1); }} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
              <option value="all">All Statuses</option>
              <option value="matched">Matched</option>
              <option value="unmapped_source">Unmapped Source</option>
              <option value="modified">Modified</option>
              <option value="pending">Pending (No Columns)</option>
            </select>
            <button onClick={handleValidate} disabled={validating} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: 'var(--font-size-sm)', cursor: validating ? 'not-allowed' : 'pointer' }}>
              {validating ? 'Validating...' : 'Validate'}
            </button>
          </div>

          {validationResult && !validationResult.valid && (
            <div style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-md)', background: 'rgba(var(--color-danger-rgb, 239,68,68), 0.1)', borderRadius: 'var(--radius)', border: '1px solid var(--color-danger)' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-danger)', marginBottom: 'var(--space-xs)' }}>
                {validationResult.type_mismatches} type mismatch(es) found
              </div>
              {(validationResult.issues as Array<{ source_column: string; target_column: string; source_type: string; target_type: string }>).slice(0, 5).map((issue, i) => (
                <div key={i} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  {issue.source_column} ({issue.source_type}) {'\u2192'} {issue.target_column} ({issue.target_type})
                </div>
              ))}
            </div>
          )}

          {paginatedGroups.length === 0 ? (
            <EmptyState title="No mappings defined" description="No column mappings found. Use Auto Map to populate from discovery results." />
          ) : (
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'auto', maxHeight: '700px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                <thead>
                  <tr>
                    <th style={thStyle} onClick={() => handleSort('source_table')}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{'\u25B6'} Source</span>
                        <SortIcon field="source_table" />
                      </span>
                    </th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Transform</th>
                    <th style={thStyle}>Rule</th>
                    <th style={thStyle} onClick={() => handleSort('target_column')}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>Target</span>
                        <SortIcon field="target_column" />
                      </span>
                    </th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle} onClick={() => handleSort('match_status')}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>Status</span>
                        <SortIcon field="match_status" />
                      </span>
                    </th>
                    <th style={{ ...thStyle, cursor: 'default', width: 40, textAlign: 'center' }}>{'\u2713'}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedGroups.map((group) => {
                    const isCollapsed = collapsedGroups[group.key] || false;
                    const mappedCount = group.columns.filter(c => c.target_column).length;
                    return (
                      <React.Fragment key={group.key}>
                        <tr onClick={() => toggleGroupCollapse(group.key)} style={{ cursor: 'pointer' }}>
                          <td colSpan={8} style={groupHeaderStyle}>
                            <span style={{ marginRight: 'var(--space-sm)', fontSize: '10px' }}>{isCollapsed ? '\u25B6' : '\u25BC'}</span>
                            <span style={{ color: 'var(--color-primary)' }}>{group.source_schema}.{group.source_table}</span>
                            <span style={{ margin: '0 var(--space-sm)', color: 'var(--color-text-secondary)' }}>{'\u2192'}</span>
                            <span style={{ color: 'var(--color-success)' }}>{group.target_schema}.{group.target_table}</span>
                            <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                              ({mappedCount}/{group.columns.length} mapped)
                            </span>
                            <span style={{ marginLeft: 'var(--space-sm)' }}>
                              <StatusBadge
                                status={mappedCount === group.columns.length ? 'Active' : mappedCount > 0 ? 'Partial' : 'Empty'}
                                size="sm"
                                variant={mappedCount === group.columns.length ? 'success' : mappedCount > 0 ? 'warning' : 'danger'}
                              />
                            </span>
                            {mappedCount > 0 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleClearPairClick(group.columns[0].mapping_id, group.source_table, mappedCount); }}
                                disabled={clearingPair}
                                style={{ marginLeft: 'var(--space-sm)', padding: '2px 8px', background: 'transparent', color: 'var(--color-danger)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', opacity: clearingPair ? 0.5 : 1 }}
                              >
                                Clear
                              </button>
                            )}
                          </td>
                        </tr>
                        {!isCollapsed && group.columns.map((col, idx) => {
                          const rowKey = getRowKey(col);
                          const isChanged = !!localChanges[rowKey];
                          const rowBg = idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)';
                          const transform = col.transformation || 'none';
                          const isMapped = !!col.target_column;
                          return (
                            <tr key={rowKey} onClick={() => handleToggleRow(col)} style={{ background: isChanged ? 'rgba(var(--color-primary-rgb, 59,130,246), 0.05)' : rowBg, cursor: 'pointer' }} title={isMapped ? 'Click to unmap' : 'Click to map'}>
                              <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 500 }}>{col.source_column}</td>
                              <td style={{ ...tdStyle, color: 'var(--color-text-secondary)' }}>{col.source_data_type || '\u2014'}</td>
                              <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                                <select value={transform} onChange={(e) => handleTransformChange(rowKey, e.target.value as TransformType)} style={{ ...inputStyle, width: 110, color: TRANSFORM_COLORS[transform] || 'var(--color-text)' }}>
                                  {TRANSFORM_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </td>
                              <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                                <input style={{ ...inputStyle, width: 100 }} placeholder="rule..." value={localChanges[rowKey]?.transformation || ''} onChange={(e) => handleTransformChange(rowKey, e.target.value)} />
                              </td>
                              <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 500 }}>{col.target_column || '\u2014'}</td>
                              <td style={{ ...tdStyle, color: 'var(--color-text-secondary)' }}>{col.target_data_type || '\u2014'}</td>
                              <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                               <StatusBadge
                                 status={col.match_status === 'AUTO_MATCHED' ? 'Matched' : col.match_status === 'MANUAL' ? 'Manual' : col.match_status === 'REVIEW_REQUIRED' ? 'Review' : 'Unmapped'}
                                 size="sm"
                                 variant={col.match_status === 'AUTO_MATCHED' ? 'success' : col.match_status === 'MANUAL' ? 'info' : col.match_status === 'REVIEW_REQUIRED' ? 'warning' : 'danger'}
                                 onClick={() => handleToggleRow(col)}
                                 aria-label={col.match_status === 'AUTO_MATCHED' ? 'Matched' : col.match_status === 'MANUAL' ? 'Manual' : col.match_status === 'REVIEW_REQUIRED' ? 'Review' : 'Unmapped'}
                               />
                              </td>
                              <td style={{ ...tdStyle, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: isMapped ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                                  {isMapped ? '\u2713' : '\u2717'}
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
          )}

          {/* ========================= Pagination Footer ========================= */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 'var(--space-md)', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <Pagination page={currentPage} pageSize={pageSize} total={tableGroups.length} onPageChange={setCurrentPage} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                {totalRows} column(s) across {tableGroups.length} table pair(s)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>Page size:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  style={{ padding: '2px 6px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-xs)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                >
                  {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {unmappedSource.length > 0 && (
            <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Source Columns Without Target ({unmappedSource.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {unmappedSource.map((col) => (
                  <span key={col} style={{ padding: '2px 8px', background: 'rgba(var(--color-danger-rgb, 239,68,68), 0.1)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>{col}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================= REF 1: Confirmation Modal ========================= */}
      {confirmModal.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#ffffff', borderRadius: '8px', padding: '24px', maxWidth: 500, width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', border: '1px solid #e5e7eb', position: 'relative', zIndex: 10000 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#dc2626', fontWeight: 700, margin: '0 0 16px 0' }}>
              {'\u26A0\uFE0F'} Warning: Remove Column Mappings
            </h3>

            <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '8px', border: '2px solid #dc2626', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#1f2937', lineHeight: 1.5 }}>
                You are about to remove <strong style={{ color: '#dc2626' }}>{confirmModal.count} column mapping(s)</strong>.
              </p>
              {confirmModal.type === 'pair' && confirmModal.tableName && (
                <p style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#1f2937', lineHeight: 1.5 }}>
                  Table pair: <strong style={{ color: '#1f2937' }}>{confirmModal.tableName}</strong>
                </p>
              )}
              <p style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#4b5563', lineHeight: 1.5 }}>
                These mappings may have been used by MAP CLI for data migration. Reports generated from these mappings may become invalid.
              </p>
              <p style={{ fontSize: '14px', margin: 0, fontWeight: 700, color: '#dc2626', lineHeight: 1.5 }}>
                This action cannot be undone.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#4b5563', fontWeight: 500 }}>
                {confirmModal.type === 'all'
                  ? 'Type "clear all" to confirm:'
                  : `Type "${confirmModal.tableName}" to confirm:`}
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: '#f9fafb', color: '#1f2937', boxSizing: 'border-box', outline: 'none' }}
                placeholder={confirmModal.type === 'all' ? 'clear all' : confirmModal.tableName}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelClear}
                style={{ padding: '10px 20px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                disabled={!isConfirmValid || clearingPair || clearingAll}
                style={{ padding: '10px 20px', background: isConfirmValid ? '#dc2626' : '#e5e7eb', color: isConfirmValid ? '#ffffff' : '#9ca3af', border: 'none', borderRadius: '6px', cursor: isConfirmValid ? 'pointer' : 'not-allowed', fontSize: '14px', fontWeight: 500, opacity: isConfirmValid ? 1 : 0.7 }}
              >
                {clearingPair || clearingAll ? 'Removing...' : 'Remove Mappings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
