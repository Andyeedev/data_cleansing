import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkflowsPage } from './WorkflowsPage';
import { renderWithProviders } from '../test-utils';

const mockWorkflows = [
  {
    id: '1',
    name: 'Test Workflow 1',
    description: 'Description for workflow 1',
    type: 'custom',
    status: 'active',
    steps: [{ id: 'step1', type: 'action', config: {} }],
    created_at: '2026-07-20T10:00:00Z',
    updated_at: '2026-07-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'Test Workflow 2',
    description: 'Description for workflow 2',
    type: 'migration',
    status: 'completed',
    steps: [],
    created_at: '2026-07-19T10:00:00Z',
    updated_at: '2026-07-19T10:00:00Z',
  },
];

describe('WorkflowsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches workflows on mount', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          workflows: mockWorkflows,
          total: 2,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<WorkflowsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0]).toContain('/api/v1/workflows');
    });
  });

  it('type filter updates displayed workflows', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          workflows: [mockWorkflows[0]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<WorkflowsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Test Workflow 1')).toBeInTheDocument();
    });

    const typeFilter = screen.getByDisplayValue('All Types');
    fireEvent.change(typeFilter, { target: { value: 'custom' } });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toContain('type=custom');
    });
  });

  it('status filter updates displayed workflows', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          workflows: [mockWorkflows[0]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<WorkflowsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Test Workflow 1')).toBeInTheDocument();
    });

    const statusFilter = screen.getByDisplayValue('All Status');
    fireEvent.change(statusFilter, { target: { value: 'active' } });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toContain('status=active');
    });
  });

  it('create workflow modal opens and closes', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          workflows: [],
          total: 0,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<WorkflowsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Create Workflow')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Create Workflow'));

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });

  it('create workflow form validates required fields', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          workflows: [],
          total: 0,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<WorkflowsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Create Workflow')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Create Workflow'));

    await waitFor(() => {
      expect(screen.getByText('Create')).toBeInTheDocument();
    });

    const createButton = screen.getByText('Create');
    expect(createButton).toBeDisabled();
  });
});
