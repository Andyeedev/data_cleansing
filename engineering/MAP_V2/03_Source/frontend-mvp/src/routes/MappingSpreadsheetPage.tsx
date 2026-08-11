import React, { useState, useMemo } from 'react';
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
import type { MappingRow, TransformType } from '../types/mapping';
import { TRANSFORM_OPTIONS } from '../types/mapping';

type FilterStatus = 'all' | 'matched' | 'unmapped_source' | 'modified' | 'pending';

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

const PAGE_SIZE = 50;

export function MappingSpreadsheetPage() {
  const { userRoles, tenantId: userTenantId } = useAuth();
  const [selectedTenant, setSelectedTenant] = useState<string>(userTenantId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [localChanges, setLocalChanges] = useState<Record<string, Partial<MappingRow>>>({});
  const [validationResult, setValidationResult] = useState<{ valid: boolean; issues: unknown[]; type_mismatches: number } | null>(null);
  
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

  const mergedColumns = useMemo(() => {
    if (!columns) return [];
    return columns.map((col) => {
      const change = localChanges[col.column_mapping_id];
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

  const tableGroups = useMemo(() => {
    const groupMap = new Map<string, TableGroup>();
    for (const col of filteredColumns) {
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
  }, [filteredColumns]);

  const totalPages = Math.ceil(tableGroups.length / PAGE_SIZE);
  const paginatedGroups = tableGroups.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const unmappedSource = useMemo(() => {
    if (!mergedColumns) return [];
    return mergedColumns.filter((c) => !c.target_column).map((c) => `${c.source_table}.${c.source_column}`);
  }, [mergedColumns]);

  const handleTransformChange = (colId: string, transform: TransformType) => {
    setLocalChanges((prev) => ({ ...prev, [colId]: { ...prev[colId], transformation: transform } }));
  };

  const handleTargetChange = (colId: string, targetCol: string) => {
    setLocalChanges((prev) => ({ ...prev, [colId]: { ...prev[colId], target_column: targetCol, match_status: 'MANUAL' } }));
  };

  const handleAutoMap = async () => {
    const ok = await autoMap();
    if (ok) {
      setLocalChanges({});
      refetchColumns();
      refetchSummary();
    }
  };

  const handleSave = async () => {
    const changedRows = Object.entries(localChanges).map(([id, change]) => ({
      column_mapping_id: id,
      ...change,
    }));
    const ok = await save(changedRows);
    if (ok) {
      setLocalChanges({});
      refetchColumns();
      refetchSummary();
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

  const handleConfirmClear = async () => {
    if (confirmModal.type === 'pair' && confirmModal.mappingId) {
      const ok = await clearPair(confirmModal.mappingId);
      if (ok) {
        setConfirmModal({ open: false, type: null, count: 0 });
        refetchColumns();
        refetchSummary();
      }
    } else if (confirmModal.type === 'all') {
      const ok = await clearAll();
      if (ok) {
        setConfirmModal({ open: false, type: null, count: 0 });
        refetchColumns();
        refetchSummary();
      }
    }
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

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 1 };
  const tdStyle: React.CSSProperties = { padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-sm)', borderBottom: '1px solid var(--color-border)' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-xs)', background: 'var(--color-background)', color: 'var(--color-text)', boxSizing: 'border-box' };
  const groupHeaderStyle: React.CSSProperties = { padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)', fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Migration Mappings"
        description="Committed column relationships for data migration — these are actual mappings stored in the database, not potential matches from discovery"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            <button onClick={handleAutoMap} disabled={autoMapping} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: autoMapping ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: autoMapping ? 0.5 : 1 }}>
              {autoMapping ? 'Mapping...' : 'Auto Map'}
            </button>
            <button onClick={handleSave} disabled={saving || Object.keys(localChanges).length === 0} style={{ padding: 'var(--space-sm) var(--space-md)', background: Object.keys(localChanges).length > 0 ? 'var(--color-success)' : 'var(--color-bg-secondary)', color: Object.keys(localChanges).length > 0 ? '#fff' : 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: saving ? 0.5 : 1 }}>
              {saving ? 'Saving...' : `Save${Object.keys(localChanges).length > 0 ? ` (${Object.keys(localChanges).length})` : ''}`}
            </button>
            <button onClick={handleExportCSV} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
              Export CSV
            </button>
            <button onClick={handleClearAllClick} disabled={clearingAll || columns?.filter(c => c.match_status !== 'PENDING').length === 0} style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-danger)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: clearingAll ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: clearingAll || columns?.filter(c => c.match_status !== 'PENDING').length === 0 ? 0.5 : 1 }}>
              {clearingAll ? 'Clearing...' : 'Clear All'}
            </button>
          </div>
        }
      />

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
            <strong style={{ color: 'var(--color-info)' }}>Migration Mappings</strong> show actual column relationships stored in the database. <strong>Discovery</strong> shows potential matches found by heuristic. Use <strong>Auto Map</strong> to populate mappings from discovery results.
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
                  {issue.source_column} ({issue.source_type}) \u2192 {issue.target_column} ({issue.target_type})
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
                    <th style={thStyle}>Source</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Transform</th>
                    <th style={thStyle}>Rule</th>
                    <th style={thStyle}>Target</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedGroups.map((group) => (
                    <React.Fragment key={group.key}>
                      <tr>
                        <td colSpan={7} style={groupHeaderStyle}>
                          <span style={{ color: 'var(--color-primary)' }}>{group.source_schema}.{group.source_table}</span>
                          <span style={{ margin: '0 var(--space-sm)', color: 'var(--color-text-secondary)' }}>\u2192</span>
                          <span style={{ color: 'var(--color-success)' }}>{group.target_schema}.{group.target_table}</span>
                          <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--color-text-secondary)', fontWeight: 400 }}>({group.columns.length} columns)</span>
                          <span style={{ marginLeft: 'var(--space-sm)' }}>
                            <StatusBadge
                              status={group.columns.length > 0 ? 'Active' : 'Empty'}
                              size="sm"
                              variant={group.columns.length > 0 ? 'success' : 'warning'}
                            />
                          </span>
                          {group.columns.length > 0 && (
                            <button
                              onClick={() => handleClearPairClick(group.columns[0].mapping_id, group.source_table, group.columns.length)}
                              disabled={clearingPair}
                              style={{ marginLeft: 'var(--space-sm)', padding: '2px 8px', background: 'transparent', color: 'var(--color-danger)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-xs)', opacity: clearingPair ? 0.5 : 1 }}
                            >
                              Clear
                            </button>
                          )}
                        </td>
                      </tr>
                      {group.columns.map((col, idx) => {
                        const isChanged = !!localChanges[col.column_mapping_id];
                        const rowBg = idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)';
                        const transform = col.transformation || 'none';
                        return (
                          <tr key={col.column_mapping_id} style={{ background: isChanged ? 'rgba(var(--color-primary-rgb, 59,130,246), 0.05)' : rowBg }}>
                            <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 500 }}>{col.source_column}</td>
                            <td style={{ ...tdStyle, color: 'var(--color-text-secondary)' }}>{col.source_data_type || '\u2014'}</td>
                            <td style={tdStyle}>
                              <select value={transform} onChange={(e) => handleTransformChange(col.column_mapping_id, e.target.value as TransformType)} style={{ ...inputStyle, width: 110, color: TRANSFORM_COLORS[transform] || 'var(--color-text)' }}>
                                {TRANSFORM_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </td>
                            <td style={tdStyle}>
                              <input style={{ ...inputStyle, width: 100 }} placeholder="rule..." value={localChanges[col.column_mapping_id]?.transformation || ''} onChange={(e) => handleTransformChange(col.column_mapping_id, e.target.value)} />
                            </td>
                            <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 500 }}>{col.target_column || '\u2014'}</td>
                            <td style={{ ...tdStyle, color: 'var(--color-text-secondary)' }}>{col.target_data_type || '\u2014'}</td>
                            <td style={tdStyle}>
                              <StatusBadge
                                status={col.match_status === 'AUTO_MATCHED' ? 'Matched' : col.match_status === 'MANUAL' ? 'Manual' : col.match_status === 'REVIEW_REQUIRED' ? 'Review' : 'Unmapped'}
                                size="sm"
                                variant={col.match_status === 'AUTO_MATCHED' ? 'success' : col.match_status === 'MANUAL' ? 'info' : col.match_status === 'REVIEW_REQUIRED' ? 'warning' : 'danger'}
                              />
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
                {tableGroups.length} table pair(s) \u2022 Page {currentPage}/{totalPages}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{currentPage}/{totalPages}</span>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
              </div>
            </div>
          )}

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
              ⚠️ Warning: Remove Column Mappings
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
