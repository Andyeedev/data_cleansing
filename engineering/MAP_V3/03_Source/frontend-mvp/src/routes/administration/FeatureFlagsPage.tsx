import { PageContainer } from '../../components/PageContainer/PageContainer';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { ErrorState, LoadingSkeleton, EmptyState } from '../../components/shared';
import { KpiBox, ReportCard, StatusPill } from '../../components/reports/reportWidgets';
import { useFeatureFlagList, useUpdateFeatureFlag } from '../../hooks/useFeatureFlags';
import { useAuth } from '../../context/AuthContext';
import type { FeatureFlag } from '../../types/settings';

function FlagCard({ flag, onToggle, canEdit }: { flag: FeatureFlag; onToggle: () => void; canEdit: boolean }) {
  const enabled = flag.enabled ? 'Enabled' : 'Disabled';
  return (
    <ReportCard title={flag.name} subtitle={flag.description ?? 'No description provided.'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <input
            type="checkbox"
            checked={flag.enabled}
            disabled={!canEdit}
            title={canEdit ? `Toggle ${flag.name}` : 'Requires settings:update'}
            aria-label={`Toggle feature flag ${flag.key}`}
            onChange={onToggle}
          />
          <StatusPill status={enabled} />
        </label>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Rollout {flag.rollout_percentage}% · {flag.status}
        </span>
      </div>
    </ReportCard>
  );
}

export function FeatureFlagsPage() {
  const { data: flags, loading, error, refetch } = useFeatureFlagList();
  const { update } = useUpdateFeatureFlag();
  // Phase E (E9): toggle affordance follows settings:update (route is
  // SA-only; backend still enforces).
  const { userRoles, user } = useAuth();
  const canEditFlags =
    (user?.permissions ?? []).includes('settings:update') || userRoles.includes('Super Admin');

  const toggle = async (flag: FeatureFlag) => {
    await update(flag.key, { enabled: !flag.enabled });
    await refetch();
  };

  const enabledCount = flags.filter((f) => f.enabled).length;

  return (
    <PageContainer>
      <PageHeader
        title="Feature Flags"
        description="Toggle workspace features and rollout percentages. Changes are persisted to the settings service."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <KpiBox label="Total flags" value={loading ? '—' : flags.length} tone="neutral" />
        <KpiBox label="Enabled" value={enabledCount} tone="success" />
        <KpiBox label="Disabled" value={flags.length - enabledCount} tone="warning" />
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} variant="list" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : flags.length === 0 ? (
        <EmptyState message="No feature flags configured." />
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
      {flags.map((flag) => (
        <FlagCard key={flag.key} flag={flag} onToggle={() => toggle(flag)} canEdit={canEditFlags} />
      ))}
        </div>
      )}
    </PageContainer>
  );
}