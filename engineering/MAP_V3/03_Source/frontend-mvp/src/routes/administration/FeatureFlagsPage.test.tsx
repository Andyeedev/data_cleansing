import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { TenantProvider } from '../../tenant/TenantContext';
import { FeatureFlagsPage } from './FeatureFlagsPage';

const mockFlags = [
  { key: 'flag_a', name: 'Flag A', description: null, enabled: true, rollout_percentage: 50, status: 'active' },
  { key: 'flag_b', name: 'Flag B', description: null, enabled: false, rollout_percentage: 0, status: 'active' },
];

function seedUser(roles: string[], permissions: string[]) {
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem(
    'map_nexus_user',
    JSON.stringify({ id: '1', email: 'admin@test.com', name: 'admin', roles, permissions }),
  );
}

function installFetch() {
  global.fetch = vi.fn().mockImplementation(() => ({
    ok: true,
    status: 200,
    json: async () => ({ success: true, data: mockFlags }),
  }));
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/administration/feature-flags']}>
      <AuthProvider>
        <TenantProvider>
          <FeatureFlagsPage />
        </TenantProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('FeatureFlagsPage toggle gating (E9)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    seedUser(['Super Admin'], ['settings:update']);
    installFetch();
  });

  it('lists flags with KPIs', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Flag A')).toBeInTheDocument();
    });
    expect(screen.getByText('Flag B')).toBeInTheDocument();
  });

  it('enables toggles with settings:update', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByLabelText('Toggle feature flag flag_a')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Toggle feature flag flag_a')).toBeEnabled();
    expect(screen.getByLabelText('Toggle feature flag flag_b')).toBeEnabled();
  });

  it('disables toggles without settings:update', async () => {
    seedUser(['Tenant Admin'], ['settings:read']);
    renderPage();
    await waitFor(() => {
      expect(screen.getByLabelText('Toggle feature flag flag_a')).toBeInTheDocument();
    });
    const toggle = screen.getByLabelText('Toggle feature flag flag_a');
    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAttribute('title', 'Requires settings:update');
  });
});
