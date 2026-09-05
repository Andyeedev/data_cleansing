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

describe('ApprovalsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches approvals on mount', async () => {
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
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0]).toContain('/api/v1/approvals');
    });
  });

  it('status filter updates displayed approvals', async () => {
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
      expect(screen.getByText('Test Approval 1')).toBeInTheDocument();
    });

    const statusFilter = screen.getByDisplayValue('All Status');
    fireEvent.change(statusFilter, { target: { value: 'pending' } });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toContain('status=pending');
    });
  });

  it('assigned to filter updates displayed approvals', async () => {
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
    });

    const assignedToFilter = screen.getByPlaceholderText('Assigned To (email)');
    fireEvent.change(assignedToFilter, { target: { value: 'admin@example.com' } });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toContain('assigned_to=admin%40example.com');
    });
  });

  it('create approval modal opens and closes', async () => {
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
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });
  });

  it('create approval form validates required fields', async () => {
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
      expect(screen.getByRole('button', { name: /^create$/i })).toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /^create$/i });
    expect(createButton).toBeDisabled();
  });

  it('view button links to detail page', async () => {
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
      expect(screen.getByText('Test Approval 1')).toBeInTheDocument();
    });

    const viewLink = screen.getByText('View');
    expect(viewLink.closest('a')).toHaveAttribute('href', '/approvals/1');
  });
});
