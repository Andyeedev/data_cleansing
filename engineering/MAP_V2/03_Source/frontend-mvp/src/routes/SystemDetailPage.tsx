import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSystemDetail, useTestConnection } from '../hooks/useSystems';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import type { TestConnectionResponse } from '../types/systems';

export function SystemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userRoles } = useAuth();

  const { data: system, loading, error } = useSystemDetail(id || null);
  const { testConnection, loading: testing } = useTestConnection();
  const [testResult, setTestResult] = useState<TestConnectionResponse | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleTestConnection = async () => {
    if (!id) return;
    const result = await testConnection(id);
    setTestResult(result);
    setShowDetails(true);
  };

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'SOURCE': return '#3b82f6';
      case 'TARGET': return '#22c55e';
      default: return 'var(--color-text-secondary)';
    }
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>System Detail</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <ErrorMessage message={error} />
        <button
          onClick={() => navigate('/migration/connections')}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            cursor: 'pointer',
          }}
        >
          Back to Connections
        </button>
      </div>
    );
  }

  if (!system) {
    return (
      <div style={{ padding: 24 }}>
        <ErrorMessage message="System not found" />
        <button
          onClick={() => navigate('/migration/connections')}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            cursor: 'pointer',
          }}
        >
          Back to Connections
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate('/migration/connections')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: 14,
            padding: 0,
            marginBottom: 8,
          }}
        >
          ← Back to Connections
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: 24, margin: 0 }}>{system.system_name}</h1>
          <span style={{
            padding: '4px 12px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 500,
            background: `${getRoleColor(system.system_role)}15`,
            color: getRoleColor(system.system_role),
          }}>
            {system.system_role}
          </span>
        </div>
      </div>

      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 24,
        marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>System Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>System Name</div>
            <div style={{ fontSize: 14 }}>{system.system_name}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Role</div>
            <div style={{ fontSize: 14 }}>{system.system_role}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Database Type</div>
            <div style={{ fontSize: 14 }}>{system.database_type}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Credential ID</div>
            <div style={{ fontSize: 14, fontFamily: 'monospace' }}>{system.credential_id || '—'}</div>
          </div>
        </div>
      </div>

      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 24,
        marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Connection Configuration</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Host</div>
            <div style={{ fontSize: 14, fontFamily: 'monospace' }}>{system.connection_config.host}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Port</div>
            <div style={{ fontSize: 14, fontFamily: 'monospace' }}>{system.connection_config.port}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Database</div>
            <div style={{ fontSize: 14, fontFamily: 'monospace' }}>{system.connection_config.database}</div>
          </div>
        </div>
      </div>

      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, margin: 0 }}>Connection Test</h3>
          <button
            onClick={handleTestConnection}
            disabled={testing}
            style={{
              padding: '8px 16px',
              background: testing ? 'var(--color-background)' : 'rgba(59, 130, 246, 0.1)',
              color: testing ? 'var(--color-text-secondary)' : '#3b82f6',
              border: `1px solid ${testing ? 'var(--color-border)' : 'rgba(59, 130, 246, 0.3)'}`,
              borderRadius: 'var(--radius)',
              cursor: testing ? 'not-allowed' : 'pointer',
              fontSize: 14,
            }}
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {testResult && (
          <div style={{
            padding: 16,
            borderRadius: 'var(--radius)',
            background: testResult.status === 'success' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            border: `1px solid ${testResult.status === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: showDetails ? 8 : 0 }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: testResult.status === 'success' ? '#22c55e' : '#ef4444',
              }} />
              <span style={{
                fontWeight: 500,
                color: testResult.status === 'success' ? '#22c55e' : '#ef4444',
              }}>
                {testResult.status === 'success' ? 'Connection Successful' : 'Connection Failed'}
              </span>
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                  marginLeft: 8,
                }}
              >
                {showDetails ? '▾ Hide Details' : '▸ Show Details'}
              </button>
            </div>
            {showDetails && (
              <div style={{
                fontSize: 13,
                color: 'var(--color-text-secondary)',
                paddingTop: 8,
                borderTop: `1px solid ${testResult.status === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
              }}>
                {testResult.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
