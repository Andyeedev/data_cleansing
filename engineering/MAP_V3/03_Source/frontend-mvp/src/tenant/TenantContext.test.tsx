import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { TenantProvider, useTenantScope } from './TenantContext';

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
}

function Probe() {
  const ctx = useTenantScope();
  return (
    <div>
      <span data-testid="scope">{JSON.stringify(ctx.scope)}</span>
      <span data-testid="locked">{String(ctx.isLocked)}</span>
      <span data-testid="scope-tenant">{ctx.scopeTenantId ?? 'none'}</span>
      <button onClick={() => ctx.setScopeTenant('tenant-x')}>scope-x</button>
      <button onClick={() => ctx.setScopeAll()}>scope-all</button>
    </div>
  );
}

function renderScope() {
  return render(
    <MemoryRouter initialEntries={['/administration']}>
      <AuthProvider>
        <TenantProvider>
          <Probe />
        </TenantProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('TenantContext working scope', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('Super Admin defaults to All Tenants', () => {
    seedUser(['Super Admin'], 'tenant-a');
    renderScope();
    expect(screen.getByTestId('scope')).toHaveTextContent('{"kind":"all"}');
    expect(screen.getByTestId('locked')).toHaveTextContent('false');
    expect(screen.getByTestId('scope-tenant')).toHaveTextContent('none');
  });

  it('Super Admin restores a stored scoped tenant', () => {
    seedUser(['Super Admin'], 'tenant-a');
    sessionStorage.setItem('map_nexus_tenant_scope', JSON.stringify({ kind: 'tenant', tenantId: 'tenant-b' }));
    renderScope();
    expect(screen.getByTestId('scope-tenant')).toHaveTextContent('tenant-b');
  });

  it('switching scope persists to sessionStorage and never mutates roles', () => {
    seedUser(['Super Admin'], 'tenant-a');
    const { unmount } = renderScope();
    fireEvent.click(screen.getByText('scope-x'));
    expect(screen.getByTestId('scope-tenant')).toHaveTextContent('tenant-x');
    expect(sessionStorage.getItem('map_nexus_tenant_scope')).toContain('tenant-x');
    const stored = JSON.parse(localStorage.getItem('map_nexus_user') ?? '{}');
    expect(stored.roles).toEqual(['Super Admin']);
    fireEvent.click(screen.getByText('scope-all'));
    expect(screen.getByTestId('scope')).toHaveTextContent('{"kind":"all"}');
    expect(sessionStorage.getItem('map_nexus_tenant_scope')).toBeNull();
    unmount();
  });

  it('Tenant Admin is locked to its own tenant and ignores scope changes', () => {
    seedUser(['Tenant Admin'], 'tenant-a');
    sessionStorage.setItem('map_nexus_tenant_scope', JSON.stringify({ kind: 'tenant', tenantId: 'tenant-evil' }));
    renderScope();
    expect(screen.getByTestId('locked')).toHaveTextContent('true');
    expect(screen.getByTestId('scope-tenant')).toHaveTextContent('tenant-a');
    fireEvent.click(screen.getByText('scope-x'));
    expect(screen.getByTestId('scope-tenant')).toHaveTextContent('tenant-a');
    fireEvent.click(screen.getByText('scope-all'));
    expect(screen.getByTestId('scope-tenant')).toHaveTextContent('tenant-a');
  });

  it('falls back to All Tenants on corrupt storage', () => {
    seedUser(['Super Admin'], 'tenant-a');
    sessionStorage.setItem('map_nexus_tenant_scope', 'not-json{{{');
    renderScope();
    expect(screen.getByTestId('scope')).toHaveTextContent('{"kind":"all"}');
  });

  it('viewer without a tenant resolves to the safe default', async () => {
    seedUser(['Viewer'], null);
    renderScope();
    await waitFor(() => {
      expect(screen.getByTestId('locked')).toHaveTextContent('true');
    });
  });
});
