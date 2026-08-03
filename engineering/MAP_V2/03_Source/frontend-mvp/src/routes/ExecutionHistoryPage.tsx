import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet, apiPost } from '../utils/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';

interface ExecutionHistoryItem {
  batch_id: string;
  project_id: string | null;
  batch_status: string;
  total_controls: number;
  completed_controls: number;
  failed_controls: number;
  batch_start_time: string | null;
  batch_end_time: string | null;
}

interface PaginatedHistory {
  items: ExecutionHistoryItem[];
  total: number;
  page: number;
  page_size: number;
}

export function ExecutionHistoryPage() {
  const { userRoles } = useAuth();
  const [data, setData] = useState<PaginatedHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [reExecuteId, setReExecuteId] = useState<string | null>(null);

  const isAdmin = userRoles.includes('admin');

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    setLoading(true);

    apiGet<PaginatedHistory>(`/execution/history?page=${page}&page_size=20`)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isAdmin, page]);

  const handleReExecute = async (batchId: string) => {
    setReExecuteId(batchId);
    try {
      await apiPost(`/execution/history/${batchId}/re-execute`);
      setLoading(true);
      const result = await apiGet<PaginatedHistory>(`/execution/history?page=${page}&page_size=20`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Re-execution failed');
    } finally {
      setReExecuteId(null);
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Execution History</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Execution History</h1>
        <ErrorMessage message={error} />
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'var(--color-success, #22c55e)';
      case 'FAILED': return 'var(--color-error, #ef4444)';
      case 'RUNNING': return 'var(--color-warning, #f59e0b)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 1;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Execution History</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        View and manage past validation executions.
      </p>

      {data && data.items.length === 0 ? (
        <div style={{
          padding: 48,
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          background: 'var(--color-background)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--color-text)' }}>No Execution History</h3>
          <p style={{ fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
            No execution batches have been run yet. Start a migration execution to see history here.
          </p>
        </div>
      ) : (
        <>
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Batch ID</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600 }}>Controls</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600 }}>Completed</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600 }}>Failed</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Started</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((item) => (
                  <tr key={item.batch_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 13 }}>{item.batch_id}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#fff',
                        background: statusColor(item.batch_status),
                      }}>
                        {item.batch_status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{item.total_controls}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{item.completed_controls}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: item.failed_controls > 0 ? 'var(--color-error, #ef4444)' : undefined }}>
                      {item.failed_controls}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {item.batch_start_time ? new Date(item.batch_start_time).toLocaleString() : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleReExecute(item.batch_id)}
                        disabled={reExecuteId === item.batch_id}
                        style={{
                          padding: '4px 12px',
                          fontSize: 12,
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius)',
                          background: 'var(--color-surface)',
                          cursor: reExecuteId === item.batch_id ? 'wait' : 'pointer',
                          color: 'var(--color-text)',
                        }}
                      >
                        {reExecuteId === item.batch_id ? 'Running...' : 'Re-run'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: '6px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: page === 1 ? 'not-allowed' : 'pointer', background: 'var(--color-surface)' }}
              >
                Previous
              </button>
              <span style={{ padding: '6px 12px', fontSize: 14, color: 'var(--color-text-secondary)' }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ padding: '6px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: page === totalPages ? 'not-allowed' : 'pointer', background: 'var(--color-surface)' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
