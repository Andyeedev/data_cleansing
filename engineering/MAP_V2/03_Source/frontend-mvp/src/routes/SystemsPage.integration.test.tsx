import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SystemsPage } from './SystemsPage';
import { renderWithProviders } from '../test-utils';

vi.mock('../components/shared/TenantFilter', () => ({
  TenantFilter: ({ selectedTenant, onChange }: { selectedTenant: string; onChange: (v: string) => void }) => (
    <select data-testid="tenant-filter" value={selectedTenant} onChange={(e) => onChange(e.target.value)}>
      <option value="">All Tenants</option>
      <option value="tenant-1">Test Tenant</option>
    </select>
  ),
}));

const mockSystems = [
  {
    system_id: '1',
    system_name: 'Source DB',
    system_role: 'SOURCE',
    database_type: 'POSTGRES',
    credential_id: 'cred-1',
  },
  {
    system_id: '2',
    system_name: 'Target DB',
    system_role: 'TARGET',
    database_type: 'SQLSERVER',
    credential_id: 'cred-2',
  },
];

describe('SystemsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches systems on mount', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSystems,
      }),
    });

    renderWithProviders(<SystemsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(2);
      expect(calls.some((c: unknown[]) => String(c[0]).includes('/api/v1/systems'))).toBe(true);
    });
  });

  it('role filter updates displayed systems', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSystems,
      }),
    });

    renderWithProviders(<SystemsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
    });

    const roleFilter = screen.getByDisplayValue('All Roles');
    fireEvent.change(roleFilter, { target: { value: 'SOURCE' } });

    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
      expect(screen.queryByText('Target DB')).not.toBeInTheDocument();
    });
  });

  it('database type filter updates displayed systems', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSystems,
      }),
    });

    renderWithProviders(<SystemsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
    });

    const dbTypeFilter = screen.getByDisplayValue('All Database Types');
    fireEvent.change(dbTypeFilter, { target: { value: 'POSTGRES' } });

    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
      expect(screen.queryByText('Target DB')).not.toBeInTheDocument();
    });
  });

  it('test connection button triggers API call', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { total_systems: 2, healthy_systems: 2, unhealthy_systems: 0, overall_health_percent: 100 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockSystems,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { status: 'success', message: 'Source DB connected', latency_ms: 12 },
        }),
      });

    renderWithProviders(<SystemsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
    });

    const testButtons = screen.getAllByRole('button', { name: /Test/i });
    fireEvent.click(testButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Source DB connected')).toBeInTheDocument();
    });
  });
});
