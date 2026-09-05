import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GovernancePage } from './GovernancePage';
import { renderWithProviders } from '../test-utils';

describe('GovernancePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { score: null, total_controls: 0, passed_controls: 0, failed_controls: 0 } }),
    });
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<GovernancePage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders page title and description', async () => {
    renderWithProviders(<GovernancePage />);
    await waitFor(() => {
      expect(screen.getByText('Governance')).toBeInTheDocument();
    });
    expect(screen.getByText(/Compliance, risk scoring/)).toBeInTheDocument();
  });

  it('renders all tabs', async () => {
    renderWithProviders(<GovernancePage />);
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

  it('renders overview tab by default', async () => {
    renderWithProviders(<GovernancePage />);
    await waitFor(() => {
      expect(screen.getByText('Compliance Score')).toBeInTheDocument();
      expect(screen.getByText('Total Controls')).toBeInTheDocument();
    });
  });

  it('renders compliance tab content', async () => {
    renderWithProviders(<GovernancePage />);
    await waitFor(() => {
      screen.getByRole('tab', { name: /compliance/i }).click();
    });
    await waitFor(() => {
      expect(screen.getByText('Compliance Status')).toBeInTheDocument();
    });
  });

  it('renders audit tab content', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { entries: [], total: 0 } }),
    });
    renderWithProviders(<GovernancePage />);
    await waitFor(() => {
      screen.getByRole('tab', { name: /audit/i }).click();
    });
    await waitFor(() => {
      expect(screen.getByText('No audit entries found.')).toBeInTheDocument();
    });
  });
});
