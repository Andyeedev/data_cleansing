import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsPage } from './SettingsPage';
import { renderWithProviders } from '../test-utils';

const mockSettings = [
  {
    id: '1',
    category: 'general',
    key: 'site_name',
    value: 'MAP Nexus',
    description: 'Site name',
    data_type: 'string',
    is_readonly: false,
    tenant_scoped: false,
    updated_at: '2026-07-20T10:00:00Z',
  },
  {
    id: '2',
    category: 'general',
    key: 'max_upload_size',
    value: 100,
    description: 'Max upload size in MB',
    data_type: 'number',
    is_readonly: true,
    tenant_scoped: false,
    updated_at: '2026-07-20T10:00:00Z',
  },
];

const mockFlags = [
  {
    id: '1',
    name: 'New UI',
    description: 'Enable new UI',
    key: 'new_ui',
    enabled: true,
    rollout_percentage: 50,
    status: 'active',
    created_at: '2026-07-20T10:00:00Z',
  },
];

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<SettingsPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders tabs correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    renderWithProviders(<SettingsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('System Settings')).toBeInTheDocument();
      expect(screen.getByText('Feature Flags')).toBeInTheDocument();
    });
  });

  it('renders settings list after loading', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockSettings }),
    });

    renderWithProviders(<SettingsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('site_name')).toBeInTheDocument();
      expect(screen.getByText('max_upload_size')).toBeInTheDocument();
    });
  });

  it('renders empty state when no settings', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    renderWithProviders(<SettingsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('No settings found')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    renderWithProviders(<SettingsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    });
  });

  it('displays read-only badge for readonly settings', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [mockSettings[1]] }),
    });

    renderWithProviders(<SettingsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText(/read-only/)).toBeInTheDocument();
    });
  });

  it('shows category sidebar', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockSettings }),
    });

    renderWithProviders(<SettingsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('All Categories')).toBeInTheDocument();
      expect(screen.getByText('general')).toBeInTheDocument();
    });
  });
});
