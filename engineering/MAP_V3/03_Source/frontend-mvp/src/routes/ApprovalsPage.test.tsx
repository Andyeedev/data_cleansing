import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApprovalsPage } from './ApprovalsPage';
import { renderWithProviders } from '../test-utils';

const mockApprovals = [
  {
    id: '1',
    title: 'Test Approval 1',
    description: 'Description for approval 1',
    approval_type: 'general',
    priority: 'high',
    status: 'pending',
    assigned_to: 'admin@example.com',
    requested_by: 'user@example.com',
    created_at: '2026-07-20T10:00:00Z',
    decided_at: null,
    comment: null,
  },
  {
    id: '2',
    title: 'Test Approval 2',
    description: 'Description for approval 2',
    approval_type: 'migration',
    priority: 'normal',
    status: 'approved',
    assigned_to: 'admin@example.com',
    requested_by: 'user2@example.com',
    created_at: '2026-07-19T10:00:00Z',
    decided_at: '2026-07-19T12:00:00Z',
    comment: 'Approved for migration',
  },
];

describe('ApprovalsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders loading state initially', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithProviders(<ApprovalsPage />);
    expect(screen.getByText('Approvals')).toBeInTheDocument();
  });

  it('renders approval list after loading', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          approvals: mockApprovals,
          total: 2,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<ApprovalsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Approval 1')).toBeInTheDocument();
      expect(screen.getByText('Test Approval 2')).toBeInTheDocument();
    });
  });

  it('renders empty state when no approvals', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          approvals: [],
          total: 0,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<ApprovalsPage />);

    await waitFor(() => {
      expect(screen.getByText('No approvals found')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('HTTP 500'));

    renderWithProviders(<ApprovalsPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('displays status badges correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          approvals: [mockApprovals[0]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<ApprovalsPage />);

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  it('displays priority badges correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          approvals: [mockApprovals[0]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<ApprovalsPage />);

    await waitFor(() => {
      expect(screen.getByText('High')).toBeInTheDocument();
    });
  });

  it('opens create approval modal on button click', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          approvals: [],
          total: 0,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<ApprovalsPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create new approval/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /create new approval/i }));

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });
});
