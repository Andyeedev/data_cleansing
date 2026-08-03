import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../utils/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner';
import { StatusBadge } from '../components/shared/StatusBadge';
import { TenantFilter } from '../components/shared/TenantFilter';
import { ExecutiveSummary } from '../components/Executive/ExecutiveSummary';
import { ExecutiveKPI } from '../components/Executive/ExecutiveKPI';
import { ExecutiveHealth } from '../components/Executive/ExecutiveHealth';
import { ExecutiveActions } from '../components/Executive/ExecutiveActions';

interface PortfolioSummary {
  total_systems: number;
  total_batches: number;
  total_controls: number;
  active_batches: number;
}

interface MigrationScoreEntry {
  batch_id: string;
  total_controls: number;
  passed_controls: number;
  pass_rate: number;
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
  const [migrationScores, setMigrationScores] = useState<MigrationScoreEntry[]>([]);
  const [selectedTenant, setSelectedTenant] = useState('');

  const isAdmin = userRoles.includes('admin');
  const isManager = userRoles.includes('manager');
  const isExecutive = isAdmin || isManager;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const tenantParam = selectedTenant ? `?tenant_id=${selectedTenant}` : '';
    const activityTenantParam = selectedTenant ? `&tenant_id=${selectedTenant}` : '';

    Promise.all([
      apiGet<PortfolioSummary>(`/dashboard/portfolio${tenantParam}`).catch(() => null),
      isExecutive ? apiGet<{ entries: ActivityEntry[]; total: number }>(`/dashboard/activity?limit=5${activityTenantParam}`).catch(() => null) : Promise.resolve(null),
      apiGet<{ migration_scores: MigrationScoreEntry[] }>(`/execution/migration-score-summary${tenantParam}`).catch(() => null),
    ])
      .then(([portfolioData, activityData, migrationData]) => {
        if (cancelled) return;
        if (portfolioData) setPortfolio(portfolioData);
        if (activityData) setActivity(activityData.entries || []);
        if (migrationData) setMigrationScores(migrationData.migration_scores || []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isExecutive, selectedTenant]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Calculate mock health score (in real app, this would come from API)
  const healthScore = portfolio ? Math.min(100, Math.round(
    ((portfolio.total_controls > 0 ? 85 : 50) + 
     (portfolio.active_batches > 0 ? 90 : 60)) / 2
  )) : 0;

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-xs)' }}>Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Migration overview and status.
        </p>
      </div>

      {isExecutive && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
              Executive Overview
            </h2>
          </div>
          <div style={{ justifySelf: 'center' }}>
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
          </div>
          <div />
        </div>
      )}

      {isExecutive && (
        <ExecutiveSummary
          completionPercent={portfolio ? Math.round((portfolio.total_controls / Math.max(portfolio.total_controls, 1)) * 100) : 0}
          confidencePercent={healthScore}
          totalSystems={portfolio?.total_systems ?? 0}
          totalBatches={portfolio?.total_batches ?? 0}
        />
      )}

      {isExecutive && (
        <ExecutiveKPI
          kpis={[
            { label: 'Total Systems', value: portfolio?.total_systems ?? 0, icon: '🖥️' },
            { label: 'Total Batches', value: portfolio?.total_batches ?? 0, icon: '📦' },
            { label: 'Total Controls', value: portfolio?.total_controls ?? 0, icon: '✓' },
            { label: 'Active Batches', value: portfolio?.active_batches ?? 0, icon: '⚡' },
            { 
              label: 'Completion Rate', 
              value: `${portfolio ? Math.round((portfolio.total_controls / Math.max(portfolio.total_controls, 1)) * 100) : 0}%`,
              trend: { value: 5, isPositive: true }
            },
          ]}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        {isExecutive && (
          <ExecutiveHealth score={healthScore} />
        )}
        <ExecutiveActions isAdmin={isAdmin} isManager={isManager} />
      </div>

      {migrationScores.length > 0 && (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-md)' }}>
            Migration Score Summary
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Total Batches</p>
              <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)' }}>{migrationScores.length}</p>
            </div>
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Avg Pass Rate</p>
              <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
                {migrationScores.length > 0
                  ? (migrationScores.reduce((sum, m) => sum + m.pass_rate, 0) / migrationScores.length).toFixed(1)
                  : 0}%
              </p>
            </div>
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Fully Passed</p>
              <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
                {migrationScores.filter(m => m.pass_rate === 100).length}
              </p>
            </div>
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Needs Attention</p>
              <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-danger)' }}>
                {migrationScores.filter(m => m.pass_rate < 80).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {isExecutive && (
        <div>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-md)' }}>
            Recent Activity
          </h2>
          <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
            {activity.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>No recent activity.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Action</th>
                    <th style={{ textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Control</th>
                    <th style={{ textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Entity</th>
                    <th style={{ textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((entry) => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background var(--duration-fast) ease', cursor: 'default' }}>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <StatusBadge status={entry.action} size="sm" />
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{entry.entity_type}</td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{entry.entity_id}</td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>
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
