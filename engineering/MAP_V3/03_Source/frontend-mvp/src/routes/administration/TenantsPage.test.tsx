import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { TenantProvider } from '../../tenant/TenantContext';
import { TenantsPage } from './TenantsPage';

const mockTenants = [
  { tenant_id: 't1', tenant_name: 'Tenant One', status: 'ACTIVE', plan_id: 'p1', billing_email: null, max_users: 5, max_projects: 3, max_connections: 5, created_at: '' },
  { tenant_id: 't2', tenant_name: 'Tenant Two', status: 'SUSPENDED', plan_id: 'p1', billing_email: null, max_users: 5, max_projects: 3, max_connections: 5, created_at: '' },
  { tenant_id: 't3', tenant_name: 'Tenant Three', status: 'BLOCKED', plan_id: 'p1', billing_email: null, max_users: 5, max_projects: 3, max_connections: 5, created_at: '' },
];

const mockPlans = [{ plan_id: 'p1', name: 'Professional', tier: 'professional' }];

function seedSuperAdmin() {
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem(
    'map_nexus_user',
    JSON.stringify({
      id: '1',
      email: 'admin@test.com',
      name: 'admin',
      roles: ['Super Admin'],
      permissions: [],
      tenantId: 'tenant-a',
    }),
  );
}

function installFetch() {
  global.fetch = vi.fn().mockImplementation((url: unknown, options?: RequestInit) => {
    const u = typeof url === 'string' ? url : String((url as Request)?.url ?? url);
    const method = options?.method ?? 'GET';
    if (u.includes('/tenants/plans')) {
      return Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true, data: mockPlans }) });
    }
    if (u.includes('/tenants') && method === 'POST') {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { tenant: { tenant_id: 't-new' } } }),
      });
    }
    if (u.includes('/tenants/') && method === 'PUT') {
      return Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true, data: {} }) });
    }
    if (u.includes('/tenants')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { tenants: mockTenants, total: 3 } }),
      });
    }
    return Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true, data: {} }) });
  });
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/administration/tenants']}>
      <AuthProvider>
        <TenantProvider>
          <TenantsPage />
        </TenantProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('TenantsPage management affordances (E6)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    seedSuperAdmin();
    installFetch();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('renders the directory with per-status actions', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Tenant One')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Create new tenant')).toBeInTheDocument();
    expect(screen.getByLabelText('Suspend tenant Tenant One')).toBeInTheDocument();
    expect(screen.getByLabelText('Activate tenant Tenant Two')).toBeInTheDocument();
    // BLOCKED tenants get no lifecycle action.
    expect(screen.queryByLabelText(/tenant Tenant Three/)).not.toBeInTheDocument();
  });

  it('creates a tenant through the modal against the existing endpoint', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Tenant One')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText('Create new tenant'));
    fireEvent.change(screen.getByLabelText('Tenant name'), { target: { value: 'Tenant New' } });
    fireEvent.change(screen.getByLabelText('Admin email'), { target: { value: 'admin@new.test' } });
    fireEvent.change(screen.getByLabelText('Admin password'), { target: { value: 'TempPass123!' } });
    const confirm = screen.getByLabelText('Confirm tenant creation');
    expect(confirm).toBeEnabled();
    fireEvent.click(confirm);
    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls as Array<[unknown, RequestInit?]>;
      const posts = calls.filter(([url, options]) => {
        const u = typeof url === 'string' ? url : '';
        return u.endsWith('/tenants') && options?.method === 'POST';
      });
      expect(posts.length).toBeGreaterThan(0);
    });
    const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls as Array<[unknown, RequestInit?]>;
    const body = JSON.parse(String(calls.map(([, options]) => options?.body).find(Boolean)));
    expect(body).toMatchObject({ tenant_name: 'Tenant New', admin_email: 'admin@new.test' });
  });

  it('suspends an active tenant through the existing endpoint', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Tenant One')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText('Suspend tenant Tenant One'));
    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls as Array<[unknown, RequestInit?]>;
      const puts = calls.filter(([url, options]) => {
        const u = typeof url === 'string' ? url : '';
        return u.includes('/tenants/t1') && options?.method === 'PUT';
      });
      expect(puts.length).toBeGreaterThan(0);
    });
    const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls as Array<[unknown, RequestInit?]>;
    const bodies = calls
      .map(([, options]) => options?.body)
      .filter(Boolean)
      .map((b) => JSON.parse(String(b)));
    expect(bodies).toContainEqual({ status: 'SUSPENDED' });
  });

  it('scoped view filters to the selected tenant with a scoped label', async () => {
    sessionStorage.setItem('map_nexus_tenant_scope', JSON.stringify({ kind: 'tenant', tenantId: 't2' }));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Tenant Two')).toBeInTheDocument();
    });
    expect(screen.queryByText('Tenant One')).not.toBeInTheDocument();
    expect(screen.getByText(/Scoped view/)).toBeInTheDocument();
  });
});
