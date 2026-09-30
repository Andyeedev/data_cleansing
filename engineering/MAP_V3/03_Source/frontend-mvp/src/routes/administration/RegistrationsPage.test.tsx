import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { TenantProvider } from '../../tenant/TenantContext';
import { RegistrationsPage } from './RegistrationsPage';

const mockLeads = [
  {
    lead_id: 'lead-1',
    full_name: 'Pending User',
    work_email: 'pending@test.com',
    company: 'Acme',
    org_size: null,
    industry: null,
    role: null,
    source_form: 'get_started',
    created_at: '2026-09-01T10:00:00Z',
    status: 'pending',
    converted_to_tenant: null,
    converted_at: null,
  },
  {
    lead_id: 'lead-2',
    full_name: 'Converted User',
    work_email: 'converted@test.com',
    company: 'Acme',
    org_size: null,
    industry: null,
    role: null,
    source_form: 'get_started',
    created_at: '2026-08-01T10:00:00Z',
    status: 'converted',
    converted_to_tenant: 'tenant-x',
    converted_at: '2026-08-02T10:00:00Z',
  },
];

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

function installFetch(onConvert?: (url: string) => void) {
  global.fetch = vi.fn().mockImplementation((url: unknown, options?: RequestInit) => {
    const u = typeof url === 'string' ? url : String((url as Request)?.url ?? url);
    const method = options?.method ?? 'GET';
    if (u.includes('/admin/registrations') && method === 'GET') {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { leads: mockLeads } }),
      });
    }
    if (u.includes('/convert') && method === 'POST') {
      onConvert?.(u);
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: { tenant_id: 't-new', admin_user_id: 'u-new', admin_email: 'a@b.c', verification_sent: true },
        }),
      });
    }
    return Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true, data: {} }) });
  });
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/administration/registrations']}>
      <AuthProvider>
        <TenantProvider>
          <RegistrationsPage />
        </TenantProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('RegistrationsPage conversion flow (E5)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    seedSuperAdmin();
  });

  it('offers Convert on pending rows, a pill on converted rows, no dead header action', async () => {
    installFetch();
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('pending@test.com')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Convert lead for pending@test.com')).toBeInTheDocument();
    expect(screen.getByText('Converted')).toBeInTheDocument();
    expect(screen.queryByLabelText('Convert lead for converted@test.com')).not.toBeInTheDocument();
    // The dead header action is gone: exactly one Convert control (the row one).
    expect(screen.queryByText('Convert Lead')).not.toBeInTheDocument();
  });

  it('confirms conversion against the row lead id with the entered password', async () => {
    const posted: string[] = [];
    installFetch((url) => posted.push(url));
    renderPage();
    await waitFor(() => {
      expect(screen.getByLabelText('Convert lead for pending@test.com')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText('Convert lead for pending@test.com'));
    const passwordInput = screen.getByLabelText('Admin Password');
    fireEvent.change(passwordInput, { target: { value: 'TempPass123!' } });
    const confirm = screen.getByLabelText('Confirm lead conversion');
    expect(confirm).toBeEnabled();
    fireEvent.click(confirm);
    await waitFor(() => {
      expect(posted.some((u) => u.includes('/admin/registrations/lead-1/convert'))).toBe(true);
    });
    const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
    const convertCall = calls.find(([url, options]) => {
      const u = typeof url === 'string' ? url : '';
      return u.includes('/convert') && (options as RequestInit | undefined)?.method === 'POST';
    });
    expect(JSON.parse(String((convertCall?.[1] as RequestInit)?.body))).toEqual({
      admin_password: 'TempPass123!',
    });
  });

  it('surfaces backend conversion errors', async () => {
    global.fetch = vi.fn().mockImplementation((url: unknown) => {
      const u = typeof url === 'string' ? url : String((url as Request)?.url ?? url);
      if (u.includes('/convert')) {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: async () => ({ detail: 'Tenant creation failed' }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { leads: mockLeads } }),
      });
    });
    renderPage();
    await waitFor(() => {
      expect(screen.getByLabelText('Convert lead for pending@test.com')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText('Convert lead for pending@test.com'));
    fireEvent.change(screen.getByLabelText('Admin Password'), { target: { value: 'TempPass123!' } });
    fireEvent.click(screen.getByLabelText('Confirm lead conversion'));
    await waitFor(() => {
      // Surfaced in both the page-level and modal error displays.
      expect(screen.getAllByText('Tenant creation failed')).toHaveLength(2);
    });
  });
});
