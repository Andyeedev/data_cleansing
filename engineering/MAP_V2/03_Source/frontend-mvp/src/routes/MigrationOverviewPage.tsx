import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMigrationOverview } from '../hooks/useMigration';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { LoadingOverlay } from '../components/LoadingOverlay/LoadingOverlay';
import { ErrorState } from '../components/shared/ErrorState';
import { StatusBadge } from '../components/shared/StatusBadge';
import { TenantFilter } from '../components/shared/TenantFilter';

export function MigrationOverviewPage() {
  const navigate = useNavigate();
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const { overview, loading, error, refetch } = useMigrationOverview(selectedTenant || undefined);

  if (loading) {
    return <LoadingOverlay message="Loading overview..." />;
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Migration Overview" description="Summary of all migration activity" />
        <ErrorState message={error} onRetry={refetch} />
      </PageContainer>
    );
  }

  const stats = overview || {
    total_projects: 0,
    total_batches: 0,
    total_controls: 0,
    completed_controls: 0,
    total_datasets: 0,
    active_projects: 0,
    active_batches: 0,
    health_score: 0,
    recent_activity: [],
    top_projects: [],
  };

  return (
    <PageContainer>
      <PageHeader
        title="Migration Overview"
        description="Summary of all migration activity"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            <button style={refreshButtonStyle} onClick={refetch}>
              Refresh
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div style={kpiGridStyle}>
        <div style={kpiCardStyle}>
          <div style={kpiLabelStyle}>Projects</div>
          <div style={kpiValueStyle}>{stats.total_projects}</div>
          <div style={kpiSubStyle}>{stats.active_projects} active</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={kpiLabelStyle}>Batches</div>
          <div style={kpiValueStyle}>{stats.total_batches.toLocaleString()}</div>
          <div style={kpiSubStyle}>{stats.active_batches} running</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={kpiLabelStyle}>Controls</div>
          <div style={kpiValueStyle}>{stats.total_controls.toLocaleString()}</div>
          <div style={kpiSubStyle}>{stats.completed_controls.toLocaleString()} completed</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={kpiLabelStyle}>Datasets</div>
          <div style={kpiValueStyle}>{stats.total_datasets}</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={kpiLabelStyle}>Active Batches</div>
          <div style={kpiValueStyle}>{stats.active_batches}</div>
        </div>
      </div>

      {/* Health Score + Quick Actions */}
      <div style={twoColStyle}>
        {/* Health Score */}
        <div style={sectionCardStyle}>
          <h3 style={sectionTitleStyle}>Health Score</h3>
          <div style={healthContainerStyle}>
            <div style={healthScoreStyle}>{stats.health_score}%</div>
            <div style={healthBarBgStyle}>
              <div
                style={{
                  ...healthBarFillStyle,
                  width: `${stats.health_score}%`,
                  background: stats.health_score >= 80 ? 'var(--color-success)' :
                    stats.health_score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={sectionCardStyle}>
          <h3 style={sectionTitleStyle}>Quick Actions</h3>
          <div style={actionsGridStyle}>
            <button style={actionBtnStyle} onClick={() => navigate('/migration/projects')}>
              View Projects
            </button>
            <button style={actionBtnStyle} onClick={() => navigate('/migration/datasets')}>
              Upload Dataset
            </button>
            <button style={actionBtnStyle} onClick={() => navigate('/migration/reports')}>
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={sectionCardStyle}>
        <h3 style={sectionTitleStyle}>Recent Activity</h3>
        {stats.recent_activity.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            No recent activity.
          </p>
        ) : (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Entity</th>
                  <th style={thStyle}>Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_activity.map((entry) => (
                  <tr key={entry.id} style={trStyle}>
                  <td style={tdStyle}>
                    <StatusBadge status={entry.status} size="sm" />
                  </td>
                    <td style={tdStyle}>{entry.entity_name}</td>
                    <td style={tdStyle}>{formatTimeAgo(entry.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Projects by Progress */}
      <div style={sectionCardStyle}>
        <h3 style={sectionTitleStyle}>Top Projects by Progress</h3>
        {stats.top_projects.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            No projects with batches yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {stats.top_projects.map((project) => {
              const pct = project.total_batches > 0
                ? Math.round((project.completed_batches / project.total_batches) * 100)
                : 0;
              return (
                <div key={project.project_name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                      {project.project_name}
                    </span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {pct}% ({project.completed_batches}/{project.total_batches})
                    </span>
                  </div>
                  <div style={progressBarBgStyle}>
                    <div style={{ ...progressBarFillStyle, width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
}

// Styles
const selectStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  background: 'var(--color-bg-secondary)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  fontSize: 'var(--font-size-sm)',
};

const refreshButtonStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  background: 'var(--color-bg-secondary)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-sm)',
};

const kpiGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: 'var(--space-md)',
  marginBottom: 'var(--space-lg)',
};

const kpiCardStyle: React.CSSProperties = {
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  padding: 'var(--space-lg)',
  textAlign: 'center',
};

const kpiLabelStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  marginBottom: 'var(--space-xs)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const kpiValueStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-h3)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
};

const kpiSubStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  marginTop: 'var(--space-xs)',
};

const twoColStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 'var(--space-lg)',
  marginBottom: 'var(--space-lg)',
};

const sectionCardStyle: React.CSSProperties = {
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  padding: 'var(--space-lg)',
  marginBottom: 'var(--space-lg)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text)',
  marginBottom: 'var(--space-md)',
};

const healthContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-md)',
};

const healthScoreStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-h2)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
  minWidth: '80px',
};

const healthBarBgStyle: React.CSSProperties = {
  flex: 1,
  height: '12px',
  background: 'var(--color-bg)',
  borderRadius: 'var(--radius-full)',
  overflow: 'hidden',
};

const healthBarFillStyle: React.CSSProperties = {
  height: '100%',
  borderRadius: 'var(--radius-full)',
  transition: 'width 0.3s ease',
};

const actionsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: 'var(--space-sm)',
};

const actionBtnStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  background: 'var(--color-primary)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
};

const tableContainerStyle: React.CSSProperties = {
  overflowX: 'auto',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  textAlign: 'left',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-secondary)',
  fontSize: 'var(--font-size-xs)',
  borderBottom: '1px solid var(--color-border)',
};

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid var(--color-border)',
};

const tdStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  fontSize: 'var(--font-size-sm)',
};

const progressBarBgStyle: React.CSSProperties = {
  height: '8px',
  background: 'var(--color-bg)',
  borderRadius: 'var(--radius-full)',
  overflow: 'hidden',
};

const progressBarFillStyle: React.CSSProperties = {
  height: '100%',
  background: 'var(--color-primary)',
  borderRadius: 'var(--radius-full)',
  transition: 'width 0.3s ease',
};
