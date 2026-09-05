import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiscoveryPage } from './DiscoveryPage';
import { renderWithProviders } from '../test-utils';

const mockSystems = [
  { system_id: '1', system_name: 'Source DB', system_role: 'SOURCE', database_type: 'POSTGRES', credential_id: 'cred-1' },
  { system_id: '2', system_name: 'Target DB', system_role: 'TARGET', database_type: 'SQLSERVER', credential_id: 'cred-2' },
];

describe('DiscoveryPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches systems on mount', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockSystems }),
    });
    renderWithProviders(<DiscoveryPage />);
    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0]).toContain('/api/v1/systems');
    });
  });

  it('displays system roles correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockSystems }),
    });
    renderWithProviders(<DiscoveryPage />);
    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
      expect(screen.getByText('Target DB')).toBeInTheDocument();
    });
  });

  it('start discovery triggers execution API', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockSystems }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Migration execution triggered',
          batch_id: 'batch-123',
          project_id: 'default',
          status_url: '/execution/status/batch-123',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          batch_id: 'batch-123',
          status: 'RUNNING',
          total_controls: 5,
          completed_controls: 0,
          failed_controls: 0,
          progress: '0/5',
        }),
      });

    renderWithProviders(<DiscoveryPage />);
    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Start Discovery'));

    await waitFor(() => {
      expect(screen.getByText('Discovery Running...')).toBeInTheDocument();
    });
  });

  it('shows empty state when no systems registered', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });
    renderWithProviders(<DiscoveryPage />);
    await waitFor(() => {
      expect(screen.getByText(/No systems registered/)).toBeInTheDocument();
    });
  });
});
