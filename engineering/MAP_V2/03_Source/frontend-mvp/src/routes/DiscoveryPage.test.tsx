import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiscoveryPage } from './DiscoveryPage';
import { renderWithProviders } from '../test-utils';

const mockSystems = [
  { system_id: '1', system_name: 'Source DB', system_role: 'SOURCE', database_type: 'POSTGRES', credential_id: 'cred-1' },
  { system_id: '2', system_name: 'Target DB', system_role: 'TARGET', database_type: 'SQLSERVER', credential_id: 'cred-2' },
];

describe('DiscoveryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<DiscoveryPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<DiscoveryPage />);
    expect(screen.getByText('Discovery')).toBeInTheDocument();
  });

  it('renders systems list after loading', async () => {
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

  it('renders empty state when no systems', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });
    renderWithProviders(<DiscoveryPage />);
    await waitFor(() => {
      expect(screen.getByText(/No systems registered/)).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    renderWithProviders(<DiscoveryPage />);
    await waitFor(() => {
      expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    });
  });

  it('displays start discovery button', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockSystems }),
    });
    renderWithProviders(<DiscoveryPage />);
    await waitFor(() => {
      expect(screen.getByText('Start Discovery')).toBeInTheDocument();
    });
  });
});
