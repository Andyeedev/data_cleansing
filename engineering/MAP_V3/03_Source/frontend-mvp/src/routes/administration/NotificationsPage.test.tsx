import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { TenantProvider } from '../../tenant/TenantContext';
import { NotificationsPage } from './NotificationsPage';

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
    <MemoryRouter initialEntries={['/administration/notifications']}>
      <AuthProvider>
        <TenantProvider>
          <Routes>
            <Route path="/administration/notifications" element={<NotificationsPage />} />
            <Route path="/notifications" element={<div>User preferences page</div>} />
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('NotificationsPage overview (E11)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    seedSuperAdmin();
    installFetch();
  });

  it('renders the health overview from the live endpoint', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
    expect(screen.getAllByText('Operational')).toHaveLength(2);
    expect(screen.getByText('Armed')).toBeInTheDocument();
  });

  it('links to the existing user notification preferences', async () => {
    renderPage();
    const link = await screen.findByLabelText('Open notification preferences');
    expect(link).toHaveAttribute('href', '/notifications');
  });

  it('does not wire the stub alerts endpoint as live data', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
    const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls as Array<[unknown]>;
    const urls = calls.map(([url]) => (typeof url === 'string' ? url : ''));
    expect(urls.some((u) => u.includes('/monitoring/alerts'))).toBe(false);
    expect(screen.queryByText(/alerts received|active alerts/i)).not.toBeInTheDocument();
  });
});
