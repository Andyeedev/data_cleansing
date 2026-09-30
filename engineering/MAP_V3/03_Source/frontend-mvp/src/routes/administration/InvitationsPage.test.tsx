import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { TenantProvider } from '../../tenant/TenantContext';
import { InvitationsPage } from './InvitationsPage';

const mockInvitations = [
  {
    invitation_id: 'i1',
    email: 'pending@test.com',
    status: 'pending',
    invited_by: 'admin-id',
    created_at: '2026-09-01T10:00:00Z',
    expires_at: '2099-01-01T00:00:00Z',
  },
  {
    invitation_id: 'i2',
    email: 'accepted@test.com',
    status: 'accepted',
    invited_by: 'admin-id',
    created_at: '2026-08-01T10:00:00Z',
    expires_at: '2099-01-01T00:00:00Z',
  },
];

function seedUser(roles: string[], permissions: string[]) {
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem(
    'map_nexus_user',
    JSON.stringify({
      id: '1',
      email: 'admin@test.com',
      name: 'admin',
      roles,
      permissions,
      tenantId: 'tenant-a',
    }),
  );
}

function installFetch() {
  global.fetch = vi.fn().mockImplementation((url: unknown) => {
    const u = typeof url === 'string' ? url : String((url as Request)?.url ?? url);
    if (u.includes('/invitations')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { invitations: mockInvitations } }),
      });
    }
    return Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true, data: {} }) });
  });
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/administration/invitations']}>
      <AuthProvider>
        <TenantProvider>
          <InvitationsPage />
        </TenantProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

const FULL = ['invitations:read', 'invitations:create', 'invitations:resend', 'invitations:revoke'];
const READ_ONLY = ['invitations:read'];

describe('InvitationsPage action affordances (E4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    installFetch();
  });

  it('hides Invite, Resend and Revoke without their grants', async () => {
    seedUser(['Tenant Admin'], READ_ONLY);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('pending@test.com')).toBeInTheDocument();
    });
    expect(screen.queryByLabelText('Invite user')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Resend invitation to pending@test.com')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Revoke invitation for pending@test.com')).not.toBeInTheDocument();
  });

  it('shows all four affordances with their grants', async () => {
    seedUser(['Tenant Admin'], FULL);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('pending@test.com')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Invite user')).toBeInTheDocument();
    expect(screen.getByLabelText('Resend invitation to pending@test.com')).toBeInTheDocument();
    expect(screen.getByLabelText('Revoke invitation for pending@test.com')).toBeInTheDocument();
  });

  it('keeps Resend/Revoke hidden for non-pending rows even with grants', async () => {
    seedUser(['Super Admin'], FULL);
    // Super Admin defaults to All-Tenants (list unavailable); scope to a
    // tenant so the status-gating behaviour is under test.
    sessionStorage.setItem('map_nexus_tenant_scope', JSON.stringify({ kind: 'tenant', tenantId: 'tenant-a' }));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('accepted@test.com')).toBeInTheDocument();
    });
    expect(screen.queryByLabelText('Resend invitation to accepted@test.com')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Revoke invitation for accepted@test.com')).not.toBeInTheDocument();
    // Pending row still offers both actions.
    expect(screen.getByLabelText('Resend invitation to pending@test.com')).toBeInTheDocument();
    expect(screen.getByLabelText('Revoke invitation for pending@test.com')).toBeInTheDocument();
  });
});
