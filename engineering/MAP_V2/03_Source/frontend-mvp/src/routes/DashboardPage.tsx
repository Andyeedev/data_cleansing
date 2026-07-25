import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner';

interface PortfolioSummary {
  total_systems: number;
  total_batches: number;
  total_controls: number;
  active_batches: number;
}

interface KPIMetric {
  label: string;
  value: string | number;
  trend?: string;
}

export function DashboardPage() {
  const { userRoles } = useAuth();
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [kpis, setKpis] = useState<KPIMetric[]>([]);

  const isAdmin = userRoles.includes('admin');
  const isManager = userRoles.includes('manager');
  const isExecutive = isAdmin || isManager;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/v1/dashboard/portfolio').then((res) => res.json()),
      fetch('/api/v1/dashboard/kpis').then((res) => res.json()),
    ])
      .then(([portfolioData, kpiData]) => {
        if (portfolioData.success && portfolioData.data) {
          setPortfolio(portfolioData.data);
        }
        if (kpiData.success && kpiData.data) {
          setKpis(kpiData.data.kpis || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
          Key Performance Indicators
        </h2>
        {kpis.length === 0 ? (
          <div style={{ padding: 16, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>No KPI data available.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {kpis.map((kpi, idx) => (
              <div key={idx} style={{ padding: 16, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginBottom: 4 }}>{kpi.label}</div>
                <div style={{ fontSize: 24, fontWeight: 600 }}>{kpi.value}</div>
                {kpi.trend && (
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{kpi.trend}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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
            <p style={{ color: 'var(--color-text-secondary)' }}>No recent activity.</p>
          </div>
        </div>
      )}
    </div>
  );
}
