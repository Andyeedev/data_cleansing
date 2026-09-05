import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidationPage } from './ValidationPage';
import { renderWithProviders } from '../test-utils';

const mockWorkflows = [
  { id: 'wf-1', name: 'Data Integrity Check', description: null, type: 'validation', status: 'active', steps: [], triggers: [], created_by: null, created_at: '2026-01-01', updated_at: '2026-01-01' },
  { id: 'wf-2', name: 'Schema Validation', description: null, type: 'validation', status: 'draft', steps: [], triggers: [], created_by: null, created_at: '2026-01-01', updated_at: '2026-01-01' },
];

describe('ValidationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<ValidationPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders page title and description', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { workflows: [], total: 0, page: 1, page_size: 10 } }),
    });
    renderWithProviders(<ValidationPage />);
    expect(screen.getByText('Validation')).toBeInTheDocument();
    expect(screen.getByText(/pre-migration validation/)).toBeInTheDocument();
  });

  it('renders start validation button', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { workflows: [], total: 0, page: 1, page_size: 10 } }),
    });
    renderWithProviders(<ValidationPage />);
    await waitFor(() => {
      expect(screen.getByText('Start Validation')).toBeInTheDocument();
    });
  });

  it('renders project ID input field', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { workflows: [], total: 0, page: 1, page_size: 10 } }),
    });
    renderWithProviders(<ValidationPage />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter project ID/)).toBeInTheDocument();
    });
  });

  it('renders workflow list after loading', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { workflows: mockWorkflows, total: 2, page: 1, page_size: 10 } }),
    });
    renderWithProviders(<ValidationPage />);
    await waitFor(() => {
      expect(screen.getByText('Data Integrity Check')).toBeInTheDocument();
      expect(screen.getByText('Schema Validation')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('HTTP 500'));
    renderWithProviders(<ValidationPage />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
