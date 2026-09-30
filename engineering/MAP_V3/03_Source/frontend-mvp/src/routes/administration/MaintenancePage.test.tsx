import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { TenantProvider } from '../../tenant/TenantContext';
import { MaintenancePage } from './MaintenancePage';

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
    }),
  );
}

function installFetch() {
  global.fetch = vi.fn().mockImplementation(() => ({
    ok: true,
    status: 200,
    json: async () => ({ success: true, data: { database: true, api: true, timestamp: null } }),
  }));
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/administration/maintenance']}>
      <AuthProvider>
        <TenantProvider>
          <Routes>
            <Route path="/administration/maintenance" element={<MaintenancePage />} />
            <Route path="/migration/connections/diagnostics" element={<div>Diagnostics page</div>} />
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('MaintenancePage runbook (E12)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    seedSuperAdmin();
    installFetch();
  });

  it('renders health overview from the live endpoint', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
    });
    expect(screen.getAllByText('Operational')).toHaveLength(2);
    expect(screen.getByText('Maintenance runbook')).toBeInTheDocument();
  });

  it('links to the existing connection diagnostics', async () => {
    renderPage();
    const link = await screen.findByLabelText('Open connection diagnostics');
    expect(link).toHaveAttribute('href', '/migration/connections/diagnostics');
  });
});
