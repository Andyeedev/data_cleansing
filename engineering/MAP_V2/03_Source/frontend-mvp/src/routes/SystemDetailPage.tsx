import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSystemDetail, useUpdateSystem, useDeleteSystem, useTestConnection } from '../hooks/useSystems';
import { LoadingSkeleton, ErrorState, StatusBadge, ConfirmDialog } from '../components/shared';
import { SystemFormModal, type SystemFormData } from '../components/SystemFormModal';
import { useAuth } from '../context/AuthContext';
import type { SystemDetail } from '../types/systems';
import { apiGet } from '../utils/apiClient';

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
  const [testResult, setTestResult] = useState<{ status: string; message: string; latency_ms?: number; server_version?: string } | null>(null);

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>System Detail</h1>
        <ErrorState title="Access Denied" message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <LoadingSkeleton variant="list" rows={3} />
      </div>
    );
  }

  if (error || !system) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <ErrorState message={error || 'System not found'} />
      </div>
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

  const sectionStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    padding: 'var(--space-lg)',
    marginBottom: 'var(--space-md)',
  };

  const labelStyle = {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-xs)',
  };

  const valueStyle = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text)',
  };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
            <a href="/migration/connections" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Connections</a>
            {' '}/ Detail
          </div>
          <h1 style={{ fontSize: 'var(--font-size-h1)', margin: 0 }}>{system.system_name}</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button
            onClick={() => setEditOpen(true)}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text)',
            }}
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: 'transparent',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-danger)',
            }}
          >
            Delete
          </button>
          <button
            onClick={() => navigate('/migration/connections/diagnostics')}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 500,
            }}
          >
            Run Diagnostics
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-lg)' }}>
          <div>
            <div style={labelStyle}>System ID</div>
            <div style={{ ...valueStyle, fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{system.system_id}</div>
          </div>
          <div>
            <div style={labelStyle}>Role</div>
            <StatusBadge status={system.system_role} size="sm" />
          </div>
          <div>
            <div style={labelStyle}>Database Type</div>
            <div style={valueStyle}>{system.database_type}</div>
          </div>
          <div>
            <div style={labelStyle}>Credential ID</div>
            <div style={{ ...valueStyle, fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>
              {system.credential_id ? `${system.credential_id.slice(0, 8)}...` : 'None'}
            </div>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Connection Configuration</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-lg)' }}>
          <div>
            <div style={labelStyle}>Host</div>
            <div style={valueStyle}>{system.connection_config?.host || '-'}</div>
          </div>
          <div>
            <div style={labelStyle}>Port</div>
            <div style={valueStyle}>{system.connection_config?.port || '-'}</div>
          </div>
          <div>
            <div style={labelStyle}>Database</div>
            <div style={valueStyle}>{system.connection_config?.database || '-'}</div>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Connection Test</h3>
        <button
          onClick={handleTest}
          disabled={testing}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--color-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: testing ? 'not-allowed' : 'pointer',
            opacity: testing ? 0.5 : 1,
            fontSize: 'var(--font-size-sm)',
            fontWeight: 500,
            marginBottom: testResult ? 'var(--space-md)' : 0,
          }}
        >
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
        {testResult && (
          <div
            style={{
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius)',
              background: testResult.success ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
              marginTop: 'var(--space-md)',
            }}
          >
              <div style={{ fontWeight: 500, color: testResult.success ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {testResult.message}
            </div>
            {testResult.latency_ms !== undefined && (
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
                Latency: {testResult.latency_ms}ms
                {testResult.server_version && ` | Version: ${testResult.server_version}`}
              </div>
            )}
          </div>
        )}
      </div>

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
    </div>
  );
}
