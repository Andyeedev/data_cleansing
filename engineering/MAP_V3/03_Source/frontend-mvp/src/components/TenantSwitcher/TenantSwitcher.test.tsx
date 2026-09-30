import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { TenantProvider } from '../../tenant/TenantContext';
import { TenantSwitcher } from './TenantSwitcher';

const TENANTS = [
  { tenant_id: 't1', tenant_name: 'Tenant One', status: 'ACTIVE', plan_id: 'p1', billing_email: null, max_users: 5, max_projects: 3, max_connections: 5, created_at: '' },
  { tenant_id: 't2', tenant_name: 'Tenant Two', status: 'ACTIVE', plan_id: 'p1', billing_email: null, max_users: 5, max_projects: 3, max_connections: 5, created_at: '' },
];

function seedUser(roles: string[], tenantId: string | null) {
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem(
    'map_nexus_user',
    JSON.stringify({
      id: '1',
      email: 'admin@test.com',
      name: 'admin',
      roles,
      permissions: [],
      tenantId: tenantId ?? undefined,
    }),
  );
  global.fetch = vi.fn().mockImplementation(() => ({
    ok: true,
    status: 200,
    json: async () => ({ success: true, data: { tenants: TENANTS, total: 2 } }),
  }));
}

function renderSwitcher() {
  return render(
    <MemoryRouter initialEntries={['/administration']}>
      <AuthProvider>
        <TenantProvider>
          <TenantSwitcher />
        </TenantProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('TenantSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('Super Admin gets All Tenants plus the directory, and switching persists', async () => {
    seedUser(['Super Admin'], 't1');
    renderSwitcher();
    const select = await screen.findByLabelText('Select working tenant scope');
    expect(select).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Tenant One')).toBeInTheDocument();
    });
    fireEvent.change(select, { target: { value: 't2' } });
    expect(sessionStorage.getItem('map_nexus_tenant_scope')).toContain('t2');
  });

  it('Tenant Admin gets a non-switchable label and no tenant options', () => {
    seedUser(['Tenant Admin'], 't1');
    renderSwitcher();
    expect(screen.getByText('Tenant: Current Tenant')).toBeInTheDocument();
    expect(screen.queryByLabelText('Select working tenant scope')).not.toBeInTheDocument();
    expect(screen.queryByText('Tenant One')).not.toBeInTheDocument();
  });
});
