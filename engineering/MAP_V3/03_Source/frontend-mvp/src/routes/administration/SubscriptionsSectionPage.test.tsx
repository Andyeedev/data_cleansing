import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { SubscriptionsSectionPage } from './SubscriptionsSectionPage';

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

function renderSubscriptions() {
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem(
    'map_nexus_user',
    JSON.stringify({
      id: '1',
      email: 'admin@test.com',
      name: 'admin',
      roles: ['Super Admin'],
      permissions: ['users:list'],
    }),
  );
  global.fetch = vi.fn().mockImplementation(() => ({
    ok: true,
    status: 200,
    json: async () => ({ success: true, data: { subscription: SUBSCRIPTION } }),
  }));
  return render(
    <MemoryRouter initialEntries={['/administration/subscriptions']}>
      <AuthProvider>
        <SubscriptionsSectionPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('SubscriptionsSectionPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the real plan summary from the existing subscription hook', async () => {
    renderSubscriptions();
    await waitFor(() => {
      expect(screen.getByText('Subscriptions')).toBeInTheDocument();
    });
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
    expect(screen.getByText('Open Billing')).toBeInTheDocument();
  });
});
