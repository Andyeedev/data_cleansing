import { screen, waitFor, fireEvent } from '@testing-library/react';
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
    category: 'security',
    key: 'session_timeout',
    value: 30,
    description: 'Session timeout in minutes',
    data_type: 'number',
    is_readonly: false,
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

describe('SettingsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches settings on mount', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockSettings }),
    });

    renderWithProviders(<SettingsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/settings')
      );
    });
  });

  it('category filter updates displayed settings', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockSettings }),
    });

    renderWithProviders(<SettingsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('general')).toBeInTheDocument();
      expect(screen.getByText('security')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('security'));

    await waitFor(() => {
      expect(screen.getByText('session_timeout')).toBeInTheDocument();
      expect(screen.queryByText('site_name')).not.toBeInTheDocument();
    });
  });

  it('switches to feature flags tab', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockFlags }),
    });

    renderWithProviders(<SettingsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Feature Flags')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Feature Flags'));

    await waitFor(() => {
      expect(screen.getByText('New UI')).toBeInTheDocument();
      expect(screen.getByText(/new_ui/)).toBeInTheDocument();
    });
  });

  it('feature flag shows enabled status', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockFlags }),
    });

    renderWithProviders(<SettingsPage />, { initialRole: 'admin' });

    fireEvent.click(screen.getByText('Feature Flags'));

    await waitFor(() => {
      expect(screen.getByText('Enabled')).toBeInTheDocument();
    });
  });

  it('feature flag shows rollout percentage', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockFlags }),
    });

    renderWithProviders(<SettingsPage />, { initialRole: 'admin' });

    fireEvent.click(screen.getByText('Feature Flags'));

    await waitFor(() => {
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });
});
