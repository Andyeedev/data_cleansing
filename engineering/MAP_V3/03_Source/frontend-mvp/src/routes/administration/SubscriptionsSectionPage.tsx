import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../hooks/useSubscription';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import {
  ErrorState,
  LoadingSkeleton,
  EmptyState,
  StatusBadge,
  MetricCard,
} from '../../components/shared';

/**
 * Phase B — thin Subscriptions section (Super Admin only).
 *
 * Read-only plan/subscription summary reusing `useSubscription` so the spec
 * §4.1 Subscriptions rail entry has a destination. Full subscription/plan
 * administration belongs to Stage E.
 */
export function SubscriptionsSectionPage() {
  const navigate = useNavigate();
  const {
    subscription,
    isLoading,
    error,
    usagePercent,
    daysUntilTrialEnd,
    refetch,
  } = useSubscription();

  const trialDays = daysUntilTrialEnd();

  return (
    <PageContainer>
      <PageHeader
        title="Subscriptions"
        description="Current plan, status, and capacity for the workspace."
      />

      {isLoading ? (
        <LoadingSkeleton variant="card" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !subscription ? (
        <EmptyState title="No subscription" description="No active subscription for this tenant." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <StatusBadge status={subscription.status} size="sm" />
            <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 500 }}>
              {subscription.plan_name ?? subscription.plan_tier ?? 'Unknown plan'}
            </span>
            {subscription.billing_cycle && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                {subscription.billing_cycle} billing
              </span>
            )}
          </div>
          {trialDays !== null && (
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {trialDays} day(s) left in trial
            </span>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-md)',
            }}
          >
            <MetricCard title="Users" value={`${subscription.limits.users.current} / ${subscription.limits.users.max}`} icon="👤" />
            <MetricCard title="Projects" value={`${subscription.limits.projects.current} / ${subscription.limits.projects.max}`} icon="📁" />
            <MetricCard title="Connections" value={`${subscription.limits.connections.current} / ${subscription.limits.connections.max}`} icon="🔌" />
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Users at {usagePercent('users')}% of plan. Full subscription management arrives in Stage E.
          </span>
          <div>
            <button
              onClick={() => navigate('/billing/subscription')}
              style={{
                padding: 'var(--space-xs) var(--space-md)',
                background: 'transparent',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 500,
              }}
            >
              Open Billing
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
