import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { useHealth } from '../../hooks/useHealth';
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
} from '../../components/shared';

interface AuditEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_email: string;
  timestamp: string;
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

  const {
    subscription,
    isLoading: subLoading,
    error: subError,
    usagePercent,
    daysUntilTrialEnd,
    refetch: refetchSubscription,
  } = useSubscription();
  const { health, loading: healthLoading, error: healthError, refetch: refetchHealth } = useHealth();

  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState<string | null>(null);

  const [pendingLeads, setPendingLeads] = useState<number | null>(null);
  const [leadsLoading, setLeadsLoading] = useState(isSuperAdmin);
  const [leadsError, setLeadsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setAuditLoading(true);
    setAuditError(null);
    apiGet<{ entries: AuditEntry[]; total: number }>('/governance/audit?limit=10')
      .then((res) => {
        if (!cancelled) setAuditEntries(res.entries || []);
      })
      .catch((err) => {
        if (!cancelled) setAuditError(err instanceof Error ? err.message : 'Failed to load audit log');
      })
      .finally(() => {
        if (!cancelled) setAuditLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
  if (isSuperAdmin) {
    quickActions.push({ label: 'Review Registrations', path: '/administration/registrations' });
    quickActions.push({ label: 'Manage Tenants', path: '/administration/tenants' });
  }

  const trialDays = daysUntilTrialEnd();

  return (
    <PageContainer>
      <PageHeader
        title="Mission Control"
        description="Administration overview: posture, capacity, entitlements, and pending work for your scope."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-md)',
        }}
      >
        <section style={cardStyle()} aria-label="Governance posture">
          <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Governance Posture</h3>
          {auditLoading ? (
            <LoadingSkeleton variant="card" />
          ) : auditError ? (
            <ErrorState message={auditError} />
          ) : (
            <>
              <MetricCard title="Recent audit entries" value={auditEntries.length} icon="📋" />
              <button
                onClick={() => navigate('/governance/audit')}
                style={{ background: 'none', border: 'none', color: 'var(--color-sidebar-active)', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: 'var(--font-size-sm)', textDecoration: 'underline' }}
              >
                Open Audit Trail
              </button>
            </>
          )}
        </section>

        <section style={cardStyle()} aria-label="Access capacity">
          <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Access Capacity</h3>
          {subLoading ? (
            <LoadingSkeleton variant="card" />
          ) : subError ? (
            <ErrorState message={subError} onRetry={refetchSubscription} />
          ) : subscription ? (
            <>
              <MetricCard title="Users" value={`${subscription.limits.users.current} / ${subscription.limits.users.max}`} icon="👤" />
              <MetricCard title="Projects" value={`${subscription.limits.projects.current} / ${subscription.limits.projects.max}`} icon="📁" />
              <MetricCard title="Connections" value={`${subscription.limits.connections.current} / ${subscription.limits.connections.max}`} icon="🔌" />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                Users at {usagePercent('users')}% of plan
              </span>
            </>
          ) : (
            <EmptyState title="No subscription" description="No active subscription for this tenant." />
          )}
        </section>

        <section style={cardStyle()} aria-label="Entitlements versus plan">
          <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Entitlements vs Plan</h3>
          {subLoading ? (
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
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                Per-feature entitlement detail unavailable.
              </span>
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
