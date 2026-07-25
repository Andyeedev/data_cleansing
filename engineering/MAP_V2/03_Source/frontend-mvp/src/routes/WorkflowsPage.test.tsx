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

describe('WorkflowsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<WorkflowsPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithProviders(<WorkflowsPage />, { initialRole: 'admin' });
    expect(screen.getByText('Workflow Management')).toBeInTheDocument();
  });

  it('renders workflow list after loading', async () => {
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
      expect(screen.getByText('Test Workflow 1')).toBeInTheDocument();
      expect(screen.getByText('Test Workflow 2')).toBeInTheDocument();
    });
  });

  it('renders empty state when no workflows', async () => {
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
      expect(screen.getByText('No workflows found')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    renderWithProviders(<WorkflowsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    });
  });

  it('displays status badges correctly', async () => {
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
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  it('opens create workflow modal on button click', async () => {
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
  });
});
