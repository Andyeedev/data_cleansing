import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { useHealth } from '../../hooks/useHealth';
import { useBatchStatusBreakdown } from '../../hooks/useExecutionBreakdown';
import { useEntitlements } from '../../hooks/useEntitlements';
import { useTenantScope } from '../../tenant/TenantContext';
import { apiGet } from '../../utils/apiClient';
import { ADMIN_SECTIONS } from '../../admin/adminSections';
import { canAccessSection, type AdminEnvelope } from '../../admin/capabilities';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import {
  ErrorState,
  LoadingSkeleton,
  EmptyState,
  StatusBadge,
  MetricCard,
  ProgressBar,
} from '../../components/shared';

interface GovernanceOverview {
  total_findings: number;
  open: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

function sectionByPath(path: string) {
  return ADMIN_SECTIONS.find((section) => section.path === path);
}

function cardStyle(): React.CSSProperties {
  return {
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
    minWidth: 0,
  };
}

/**
 * Phase B — Mission Control landing for `/administration` (spec §5).
 *
 * Cards are shortcuts, not a second navigation hierarchy: every card and
 * quick action applies the same check as its destination section (from the
 * single ADMIN_SECTIONS catalogue). Data comes only from existing hooks and
 * the same endpoints the section pages already call; where data does not
 * exist the card shows a loading/empty/unavailable state — never invented
 * figures. Full live aggregation belongs to Stage D.
 */
export function MissionControlPage() {
  const navigate = useNavigate();
  const { userRoles, user } = useAuth();
  const envelope: AdminEnvelope = { roles: userRoles, permissions: user?.permissions ?? [] };

  const can = (path: string) => {
    const section = sectionByPath(path);
    return section ? canAccessSection(section, envelope) : false;
  };

  const isSuperAdmin = userRoles.includes('Super Admin');

  // Phase C: tenant working scope. Tenant-derived cards (governance,
  // capacity, entitlements, pending registrations) follow the scope; in
  // All-Tenants mode they show an unavailable state instead of quietly
  // showing one tenant's data (amendment 2 — aggregation is Stage D).
  // Platform-global cards (health, own role matrix, quick actions) stay live.
  const { scope, scopeTenantId, lockedTenantId } = useTenantScope();
  const isAllTenants = isSuperAdmin && scope.kind === 'all';
  // Tenant passed to scoped reads: SA scoped selection, else the locked own
  // tenant (TA) or nothing (JWT scopes server-side). Null in All-Tenants
  // mode, where tenant-derived cards show unavailable states.
  const hookTenant = isSuperAdmin ? (scopeTenantId ?? undefined) : (lockedTenantId ?? undefined);

  const {
    subscription,
    isLoading: subLoading,
    error: subError,
    usagePercent,
    daysUntilTrialEnd,
    refetch: refetchSubscription,
  } = useSubscription();
  const { health, loading: healthLoading, error: healthError, refetch: refetchHealth } = useHealth();

  const [overview, setOverview] = useState<GovernanceOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  const [pendingApprovals, setPendingApprovals] = useState<number | null>(null);
  const [approvalsLoading, setApprovalsLoading] = useState(true);
  const [approvalsError, setApprovalsError] = useState<string | null>(null);

  const isTenantAdmin = userRoles.includes('Tenant Admin');
  const canSeeApprovals = isSuperAdmin || isTenantAdmin;

  const [pendingLeads, setPendingLeads] = useState<number | null>(null);
  const [leadsLoading, setLeadsLoading] = useState(isSuperAdmin);
  const [leadsError, setLeadsError] = useState<string | null>(null);

  // Phase D: findings severity from the existing governance overview
  // endpoint (tenant-scoped server-side; SA scoped views pass the tenant).
  useEffect(() => {
    let cancelled = false;
    setOverviewLoading(true);
    setOverviewError(null);
    const overviewPath =
      isSuperAdmin && scopeTenantId ? `/governance/overview?tenant_id=${scopeTenantId}` : '/governance/overview';
    apiGet<GovernanceOverview>(overviewPath)
      .then((res) => {
        if (!cancelled) setOverview(res);
      })
      .catch((err) => {
        if (!cancelled) setOverviewError(err instanceof Error ? err.message : 'Failed to load governance overview');
      })
      .finally(() => {
        if (!cancelled) setOverviewLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin, scopeTenantId]);

  // Phase D: pending approvals count (require_tenant_admin: SA + TA).
  useEffect(() => {
    if (!canSeeApprovals) {
      setApprovalsLoading(false);
      return;
    }
    let cancelled = false;
    setApprovalsLoading(true);
    setApprovalsError(null);
    const approvalsPath =
      isSuperAdmin && scopeTenantId ? `/governance/approvals?tenant_id=${scopeTenantId}` : '/governance/approvals';
    apiGet<{ pending: unknown[]; total: number }>(approvalsPath)
      .then((res) => {
        if (!cancelled) setPendingApprovals(res.total ?? (res.pending || []).length);
      })
      .catch((err) => {
        if (!cancelled) setApprovalsError(err instanceof Error ? err.message : 'Failed to load approvals');
      })
      .finally(() => {
        if (!cancelled) setApprovalsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [canSeeApprovals, isSuperAdmin, scopeTenantId]);

  // Phase D: validation batch activity (existing breakdown endpoint) and
  // effective entitlements (read-only endpoint) for the working scope.
  const {
    data: breakdown,
    loading: breakdownLoading,
    error: breakdownError,
  } = useBatchStatusBreakdown('week', hookTenant);
  const {
    entitlements,
    isLoading: entitlementsLoading,
    error: entitlementsError,
  } = useEntitlements(isAllTenants ? null : (hookTenant ?? null));

  useEffect(() => {
    if (!isSuperAdmin) {
      setLeadsLoading(false);
      return;
    }
    let cancelled = false;
    setLeadsLoading(true);
    setLeadsError(null);
    apiGet<{ leads: unknown[] }>('/admin/registrations')
      .then((res) => {
        if (!cancelled) setPendingLeads((res.leads || []).length);
      })
      .catch((err) => {
        if (!cancelled) setLeadsError(err instanceof Error ? err.message : 'Failed to load registrations');
      })
      .finally(() => {
        if (!cancelled) setLeadsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin]);

  const quickActions: Array<{ label: string; path: string; permission?: string; role?: string }> = [];
  if ((user?.permissions ?? []).includes('invitations:create')) {
    quickActions.push({ label: 'Invite User', path: '/administration/invitations' });
  }
  if (can('/administration/users')) {
    quickActions.push({ label: 'Manage Users', path: '/administration/users' });
  }
  if (can('/administration/roles')) {
    quickActions.push({ label: 'Manage Roles', path: '/administration/roles' });
  }
  // Phase D (D5): entitlement-aware shortcuts. When the effective
  // entitlement set loaded, hide destinations whose capability is not
  // entitled; when it cannot load, fall back to permission-only gating.
  // Targets remain independently guarded by route + backend (navigation
  // aids only, never security).
  const entitlementsKnown = !entitlementsLoading && !entitlementsError && entitlements.length > 0;
  const entitled = (key: string) => !entitlementsKnown || entitlements.includes(key);
  if (entitled('validation')) {
    quickActions.push({ label: 'Open Validation Centre', path: '/validation-centre' });
  }
  if (canSeeApprovals && (entitled('governance') || entitled('core_governance') || entitled('advanced_governance') || entitled('enterprise_governance'))) {
    quickActions.push({ label: 'Review Approvals', path: '/governance/approvals' });
  }
  if (isSuperAdmin) {
    quickActions.push({ label: 'Review Registrations', path: '/administration/registrations' });
    quickActions.push({ label: 'Manage Tenants', path: '/administration/tenants' });
  }

  const trialDays = daysUntilTrialEnd();
  // Phase D: live/current indicator (spec §14) — refreshes whenever the
  // scope-driven fetches settle. No polling: updates ride on mount,
  // scope change, and manual retry.
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  useEffect(() => {
    if (!subLoading && !healthLoading && !overviewLoading && !breakdownLoading) {
      setUpdatedAt(new Date().toLocaleTimeString());
    }
  }, [subLoading, healthLoading, overviewLoading, breakdownLoading]);

  return (
    <PageContainer>
      <PageHeader
        title="Mission Control"
        description="Administration overview: posture, capacity, entitlements, and pending work for your scope."
      />
      {updatedAt && (
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-md)' }}>
          Updated {updatedAt} · live data for the selected scope
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-md)',
        }}
      >
        <section style={cardStyle()} aria-label="Governance posture">
          <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Governance Posture</h3>
          {isAllTenants ? (
            <EmptyState title="Not available for All Tenants" description="Select a tenant scope to view governance posture." />
          ) : overviewLoading ? (
            <LoadingSkeleton variant="card" />
          ) : overviewError ? (
            <ErrorState message={overviewError} />
          ) : overview ? (
            <>
              <MetricCard title="Open findings" value={overview.open} icon="🔍" />
              <ProgressBar value={overview.open} max={Math.max(overview.total_findings, 1)} showPercentage label="Open findings vs total" />
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <StatusBadge status={`Critical ${overview.critical}`} size="sm" />
                <StatusBadge status={`High ${overview.high}`} size="sm" />
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                Source: governance findings overview. {overview.total_findings} total finding(s).
              </span>
              <button
                onClick={() => navigate('/governance/audit')}
                style={{ background: 'none', border: 'none', color: 'var(--color-sidebar-active)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: 'var(--font-size-sm)', textDecoration: 'underline' }}
              >
                Open Audit Trail
              </button>
            </>
          ) : (
            <EmptyState title="No findings" description="No governance findings for this scope." />
          )}
        </section>

        <section style={cardStyle()} aria-label="Validation activity">
          <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Validation Activity</h3>
          {isAllTenants ? (
            <EmptyState title="Not available for All Tenants" description="Select a tenant scope to view validation activity." />
          ) : breakdownLoading ? (
            <LoadingSkeleton variant="card" />
          ) : breakdownError ? (
            <ErrorState message={breakdownError} />
          ) : breakdown ? (
            <>
              <MetricCard title="Batches (week)" value={breakdown.total} icon="⚙" />
              <MetricCard title="Completed" value={breakdown.breakdown.COMPLETED ?? 0} icon="✅" color="var(--color-success)" />
              <MetricCard title="Failed" value={breakdown.breakdown.FAILED ?? 0} icon="❌" />
              <ProgressBar
                value={breakdown.breakdown.COMPLETED ?? 0}
                max={Math.max(breakdown.total, 1)}
                showPercentage
                label="Completed batches vs total, week"
              />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                Source: batch status breakdown, week granularity.
              </span>
              <button
                onClick={() => navigate('/validation/results')}
                style={{ background: 'none', border: 'none', color: 'var(--color-sidebar-active)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: 'var(--font-size-sm)', textDecoration: 'underline' }}
              >
                Open Validation Results
              </button>
            </>
          ) : (
            <EmptyState title="No activity" description="No validation batches for this scope." />
          )}
        </section>

        <section style={cardStyle()} aria-label="Access capacity">
          <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Access Capacity</h3>
          {isAllTenants ? (
            <EmptyState title="Not available for All Tenants" description="Select a tenant scope to view access capacity." />
          ) : subLoading ? (
            <LoadingSkeleton variant="card" />
          ) : subError ? (
            <ErrorState message={subError} onRetry={refetchSubscription} />
          ) : subscription ? (
            <>
              <MetricCard title="Users" value={`${subscription.limits.users.current} / ${subscription.limits.users.max}`} icon="👤" />
              <ProgressBar value={subscription.limits.users.current} max={subscription.limits.users.max} showPercentage label="Users usage vs plan" />
              <MetricCard title="Projects" value={`${subscription.limits.projects.current} / ${subscription.limits.projects.max}`} icon="📁" />
              <ProgressBar value={subscription.limits.projects.current} max={subscription.limits.projects.max} showPercentage label="Projects usage vs plan" />
              <MetricCard title="Connections" value={`${subscription.limits.connections.current} / ${subscription.limits.connections.max}`} icon="🔌" />
              <ProgressBar value={subscription.limits.connections.current} max={subscription.limits.connections.max} showPercentage label="Connections usage vs plan" />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                Source: subscription limits. Users at {usagePercent('users')}% of plan.
              </span>
            </>
          ) : (
            <EmptyState title="No subscription" description="No active subscription for this tenant." />
          )}
        </section>

        <section style={cardStyle()} aria-label="Entitlements versus plan">
          <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Entitlements vs Plan</h3>
          {isAllTenants ? (
            <EmptyState title="Not available for All Tenants" description="Select a tenant scope to view entitlements." />
          ) : subLoading ? (
            <LoadingSkeleton variant="card" />
          ) : subError ? (
            <ErrorState message={subError} onRetry={refetchSubscription} />
          ) : subscription ? (
            <>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                <StatusBadge status={subscription.status} size="sm" />
                <span style={{ fontSize: 'var(--font-size-sm)' }}>
                  {subscription.plan_name ?? subscription.plan_tier ?? 'Unknown plan'}
                </span>
              </div>
              {trialDays !== null && (
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  {trialDays} day(s) left in trial
                </span>
              )}
              {entitlementsLoading ? (
                <LoadingSkeleton variant="card" />
              ) : entitlementsError ? (
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  Per-feature entitlement detail unavailable.
                </span>
              ) : entitlements.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }} aria-label="Enabled capabilities">
                  {entitlements.slice(0, 10).map((key) => (
                    <StatusBadge key={key} status={key} variant="info" size="sm" />
                  ))}
                  {entitlements.length > 10 && (
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      +{entitlements.length - 10} more
                    </span>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  No enabled capabilities reported for this scope.
                </span>
              )}
              {isSuperAdmin && (
                <button
                  onClick={() => navigate('/billing/subscription')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-sidebar-active)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: 'var(--font-size-sm)', textDecoration: 'underline' }}
                >
                  Manage Plan
                </button>
              )}
            </>
          ) : (
            <EmptyState title="No subscription" description="No active subscription for this tenant." />
          )}
        </section>

        <section style={cardStyle()} aria-label="Security and health">
          <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Security &amp; Health</h3>
          {healthLoading ? (
            <LoadingSkeleton variant="card" />
          ) : healthError ? (
            <ErrorState message={healthError} onRetry={refetchHealth} />
          ) : health ? (
            <>
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>API:</span>
                <StatusBadge status={health.api ? 'ACTIVE' : 'FAILED'} size="sm" />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Database:</span>
                <StatusBadge status={health.database ? 'ACTIVE' : 'FAILED'} size="sm" />
              </div>
              {can('/administration/security') && (
                <button
                  onClick={() => navigate('/administration/security')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-sidebar-active)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: 'var(--font-size-sm)', textDecoration: 'underline' }}
                >
                  Open Security Policies
                </button>
              )}
            </>
          ) : (
            <EmptyState title="Health unavailable" description="Monitoring health could not be loaded." />
          )}
        </section>

        <section style={cardStyle()} aria-label="Role and permission matrix">
          <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Role &amp; Permission Matrix</h3>
          <MetricCard title="Roles" value={userRoles.length} icon="🔑" />
          <MetricCard title="Granted permissions" value={(user?.permissions ?? []).length} icon="🛡" />
          {can('/administration/roles') && (
            <button
              onClick={() => navigate('/administration/roles')}
              style={{ background: 'none', border: 'none', color: 'var(--color-sidebar-active)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: 'var(--font-size-sm)', textDecoration: 'underline' }}
            >
              Open Roles &amp; Permissions
            </button>
          )}
        </section>

        {canSeeApprovals && (
          <section style={cardStyle()} aria-label="Pending approvals">
            <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Pending Approvals</h3>
            {isAllTenants ? (
              <EmptyState title="Not available for All Tenants" description="Select a tenant scope to view pending approvals." />
            ) : approvalsLoading ? (
              <LoadingSkeleton variant="card" />
            ) : approvalsError ? (
              <ErrorState message={approvalsError} />
            ) : (
              <>
                <MetricCard title="Awaiting decision" value={pendingApprovals ?? 0} icon="✋" />
                <button
                  onClick={() => navigate('/governance/approvals')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-sidebar-active)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: 'var(--font-size-sm)', textDecoration: 'underline' }}
                >
                  Review Approvals
                </button>
              </>
            )}
          </section>
        )}

        {isSuperAdmin && (
          <section style={cardStyle()} aria-label="Pending registrations">
            <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Pending Registrations</h3>
            {leadsLoading ? (
              <LoadingSkeleton variant="card" />
            ) : leadsError ? (
              <ErrorState message={leadsError} />
            ) : (
              <>
                <MetricCard title="Website leads awaiting review" value={pendingLeads ?? 0} icon="✉" />
                <button
                  onClick={() => navigate('/administration/registrations')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-sidebar-active)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: 'var(--font-size-sm)', textDecoration: 'underline' }}
                >
                  Review Registrations
                </button>
              </>
            )}
          </section>
        )}

        <section style={cardStyle()} aria-label="Quick actions">
          <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Quick Actions</h3>
          {quickActions.length === 0 ? (
            <EmptyState title="No actions available" description="No permitted quick actions for your role." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {quickActions.map((action) => (
                <button
                  key={action.path + action.label}
                  onClick={() => navigate(action.path)}
                  style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 'var(--space-xs) var(--space-sm)', cursor: 'pointer', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', textAlign: 'left' }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
