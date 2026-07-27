import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../utils/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner';

interface PortfolioSummary {
  total_systems: number;
  total_batches: number;
  total_controls: number;
  active_batches: number;
}

interface ActivityEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_email: string;
  timestamp: string;
}

export function DashboardPage() {
  const { userRoles } = useAuth();
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  const isAdmin = userRoles.includes('admin');
  const isManager = userRoles.includes('manager');
  const isExecutive = isAdmin || isManager;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      apiGet<PortfolioSummary>('/dashboard/portfolio').catch(() => null),
      isExecutive ? apiGet<{ entries: ActivityEntry[]; total: number }>('/dashboard/activity?limit=5').catch(() => null) : Promise.resolve(null),
    ])
      .then(([portfolioData, activityData]) => {
        if (cancelled) return;
        if (portfolioData) setPortfolio(portfolioData);
        if (activityData) setActivity(activityData.entries || []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isExecutive]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Migration overview and status.
        </p>
      </div>

      {isExecutive && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: 'var(--color-text-primary)' }}>
            Executive Overview
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: 20, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginBottom: 4 }}>Total Systems</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{portfolio?.total_systems ?? '—'}</div>
            </div>
            <div style={{ padding: 20, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginBottom: 4 }}>Total Batches</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{portfolio?.total_batches ?? '—'}</div>
            </div>
            <div style={{ padding: 20, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginBottom: 4 }}>Total Controls</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{portfolio?.total_controls ?? '—'}</div>
            </div>
            <div style={{ padding: 20, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginBottom: 4 }}>Active Batches</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: portfolio?.active_batches ? '#16a34a' : 'inherit' }}>
                {portfolio?.active_batches ?? '—'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16, color: 'var(--color-text-primary)' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {isAdmin && (
            <a href="/systems" style={{ padding: '12px 24px', background: 'var(--color-primary)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
              Manage Systems
            </a>
          )}
          {(isAdmin || isManager) && (
            <a href="/migration" style={{ padding: '12px 24px', background: 'var(--color-secondary, #6366f1)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
              Start Migration
            </a>
          )}
          <a href="/operations" style={{ padding: '12px 24px', background: 'var(--color-bg-secondary, #374151)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
            View Operations
          </a>
        </div>
      </div>

      {isExecutive && (
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: 'var(--color-text-primary)' }}>
            Recent Activity
          </h2>
          <div style={{ padding: 16, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
            {activity.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>No recent activity.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Action</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Control</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Entity</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((entry) => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          background: entry.action === 'PASS' ? 'rgba(34,197,94,0.1)' : entry.action === 'FAIL' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                          color: entry.action === 'PASS' ? '#16a34a' : entry.action === 'FAIL' ? '#ef4444' : '#6366f1',
                        }}>
                          {entry.action}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{entry.entity_type}</td>
                      <td style={{ padding: '8px 12px' }}>{entry.entity_id}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--color-text-secondary)' }}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
