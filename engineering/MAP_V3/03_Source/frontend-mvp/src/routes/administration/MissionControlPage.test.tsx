import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
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

function seedUser(roles: string[], permissions: string[]) {
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem(
    'map_nexus_user',
    JSON.stringify({ id: '1', email: 'admin@test.com', name: 'admin', roles, permissions }),
  );
}

function mockFetchOk(data: unknown) {
  return { ok: true, status: 200, json: async () => ({ success: true, data }) };
}

function installFetch() {
  global.fetch = vi.fn().mockImplementation((url: unknown) => {
    const u = typeof url === 'string' ? url : String((url as Request)?.url ?? url);
    if (u.includes('/auth/me')) return mockFetchOk({ subscription: SUBSCRIPTION });
    if (u.includes('/governance/audit')) return mockFetchOk({ entries: [], total: 0 });
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
        <MissionControlPage />
      </AuthProvider>
    </MemoryRouter>,
  );
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
  });

  it('Super Admin sees every card with real figures and permitted actions', async () => {
    seedUser(['Super Admin'], SA_PERMS);
    renderMission();

    await waitFor(() => {
      expect(screen.getByText('Mission Control')).toBeInTheDocument();
    });
    for (const card of [
      'Governance Posture',
      'Access Capacity',
      'Entitlements vs Plan',
      'Security & Health',
      'Role & Permission Matrix',
      'Pending Registrations',
      'Quick Actions',
    ]) {
      expect(screen.getByText(card)).toBeInTheDocument();
    }
    // Real figures, not invented: 2 leads from the mocked endpoint.
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
    expect(screen.getByText('Invite User')).toBeInTheDocument();
    expect(screen.getByText('Manage Tenants')).toBeInTheDocument();
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
    expect(screen.getByText('Invite User')).toBeInTheDocument();
  });

  it('shows an unavailable state where data does not exist', async () => {
    seedUser(['Tenant Admin'], TA_PERMS);
    renderMission();
    await waitFor(() => {
      expect(screen.getByText('Per-feature entitlement detail unavailable.')).toBeInTheDocument();
    });
  });
});
