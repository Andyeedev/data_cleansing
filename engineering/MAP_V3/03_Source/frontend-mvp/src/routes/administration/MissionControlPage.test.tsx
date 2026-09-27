import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { TenantProvider } from '../../tenant/TenantContext';
import { MissionControlPage } from './MissionControlPage';

const SUBSCRIPTION = {
  plan_tier: 'professional',
  plan_name: 'Professional',
  status: 'active',
  trial_end_date: null,
  billing_cycle: 'annual',
  end_date: null,
  limits: {
    projects: { current: 1, max: 3 },
    users: { current: 2, max: 5 },
    connections: { current: 1, max: 5 },
  },
};

function seedUser(roles: string[], permissions: string[], tenantId = 'tenant-a') {
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem(
    'map_nexus_user',
    JSON.stringify({ id: '1', email: 'admin@test.com', name: 'admin', roles, permissions, tenantId }),
  );
}

function mockFetchOk(data: unknown) {
  return { ok: true, status: 200, json: async () => ({ success: true, data }) };
}

function installFetch() {
  global.fetch = vi.fn().mockImplementation((url: unknown) => {
    const u = typeof url === 'string' ? url : String((url as Request)?.url ?? url);
    if (u.includes('/auth/me')) return mockFetchOk({ subscription: SUBSCRIPTION });
    if (u.includes('/governance/overview')) {
      return mockFetchOk({ total_findings: 5, open: 3, critical: 1, high: 1, medium: 2, low: 1 });
    }
    if (u.includes('/governance/approvals')) {
      return mockFetchOk({ pending: [{ id: 'a1' }], total: 1 });
    }
    if (u.includes('/governance/audit')) return mockFetchOk({ entries: [], total: 0 });
    if (u.includes('/execution/history/status-breakdown')) {
      return mockFetchOk({
        breakdown: { COMPLETED: 4, FAILED: 1 },
        total: 5,
        unscored: 0,
        today_breakdown: { COMPLETED: 2 },
        time_range: 'week',
      });
    }
    if (u.includes('/entitlements')) {
      return mockFetchOk({ tenant_id: 'tenant-a', entitlements: ['validation', 'audit_trail'] });
    }
    if (u.includes('/admin/registrations')) {
      return mockFetchOk({ leads: [{ id: 'l1' }, { id: 'l2' }] });
    }
    if (u.includes('/monitoring/health')) {
      return mockFetchOk({ database: true, api: true, timestamp: null });
    }
    return mockFetchOk({});
  });
}

function renderMission() {
  return render(
    <MemoryRouter initialEntries={['/administration']}>
      <AuthProvider>
        <TenantProvider>
          <MissionControlPage />
        </TenantProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

function seedScopedTenant(tenantId = 'tenant-a') {
  sessionStorage.setItem('map_nexus_tenant_scope', JSON.stringify({ kind: 'tenant', tenantId }));
}

const SA_PERMS = [
  'users:list', 'roles:list', 'invitations:read', 'invitations:create',
  'settings:read', 'reports:read',
];
// Tenant-scoped grant set per the Stage A seed (includes invitations:create).
const TA_PERMS = ['users:list', 'roles:list', 'invitations:read', 'invitations:create', 'settings:read'];

describe('MissionControlPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installFetch();
    sessionStorage.clear();
  });

  it('Super Admin sees every card with real figures and permitted actions', async () => {
    seedUser(['Super Admin'], SA_PERMS);
    seedScopedTenant();
    renderMission();

    await waitFor(() => {
      expect(screen.getByText('Mission Control')).toBeInTheDocument();
    });
    for (const card of [
      'Governance Posture',
      'Validation Activity',
      'Access Capacity',
      'Entitlements vs Plan',
      'Security & Health',
      'Role & Permission Matrix',
      'Pending Approvals',
      'Pending Registrations',
      'Quick Actions',
    ]) {
      expect(screen.getByText(card)).toBeInTheDocument();
    }
    // Real figures, not invented: 2 leads from the mocked endpoint.
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
    // Endpoint-derived figures: findings severity, batch activity, approvals.
    await waitFor(() => {
      expect(screen.getByText('Open findings')).toBeInTheDocument();
    });
    expect(screen.getByText('Batches (week)')).toBeInTheDocument();
    expect(screen.getByText('Awaiting decision')).toBeInTheDocument();
    // Enabled-capability chips come from the entitlement endpoint.
    expect(screen.getByText('validation')).toBeInTheDocument();
    // Source/granularity captions keep charts honest.
    expect(screen.getByText(/Source: governance findings overview/)).toBeInTheDocument();
    expect(screen.getByText(/Source: batch status breakdown, week granularity/)).toBeInTheDocument();
    expect(screen.getByText(/Updated .* live data for the selected scope/)).toBeInTheDocument();
    expect(screen.getByText('Invite User')).toBeInTheDocument();
    expect(screen.getByText('Manage Tenants')).toBeInTheDocument();
    expect(screen.getByText('Open Validation Centre')).toBeInTheDocument();
    expect(screen.getByText('Review Approvals')).toBeInTheDocument();
    expect(screen.queryByText('No actions available')).not.toBeInTheDocument();
  });

  it('Tenant Admin sees only its tenant-scoped cards and actions', async () => {
    seedUser(['Tenant Admin'], TA_PERMS);
    renderMission();

    await waitFor(() => {
      expect(screen.getByText('Mission Control')).toBeInTheDocument();
    });
    expect(screen.getByText('Access Capacity')).toBeInTheDocument();
    expect(screen.queryByText('Pending Registrations')).not.toBeInTheDocument();
    expect(screen.queryByText('Manage Tenants')).not.toBeInTheDocument();
    expect(screen.queryByText('Manage Plan')).not.toBeInTheDocument();
    // Tenant Admin sees its own approvals and entitlement chips.
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
    expect(screen.getByText('validation')).toBeInTheDocument();
    expect(screen.getByText('Invite User')).toBeInTheDocument();
  });

  it('falls back to an unavailable note when entitlements cannot load', async () => {
    seedUser(['Tenant Admin'], TA_PERMS);
    global.fetch = vi.fn().mockImplementation((url: unknown) => {
      const u = typeof url === 'string' ? url : String((url as Request)?.url ?? url);
      if (u.includes('/entitlements')) {
        return { ok: false, status: 403, json: async () => ({ success: false }) };
      }
      if (u.includes('/auth/me')) return mockFetchOk({ subscription: SUBSCRIPTION });
      if (u.includes('/execution/history/status-breakdown')) {
        return mockFetchOk({ breakdown: {}, total: 0, unscored: 0, today_breakdown: {}, time_range: 'week' });
      }
      return mockFetchOk({});
    });
    renderMission();
    await waitFor(() => {
      expect(screen.getByText('Per-feature entitlement detail unavailable.')).toBeInTheDocument();
    });
  });

  it('Super Admin in All-Tenants mode sees unavailable states, never one tenant data', async () => {
    seedUser(['Super Admin'], SA_PERMS);
    renderMission();
    await waitFor(() => {
      expect(screen.getByText('Mission Control')).toBeInTheDocument();
    });
    // Tenant-derived cards refuse to show a single tenant silently.
    expect(screen.getAllByText('Not available for All Tenants')).toHaveLength(5);
    // Global cards stay live.
    expect(screen.getByText('Security & Health')).toBeInTheDocument();
    expect(screen.getByText('Role & Permission Matrix')).toBeInTheDocument();
    expect(screen.getByText('Pending Registrations')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });
});
