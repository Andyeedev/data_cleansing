import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystemList, useTestConnection } from '../hooks/useSystems';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import type { TestConnectionResponse } from '../types/systems';

export function SystemsPage() {
  const navigate = useNavigate();
  const { userRoles } = useAuth();
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [dbTypeFilter, setDbTypeFilter] = useState<string>('');
  const [testResults, setTestResults] = useState<Record<string, TestConnectionResponse | null>>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const { data: systems, loading, error } = useSystemList();
  const { testConnection, loading: testingId } = useTestConnection();

  const handleTestConnection = async (systemId: string) => {
    const result = await testConnection(systemId);
    setTestResults((prev) => ({ ...prev, [systemId]: result }));
  };

  const toggleExpand = (systemId: string) => {
    setExpandedRows((prev) => ({ ...prev, [systemId]: !prev[systemId] }));
  };

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'SOURCE': return '#3b82f6';
      case 'TARGET': return '#22c55e';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getDbTypeIcon = (dbType: string) => {
    switch (dbType.toUpperCase()) {
      case 'POSTGRES': return '🐘';
      case 'SQLSERVER': return '🏢';
      case 'MYSQL': return '🐬';
      case 'ORACLE': return '🔶';
      default: return '🗄️';
    }
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Connection Management</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Connection Management</h1>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 14,
          }}
        >
          <option value="">All Roles</option>
          <option value="SOURCE">Source</option>
          <option value="TARGET">Target</option>
        </select>
        <select
          value={dbTypeFilter}
          onChange={(e) => setDbTypeFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 14,
          }}
        >
          <option value="">All Database Types</option>
          <option value="POSTGRES">PostgreSQL</option>
          <option value="SQLSERVER">SQL Server</option>
          <option value="MYSQL">MySQL</option>
          <option value="ORACLE">Oracle</option>
        </select>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && systems && (
        <>
          {(() => {
            const filtered = systems.filter((s) => {
              if (roleFilter && s.system_role !== roleFilter) return false;
              if (dbTypeFilter && s.database_type !== dbTypeFilter) return false;
              return true;
            });

            if (filtered.length === 0) {
              return (
                <div style={{
                  padding: 48,
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)',
                  border: '1px dashed var(--color-border)',
                  borderRadius: 'var(--radius)',
                }}>
                  <p style={{ fontSize: 16, marginBottom: 8 }}>No systems found</p>
                  <p style={{ fontSize: 14 }}>
                    {(roleFilter || dbTypeFilter) ? 'Try different filters' : 'No connections configured yet'}
                  </p>
                </div>
              );
            }

            return (
              <div style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
              }}>
                {filtered.map((system, index) => {
                  const testResult = testResults[system.system_id];
                  const isExpanded = expandedRows[system.system_id];
                  const isTesting = testingId;

                  return (
                    <div key={system.system_id}>
                      <div
                        style={{
                          padding: '16px',
                          borderBottom: index < filtered.length - 1 || isExpanded ? '1px solid var(--color-border)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                        }}
                      >
                        <span style={{ fontSize: 24 }}>
                          {getDbTypeIcon(system.database_type)}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, marginBottom: 4 }}>
                            <a
                              href={`/migration/connections/${system.system_id}`}
                              style={{ color: 'var(--color-text)', textDecoration: 'none' }}
                              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                            >
                              {system.system_name}
                            </a>
                          </div>
                          <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: 12,
                              fontSize: 12,
                              fontWeight: 500,
                              background: `${getRoleColor(system.system_role)}15`,
                              color: getRoleColor(system.system_role),
                            }}>
                              {system.system_role}
                            </span>
                            <span>{system.database_type}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {testResult && (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: 12,
                              fontSize: 12,
                              fontWeight: 500,
                              background: testResult.status === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: testResult.status === 'success' ? '#22c55e' : '#ef4444',
                            }}>
                              {testResult.status === 'success' ? 'Connected' : 'Failed'}
                            </span>
                          )}
                          <button
                            onClick={() => handleTestConnection(system.system_id)}
                            disabled={isTesting}
                            style={{
                              background: 'none',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius)',
                              padding: '6px 12px',
                              cursor: isTesting ? 'not-allowed' : 'pointer',
                              fontSize: 12,
                              color: 'var(--color-text)',
                              opacity: isTesting ? 0.5 : 1,
                            }}
                          >
                            {isTesting ? 'Testing...' : 'Test'}
                          </button>
                          {testResult && (
                            <button
                              onClick={() => toggleExpand(system.system_id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: 12,
                                color: 'var(--color-text-secondary)',
                                padding: '4px 8px',
                              }}
                            >
                              {isExpanded ? '▾' : '▸'}
                            </button>
                          )}
                        </div>
                      </div>
                      {isExpanded && testResult && (
                        <div style={{
                          padding: '12px 16px 12px 56px',
                          borderBottom: index < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                          background: 'var(--color-background)',
                          fontSize: 13,
                        }}>
                          <div style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>Test Result:</div>
                          <div style={{ color: testResult.status === 'success' ? '#22c55e' : '#ef4444' }}>
                            {testResult.message}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
