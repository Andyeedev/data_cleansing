import { useState, useMemo } from 'react';
import { useSystemList, useTestConnection, useCreateSystem, useUpdateSystem, useDeleteSystem } from '../hooks/useSystems';
import { useDiagnosticSummary } from '../hooks/useDiagnostics';
import { ErrorState, LoadingSkeleton, EmptyState, StatusBadge, Pagination, ConfirmDialog, MetricCard } from '../components/shared';
import { TenantFilter } from '../components/shared/TenantFilter';
import { SystemFormModal, type SystemFormData } from '../components/SystemFormModal';
import { useAuth } from '../context/AuthContext';
import type { System, TestConnectionResponse, SystemDetail } from '../types/systems';
import { apiGet } from '../utils/apiClient';

const PAGE_SIZE = 10;

export function SystemsPage() {
  const { userRoles, tenantId: userTenantId } = useAuth();
  const [selectedTenant, setSelectedTenant] = useState<string>(userTenantId || '');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [dbTypeFilter, setDbTypeFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [testResults, setTestResults] = useState<Record<string, TestConnectionResponse | null>>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const [formOpen, setFormOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<SystemDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<System | null>(null);

  const { data: systems, loading, error, refetch } = useSystemList(selectedTenant || undefined);
  const { data: diagSummary } = useDiagnosticSummary();
  const { testConnection, loading: testingId } = useTestConnection();
  const { create, loading: creating } = useCreateSystem();
  const { update, loading: updating } = useUpdateSystem();
  const { remove, loading: deleting } = useDeleteSystem();

  const filtered = useMemo(() => {
    if (!systems) return [];
    return systems.filter((s) => {
      if (roleFilter && s.system_role !== roleFilter) return false;
      if (dbTypeFilter && s.database_type !== dbTypeFilter) return false;
      return true;
    });
  }, [systems, roleFilter, dbTypeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTestConnection = async (systemId: string) => {
    const result = await testConnection(systemId);
    setTestResults((prev) => ({ ...prev, [systemId]: result }));
  };

  const toggleExpand = (systemId: string) => {
    setExpandedRows((prev) => ({ ...prev, [systemId]: !prev[systemId] }));
  };

  const handleCreate = async (data: SystemFormData) => {
    const sys = await create({
      project_id: '',
      system_name: data.system_name,
      system_role: data.system_role,
      database_type: data.database_type,
      connection_config: data.connection_config,
    });
    if (sys) {
      await apiGet('/credentials');
      refetch();
    }
  };

  const handleEdit = async (data: SystemFormData) => {
    if (!editingSystem) return;
    const ok = await update(editingSystem.system_id, {
      system_name: data.system_name,
      system_role: data.system_role,
      database_type: data.database_type,
      connection_config: data.connection_config,
    });
    if (ok) refetch();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await remove(deleteTarget.system_id);
    if (ok) {
      setDeleteTarget(null);
      refetch();
    }
  };

  const getDbTypeIcon = (dbType: string) => {
    switch (dbType.toUpperCase()) {
      case 'POSTGRES': return '\u{1F418}';
      case 'AZURE_POSTGRES':
      case 'AWS_RDS_POSTGRES': return '\u2601\uFE0F';
      case 'SQLSERVER': return '\u{1F3E2}';
      case 'AZURE_SQL': return '\u{1F3E2}\u2601\uFE0F';
      case 'MYSQL': return '\u{1F42C}';
      case 'ORACLE': return '\u{1F536}';
      case 'SNOWFLAKE': return '\u2744\uFE0F';
      case 'BIGQUERY': return '\u{1F4CA}';
      case 'DATABRICKS': return '\u{1F525}';
      default: return '\u{1F5C4}\uFE0F';
    }
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Connection Management</h1>
        <ErrorState title="Access Denied" message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', margin: 0 }}>Connection Management</h1>
        <button
          onClick={() => { setEditingSystem(null); setFormOpen(true); }}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--color-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: 'var(--font-size-sm)',
          }}
        >
          + New System
        </button>
      </div>

      {diagSummary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          <MetricCard title="Total Systems" value={diagSummary.total_systems} />
          <MetricCard title="Healthy" value={diagSummary.healthy_systems} color="var(--color-success)" />
          <MetricCard title="Unhealthy" value={diagSummary.unhealthy_systems} color={diagSummary.unhealthy_systems > 0 ? 'var(--color-danger)' : undefined} />
          <MetricCard title="Health" value={`${diagSummary.overall_health_percent}%`} />
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <TenantFilter
          selectedTenant={selectedTenant}
          onChange={(val) => { setSelectedTenant(val); setPage(1); }}
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          aria-label="Filter by role"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">All Roles</option>
          <option value="SOURCE">Source</option>
          <option value="TARGET">Target</option>
        </select>
        <select
          value={dbTypeFilter}
          onChange={(e) => { setDbTypeFilter(e.target.value); setPage(1); }}
          aria-label="Filter by database type"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">All Database Types</option>
          <option value="POSTGRES">PostgreSQL</option>
          <option value="SQLSERVER">SQL Server</option>
          <option value="MYSQL">MySQL</option>
          <option value="ORACLE">Oracle</option>
          <option value="AZURE_SQL">Azure SQL</option>
          <option value="AZURE_POSTGRES">Azure PostgreSQL</option>
          <option value="AWS_RDS_POSTGRES">AWS RDS PostgreSQL</option>
          <option value="SNOWFLAKE">Snowflake</option>
          <option value="BIGQUERY">BigQuery</option>
          <option value="DATABRICKS">Databricks</option>
        </select>
      </div>

      {loading && <LoadingSkeleton variant="list" rows={5} />}
      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <>
          {paged.length === 0 ? (
            <EmptyState
              title="No systems found"
              description={(roleFilter || dbTypeFilter || selectedTenant) ? 'Try different filters' : 'No connections configured yet'}
            />
          ) : (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              {paged.map((system, index) => {
                const testResult = testResults[system.system_id];
                const isExpanded = expandedRows[system.system_id];
                const isTesting = testingId;

                return (
                  <div key={system.system_id}>
                    <div
                      style={{
                        padding: 'var(--space-md)',
                        borderBottom: index < paged.length - 1 || isExpanded ? '1px solid var(--color-border)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-md)',
                      }}
                    >
                      <span style={{ fontSize: 'var(--font-size-h2)' }}>
                        {getDbTypeIcon(system.database_type)}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, marginBottom: 'var(--space-xs)' }}>
                          <a
                            href={`/migration/connections/${system.system_id}`}
                            style={{ color: 'var(--color-text)', textDecoration: 'none' }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                          >
                            {system.system_name}
                          </a>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                          <StatusBadge status={system.system_role} size="sm" />
                          <span>{system.database_type}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                        {testResult && (
                          <StatusBadge
                            status={testResult.status === 'success' ? 'ACTIVE' : 'FAILED'}
                            size="sm"
                          />
                        )}
                        <button
                          onClick={() => handleTestConnection(system.system_id)}
                          disabled={isTesting}
                          aria-label={`Test connection for ${system.system_name}`}
                          style={{
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius)',
                            padding: 'var(--space-xs) var(--space-md)',
                            cursor: isTesting ? 'not-allowed' : 'pointer',
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text)',
                            opacity: isTesting ? 0.5 : 1,
                          }}
                        >
                          {isTesting ? 'Testing...' : 'Test'}
                        </button>
                        <a
                          href={`/migration/connections/diagnostics`}
                          aria-label={`Diagnostics for ${system.system_name}`}
                          style={{
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius)',
                            padding: 'var(--space-xs) var(--space-md)',
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-secondary)',
                            textDecoration: 'none',
                          }}
                        >
                          Diagnostics
                        </a>
                        <button
                          onClick={async () => {
                            const detail = await apiGet<SystemDetail>(`/systems/${system.system_id}`);
                            setEditingSystem(detail);
                            setFormOpen(true);
                          }}
                          aria-label={`Edit ${system.system_name}`}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)',
                            padding: 'var(--space-xs)',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(system)}
                          aria-label={`Delete ${system.system_name}`}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-danger)',
                            padding: 'var(--space-xs)',
                          }}
                        >
                          Delete
                        </button>
                        {testResult && (
                          <button
                            onClick={() => toggleExpand(system.system_id)}
                            aria-expanded={expandedRows[system.system_id] || false}
                            aria-label={`Expand ${system.system_name} details`}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: 'var(--font-size-xs)',
                              color: 'var(--color-text-secondary)',
                              padding: 'var(--space-xs) var(--space-sm)',
                            }}
                          >
                            {isExpanded ? '\u25BE' : '\u25B8'}
                          </button>
                        )}
                      </div>
                    </div>
                    {isExpanded && testResult && (
                      <div style={{
                        padding: 'var(--space-md) var(--space-md) var(--space-md) var(--space-2xl)',
                        borderBottom: index < paged.length - 1 ? '1px solid var(--color-border)' : 'none',
                        background: 'var(--color-background)',
                        fontSize: 'var(--font-size-xs)',
                      }}>
                        <div style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Test Result:</div>
                        <div style={{ color: testResult.status === 'success' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                          {testResult.message}
                        </div>
                        {testResult.latency_ms !== undefined && (
                          <div style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
                            Latency: {testResult.latency_ms}ms
                            {testResult.server_version && ` | Version: ${testResult.server_version}`}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'center' }}>
              <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
            </div>
          )}
        </>
      )}

      <SystemFormModal
        open={formOpen}
        system={editingSystem}
        onClose={() => { setFormOpen(false); setEditingSystem(null); }}
        onSave={editingSystem ? handleEdit : handleCreate}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete System"
        message={`Are you sure you want to delete "${deleteTarget?.system_name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
      />
    </div>
  );
}
