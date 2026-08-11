import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useControls } from '../hooks/useControls';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { Modal } from '../components/shared/Modal';
import type { ControlItem } from '../types/controls';

export function ControlsPage() {
  const { userRoles } = useAuth();
  const { data, loading, error, refetch, updateControl, deleteControl } = useControls();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingControl, setEditingControl] = useState<ControlItem | null>(null);
  const pageSize = 10;

  const filteredData = useMemo(() => {
    if (!data?.controls) return [];
    let result = data.controls;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.control_id.toLowerCase().includes(q) ||
          (c.control_name && c.control_name.toLowerCase().includes(q)) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }
    if (severityFilter !== 'all') {
      result = result.filter((c) => c.severity_level === severityFilter);
    }
    if (statusFilter === 'enabled') result = result.filter((c) => c.enabled_flag);
    if (statusFilter === 'disabled') result = result.filter((c) => !c.enabled_flag);
    return result;
  }, [data?.controls, searchQuery, severityFilter, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleToggleStatus = async (control: ControlItem) => {
    await updateControl(control.control_id, { enabled_flag: !control.enabled_flag });
    await refetch();
  };

  const handleDelete = async (controlId: string) => {
    await deleteControl(controlId);
    await refetch();
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)',
    fontWeight: 700, fontSize: 'var(--font-size-xs)', background: 'var(--color-bg-secondary)',
    borderBottom: '2px solid var(--color-border)'
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Controls Management</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const enabledCount = data?.controls?.filter((c) => c.enabled_flag).length || 0;
  const disabledCount = data?.controls?.filter((c) => !c.enabled_flag).length || 0;
  const criticalCount = data?.controls?.filter((c) => c.severity_level === 'CRITICAL').length || 0;

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Controls Management"
        description="Manage validation controls and their configuration"
      />

      {error && <ErrorState message={error} onRetry={refetch} />}
      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {!loading && !error && data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <MetricCard title="Total" value={data.total} />
            <MetricCard title="Enabled" value={enabledCount} color="var(--color-success)" />
            <MetricCard title="Disabled" value={disabledCount} color="var(--color-warning)" />
            <MetricCard title="Critical" value={criticalCount} color="var(--color-danger)" />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search controls..." />
            </div>
            <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
              <option value="all">All Severity</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
              <option value="all">All Status</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          {paginatedData.length === 0 ? (
            <EmptyState title="No controls" description="No controls match your filters." />
          ) : (
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Control ID</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>Severity</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((control) => (
                    <tr key={control.control_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{control.control_id}</td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{control.control_name || '—'}</td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{control.description || '—'}</td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <StatusBadge status={control.severity_level || 'UNKNOWN'} size="sm" />
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <StatusBadge status={control.enabled_flag ? 'Enabled' : 'Disabled'} size="sm" variant={control.enabled_flag ? 'success' : 'warning'} />
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                          <button onClick={() => handleToggleStatus(control)} style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: 'pointer' }}>
                            {control.enabled_flag ? 'Disable' : 'Enable'}
                          </button>
                        </div>
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
                {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{currentPage}/{totalPages}</span>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Control">
        {editingControl && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Control ID</span>
              <span style={{ fontFamily: 'monospace' }}>{editingControl.control_id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Name</span>
              <span>{editingControl.control_name || '—'}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
