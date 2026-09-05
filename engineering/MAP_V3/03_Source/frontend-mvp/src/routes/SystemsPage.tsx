import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystemList, useTestConnection, useCreateSystem, useUpdateSystem, useDeleteSystem } from '../hooks/useSystems';
import { useDiagnosticSummary } from '../hooks/useDiagnostics';
import { ErrorState, LoadingSkeleton, EmptyState, Pagination, ConfirmDialog } from '../components/shared';
import { TenantFilter } from '../components/shared/TenantFilter';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill } from '../components/reports/reportWidgets';
import { SystemFormModal, type SystemFormData } from '../components/SystemFormModal';
import { useAuth } from '../context/AuthContext';
import type { System, TestConnectionResponse, SystemDetail } from '../types/systems';
import { apiGet } from '../utils/apiClient';

const PAGE_SIZE = 10;

const DB_TYPE_ICONS: Record<string, string> = {
  POSTGRES: '\u{1F418}',
  AZURE_POSTGRES: '\u2601\uFE0F',
  AWS_RDS_POSTGRES: '\u2601\uFE0F',
  SQLSERVER: '\u{1F3E2}',
  AZURE_SQL: '\u{1F3E2}\u2601\uFE0F',
  MYSQL: '\u{1F42C}',
  ORACLE: '\u{1F536}',
  SNOWFLAKE: '\u2744\uFE0F',
  BIGQUERY: '\u{1F4CA}',
  DATABRICKS: '\u{1F525}',
};

function getDbTypeIcon(dbType: string) {
  return DB_TYPE_ICONS[dbType.toUpperCase()] ?? '\u{1F5C4}\uFE0F';
}

export function SystemsPage() {
  const navigate = useNavigate();
  const { userRoles, tenantId: userTenantId } = useAuth();
  const [selectedTenant, setSelectedTenant] = useState<string>(userTenantId || '');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [dbTypeFilter, setDbTypeFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [testResults, setTestResults] = useState<Record<string, TestConnectionResponse | null>>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [live, setLive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<SystemDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<System | null>(null);

  const { data: systems, loading, error, refetch } = useSystemList(selectedTenant || undefined);
  const { data: diagSummary, refetch: refetchDiag } = useDiagnosticSummary(selectedTenant || undefined);
  const { testConnection, loading: testingId } = useTestConnection();
  const { create, loading: creating } = useCreateSystem();
  const { update, loading: updating } = useUpdateSystem();
  const { remove, loading: deleting } = useDeleteSystem();

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (live) {
      intervalRef.current = setInterval(() => {
        refetch();
        refetchDiag();
      }, 15000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [live, refetch, refetchDiag]);

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
    const result = await testConnection(systemId, selectedTenant || undefined);
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
    }, selectedTenant || undefined);
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

  if (!userRoles.includes('admin')) {
    return (
      <PageContainer>
        <h1 className="text-xl font-bold text-gray-900 mb-4">Connection Management</h1>
        <ErrorState title="Access Denied" message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Connection Management</h1>
          {systems && (
            <span className="text-sm text-gray-500">{systems.length} systems</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLive(!live)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              live ? 'bg-green-50 text-green-700 border-green-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${live ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {live ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={() => refetch()}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={() => { setEditingSystem(null); setFormOpen(true); }}
            className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            + New System
          </button>
        </div>
      </div>

      {diagSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiBox label="Total Systems" value={diagSummary.total_systems} tone="neutral" />
          <KpiBox label="Healthy" value={diagSummary.healthy_systems} tone="success" />
          <KpiBox label="Unhealthy" value={diagSummary.unhealthy_systems} tone={diagSummary.unhealthy_systems > 0 ? 'error' : 'neutral'} />
          <KpiBox label="Health" value={`${diagSummary.overall_health_percent}%`} tone="info" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <TenantFilter
          selectedTenant={selectedTenant}
          onChange={(val) => { setSelectedTenant(val); setPage(1); }}
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          aria-label="Filter by role"
          className="px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-gray-700"
        >
          <option value="">All Roles</option>
          <option value="SOURCE">Source</option>
          <option value="TARGET">Target</option>
        </select>
        <select
          value={dbTypeFilter}
          onChange={(e) => { setDbTypeFilter(e.target.value); setPage(1); }}
          aria-label="Filter by database type"
          className="px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-gray-700"
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
        <ReportCard title="Systems">
          {paged.length === 0 ? (
            <EmptyState
              title="No systems found"
              description={(roleFilter || dbTypeFilter || selectedTenant) ? 'Try different filters' : 'No connections configured yet'}
            />
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {paged.map((system) => {
                  const testResult = testResults[system.system_id];
                  const isExpanded = expandedRows[system.system_id];
                  const isTesting = testingId;

                  return (
                    <div key={system.system_id}>
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                        <span className="text-xl flex-shrink-0">{getDbTypeIcon(system.database_type)}</span>
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => navigate(`/migration/connections/${system.system_id}${selectedTenant ? `?tenant_id=${encodeURIComponent(selectedTenant)}` : ''}`)}
                            className="font-medium text-gray-900 hover:underline text-left"
                          >
                            {system.system_name}
                          </button>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                            <StatusPill status={system.system_role} />
                            <span>{system.database_type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {testResult && (
                            <StatusPill status={testResult.success ? 'ACTIVE' : 'FAILED'} />
                          )}
                          <button
                            onClick={() => handleTestConnection(system.system_id)}
                            disabled={!!isTesting}
                            className="px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isTesting ? 'Testing...' : 'Test'}
                          </button>
                          <button
                            onClick={() => navigate('/migration/connections/diagnostics')}
                            className="px-2.5 py-1 text-xs text-gray-500 border border-gray-200 rounded hover:bg-gray-50"
                          >
                            Diagnostics
                          </button>
                          <button
                            onClick={async () => {
                              const qs = selectedTenant ? `?tenant_id=${encodeURIComponent(selectedTenant)}` : '';
                              const detail = await apiGet<SystemDetail>(`/systems/${system.system_id}${qs}`);
                              setEditingSystem(detail);
                              setFormOpen(true);
                            }}
                            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(system)}
                            className="px-2 py-1 text-xs text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                          {testResult && (
                            <button
                              onClick={() => toggleExpand(system.system_id)}
                              aria-expanded={isExpanded}
                              className="px-1 py-1 text-xs text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? '\u25BE' : '\u25B8'}
                            </button>
                          )}
                        </div>
                      </div>
                      {isExpanded && testResult && (
                        <div className="px-4 py-3 pl-12 bg-gray-50 text-xs border-t border-gray-100">
                          <div className="text-gray-500 mb-1">Test Result:</div>
                          <div className={testResult.success ? 'text-green-600' : 'text-red-600'}>
                            {testResult.message}
                          </div>
                          {testResult.latency_ms !== undefined && (
                            <div className="text-gray-500 mt-1">
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

              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </ReportCard>
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
    </PageContainer>
  );
}
