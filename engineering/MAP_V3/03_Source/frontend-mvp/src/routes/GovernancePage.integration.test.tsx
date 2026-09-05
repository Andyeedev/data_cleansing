import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GovernancePage } from './GovernancePage';
import { renderWithProviders } from '../test-utils';

const mockAuditEntries = [
  {
    id: '1',
    action: 'CREATE',
    entity_type: 'migration_batch',
    entity_id: 'batch-001',
    user_email: 'admin@test.com',
    timestamp: '2026-07-20T10:00:00Z',
    details: {},
  },
  {
    id: '2',
    action: 'UPDATE',
    entity_type: 'system',
    entity_id: 'sys-001',
    user_email: 'admin@test.com',
    timestamp: '2026-07-20T11:00:00Z',
    details: {},
  },
];

const mockApprovals = [
  {
    id: '1',
    entity_type: 'migration_batch',
    entity_id: 'batch-002',
    status: 'PENDING',
    requested_by: 'user@test.com',
    created_at: '2026-07-20T09:00:00Z',
  },
];

const mockCompliance = {
  score: 85.5,
  total_controls: 100,
  passed_controls: 85,
  failed_controls: 15,
};

describe('GovernancePage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { score: null, total_controls: 0, passed_controls: 0, failed_controls: 0 } }),
    });
  });

  it('fetches compliance data when overview tab is active', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/v1/governance/compliance')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockCompliance }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: { score: null, total_controls: 0, passed_controls: 0, failed_controls: 0 } }),
      });
    });

    renderWithProviders(<GovernancePage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/governance/compliance'),
        expect.anything()
      );
    });
  });

  it('fetches audit entries when audit tab is selected', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/v1/governance/audit')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { entries: mockAuditEntries, total: 2 } }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: { score: null, total_controls: 0, passed_controls: 0, failed_controls: 0 } }),
      });
    });

    renderWithProviders(<GovernancePage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /audit/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: /audit/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/governance/audit'),
        expect.anything()
      );
    });
  });

  it('displays audit entries with correct data', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/v1/governance/audit')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { entries: mockAuditEntries, total: 2 } }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: { score: null, total_controls: 0, passed_controls: 0, failed_controls: 0 } }),
      });
    });

    renderWithProviders(<GovernancePage />, { initialRole: 'admin' });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('tab', { name: /audit/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('CREATE')).toBeInTheDocument();
      expect(screen.getByText('migration_batch')).toBeInTheDocument();
    });
  });

  it('fetches approvals when approvals tab is selected', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/v1/governance/approvals')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { pending: mockApprovals, total: 1 } }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: { score: null, total_controls: 0, passed_controls: 0, failed_controls: 0 } }),
      });
    });

    renderWithProviders(<GovernancePage />, { initialRole: 'admin' });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('tab', { name: /approvals/i }));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/governance/approvals'),
        expect.anything()
      );
    });
  });

  it('displays pending approvals', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/v1/governance/approvals')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { pending: mockApprovals, total: 1 } }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: { score: null, total_controls: 0, passed_controls: 0, failed_controls: 0 } }),
      });
    });

    renderWithProviders(<GovernancePage />, { initialRole: 'admin' });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('tab', { name: /approvals/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('batch-002')).toBeInTheDocument();
      expect(screen.getByText('PENDING')).toBeInTheDocument();
    });
  });

  it('audit search filters entries', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/v1/governance/audit')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { entries: mockAuditEntries, total: 2 } }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: { score: null, total_controls: 0, passed_controls: 0, failed_controls: 0 } }),
      });
    });

    renderWithProviders(<GovernancePage />, { initialRole: 'admin' });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('tab', { name: /audit/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('CREATE')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search audit logs...');
    fireEvent.change(searchInput, { target: { value: 'migration' } });

    await waitFor(() => {
      expect(screen.getByText('migration_batch')).toBeInTheDocument();
    });
  });

  it('shows permission error for viewer role', async () => {
    renderWithProviders(<GovernancePage />, { initialRole: 'viewer' });

    await waitFor(() => {
      expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
    });
  });

  it('all 7 tabs are accessible', async () => {
    renderWithProviders(<GovernancePage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /overview/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /compliance/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /controls/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /exceptions/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /risk/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /audit/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /approvals/i })).toBeInTheDocument();
    });
  });
});
