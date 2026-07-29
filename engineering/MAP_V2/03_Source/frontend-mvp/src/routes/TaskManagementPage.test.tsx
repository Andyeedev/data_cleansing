import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskManagementPage } from './TaskManagementPage';
import { renderWithProviders } from '../test-utils';

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description for task 1',
    status: 'pending',
    priority: 'high',
    type: 'task',
    assigned_to: 'user1',
    assigned_by: 'admin',
    parent_task_id: null,
    due_date: '2026-08-01',
    estimated_hours: 8,
    actual_hours: null,
    completion_percentage: 0,
    tags: [],
    created_at: '2026-07-20T10:00:00Z',
    updated_at: '2026-07-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Description for task 2',
    status: 'in_progress',
    priority: 'medium',
    type: 'task',
    assigned_to: null,
    assigned_by: 'admin',
    parent_task_id: null,
    due_date: null,
    estimated_hours: null,
    actual_hours: null,
    completion_percentage: 50,
    tags: [],
    created_at: '2026-07-19T10:00:00Z',
    updated_at: '2026-07-19T10:00:00Z',
  },
];

describe('TaskManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<TaskManagementPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithProviders(<TaskManagementPage />, { initialRole: 'admin' });
    expect(screen.getByText('Task Management')).toBeInTheDocument();
  });

  it('renders task list after loading', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          tasks: mockTasks,
          total: 2,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<TaskManagementPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  it('renders empty state when no tasks', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          tasks: [],
          total: 0,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<TaskManagementPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('HTTP 500'));

    renderWithProviders(<TaskManagementPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('displays priority badges correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          tasks: [mockTasks[0]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<TaskManagementPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('high')).toBeInTheDocument();
    });
  });

  it('displays status badges correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          tasks: [mockTasks[0]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<TaskManagementPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  it('shows "—" for tasks without assigned user or due date', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          tasks: [mockTasks[1]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<TaskManagementPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2);
    });
  });

  it('opens create task modal on button click', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          tasks: [],
          total: 0,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<TaskManagementPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Create Task')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });
});
