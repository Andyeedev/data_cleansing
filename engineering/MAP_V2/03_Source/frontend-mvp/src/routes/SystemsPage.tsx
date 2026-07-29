import { useState } from 'react';
import { useSystemList, useTestConnection } from '../hooks/useSystems';
import { ErrorState, LoadingSkeleton, EmptyState, StatusBadge } from '../components/shared';
import { useAuth } from '../context/AuthContext';
import type { TestConnectionResponse } from '../types/systems';

export function SystemsPage() {
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
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Connection Management</h1>
        <ErrorState title="Access Denied" message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', margin: 0 }}>Connection Management</h1>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
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
          onChange={(e) => setDbTypeFilter(e.target.value)}
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
        </select>
      </div>

      {loading && <LoadingSkeleton variant="list" rows={5} />}
      {error && <ErrorState message={error} />}

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
                <EmptyState
                  title="No systems found"
                  description={(roleFilter || dbTypeFilter) ? 'Try different filters' : 'No connections configured yet'}
                />
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
                          padding: 'var(--space-md)',
                          borderBottom: index < filtered.length - 1 || isExpanded ? '1px solid var(--color-border)' : 'none',
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
                              {isExpanded ? '▾' : '▸'}
                            </button>
                          )}
                        </div>
                      </div>
                      {isExpanded && testResult && (
                        <div style={{
                          padding: 'var(--space-md) var(--space-md) var(--space-md) var(--space-2xl)',
                          borderBottom: index < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                          background: 'var(--color-background)',
                          fontSize: 'var(--font-size-xs)',
                        }}>
                          <div style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Test Result:</div>
                          <div style={{ color: testResult.status === 'success' ? 'var(--color-success)' : 'var(--color-danger)' }}>
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
