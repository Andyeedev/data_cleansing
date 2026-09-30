import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { TenantProvider } from '../../tenant/TenantContext';
import { SecurityPage } from './SecurityPage';

function seedSuperAdmin() {
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
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/administration/security']}>
      <AuthProvider>
        <TenantProvider>
          <SecurityPage />
        </TenantProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('SecurityPage password change (E10)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    seedSuperAdmin();
    global.fetch = vi.fn().mockImplementation(() => ({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { message: 'Password changed successfully' } }),
    }));
  });

  it('renders the readout and the password form', () => {
    renderPage();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByLabelText('Current password')).toBeInTheDocument();
    expect(screen.getByLabelText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm new password')).toBeInTheDocument();
  });

  it('blocks mismatched passwords client-side without calling the API', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('Current password'), { target: { value: 'OldPass123!' } });
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'NewPass123!' } });
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'OtherPass123!' } });
    expect(screen.getByText('New passwords do not match.')).toBeInTheDocument();
    expect(screen.getByLabelText('Change own password')).toBeDisabled();
    expect(global.fetch as ReturnType<typeof vi.fn>).not.toHaveBeenCalled();
  });

  it('posts current and new passwords to the existing capability', async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('Current password'), { target: { value: 'OldPass123!' } });
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'NewPass123!' } });
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'NewPass123!' } });
    const submit = screen.getByLabelText('Change own password');
    expect(submit).toBeEnabled();
    fireEvent.click(submit);
    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls as Array<[unknown, RequestInit?]>;
      const posts = calls.filter(([url, options]) => {
        const u = typeof url === 'string' ? url : '';
        return u.includes('/auth/change-password') && options?.method === 'POST';
      });
      expect(posts.length).toBeGreaterThan(0);
    });
    const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls as Array<[unknown, RequestInit?]>;
    const body = JSON.parse(String(calls.map(([, options]) => options?.body).find(Boolean)));
    expect(body).toEqual({ current_password: 'OldPass123!', new_password: 'NewPass123!' });
    await waitFor(() => {
      expect(screen.getByText('Password changed successfully.')).toBeInTheDocument();
    });
  });

  it('surfaces backend errors', async () => {
    global.fetch = vi.fn().mockImplementation(() => ({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: { get: () => null },
      json: async () => ({ detail: 'Current password is incorrect' }),
    }));
    renderPage();
    fireEvent.change(screen.getByLabelText('Current password'), { target: { value: 'WrongPass123!' } });
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'NewPass123!' } });
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'NewPass123!' } });
    fireEvent.click(screen.getByLabelText('Change own password'));
    await waitFor(() => {
      expect(screen.getByText('Current password is incorrect')).toBeInTheDocument();
    });
  });
});
