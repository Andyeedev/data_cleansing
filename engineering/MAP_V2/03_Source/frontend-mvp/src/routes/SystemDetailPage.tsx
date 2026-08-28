import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSystemDetail, useUpdateSystem, useDeleteSystem, useTestConnection } from '../hooks/useSystems';
import { LoadingSkeleton, ErrorState, ConfirmDialog } from '../components/shared';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill } from '../components/reports/reportWidgets';
import { SystemFormModal, type SystemFormData } from '../components/SystemFormModal';
import { useAuth } from '../context/AuthContext';

export function SystemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userRoles } = useAuth();
  const [searchParams] = useSearchParams();
  const tenantId = searchParams.get('tenant_id') || undefined;

  const { data: system, loading, error, refetch } = useSystemDetail(id ?? null, tenantId);
  const { update } = useUpdateSystem();
  const { remove } = useDeleteSystem();
  const { testConnection, loading: testing } = useTestConnection();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency_ms?: number; server_version?: string } | null>(null);

  if (!userRoles.includes('admin')) {
    return (
      <PageContainer>
        <h1 className="text-xl font-bold text-gray-900 mb-4">System Detail</h1>
        <ErrorState title="Access Denied" message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingSkeleton variant="list" rows={3} />
      </PageContainer>
    );
  }

  if (error || !system) {
    return (
      <PageContainer>
        <ErrorState message={error || 'System not found'} />
      </PageContainer>
    );
  }

  const handleTest = async () => {
    const result = await testConnection(system.system_id, tenantId);
    if (result) setTestResult(result);
  };

  const handleEdit = async (data: SystemFormData) => {
    const ok = await update(system.system_id, {
      system_name: data.system_name,
      system_role: data.system_role,
      database_type: data.database_type,
      connection_config: data.connection_config,
    }, tenantId);
    if (ok) {
      setEditOpen(false);
      refetch();
    }
  };

  const handleDelete = async () => {
    const ok = await remove(system.system_id, tenantId);
    if (ok) navigate('/migration/connections');
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <div className="text-xs text-gray-500 mb-1">
            <button onClick={() => navigate('/migration/connections')} className="text-blue-600 hover:underline">Connections</button>
            <span className="mx-1">/</span>
            <span>Detail</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{system.system_name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50"
          >
            Delete
          </button>
          <button
            onClick={() => navigate('/migration/connections/diagnostics')}
            className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Run Diagnostics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiBox label="System ID" value={system.system_id.slice(0, 8) + '...'} tone="neutral" />
        <KpiBox label="Role" value={system.system_role} tone={system.system_role === 'SOURCE' ? 'info' : 'success'} />
        <KpiBox label="Database Type" value={system.database_type} tone="neutral" />
        <KpiBox label="Credential" value={system.credential_id ? system.credential_id.slice(0, 8) + '...' : 'None'} tone="neutral" />
      </div>

      <ReportCard title="Connection Configuration">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Host</div>
            <div className="text-sm text-gray-900">{system.connection_config?.host || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Port</div>
            <div className="text-sm text-gray-900">{system.connection_config?.port || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Database</div>
            <div className="text-sm text-gray-900">{system.connection_config?.database || '-'}</div>
          </div>
        </div>
      </ReportCard>

      <ReportCard title="Connection Test">
        <button
          onClick={handleTest}
          disabled={testing}
          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
        {testResult && (
          <div className={`mt-4 p-3 rounded-md text-sm ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <div className="font-medium">{testResult.message}</div>
            {testResult.latency_ms !== undefined && (
              <div className="text-xs text-gray-500 mt-1">
                Latency: {testResult.latency_ms}ms
                {testResult.server_version && ` | Version: ${testResult.server_version}`}
              </div>
            )}
          </div>
        )}
      </ReportCard>

      <SystemFormModal
        open={editOpen}
        system={system}
        onClose={() => setEditOpen(false)}
        onSave={handleEdit}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete System"
        message={`Are you sure you want to delete "${system.system_name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        variant="danger"
        confirmLabel="Delete"
      />
    </PageContainer>
  );
}
