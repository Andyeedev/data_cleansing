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

describe('TaskManagementPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches tasks on mount', async () => {
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
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0]).toContain('/api/v1/tasks');
    });
  });

  it('status filter updates displayed tasks', async () => {
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
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const statusFilter = screen.getByDisplayValue('All Status');
    fireEvent.change(statusFilter, { target: { value: 'pending' } });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toContain('status=pending');
    });
  });

  it('priority filter updates displayed tasks', async () => {
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
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const priorityFilter = screen.getByDisplayValue('All Priority');
    fireEvent.change(priorityFilter, { target: { value: 'high' } });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toContain('priority=high');
    });
  });

  it('create task modal opens and closes', async () => {
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

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });

  it('create task form validates required fields', async () => {
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
      expect(screen.getByText('Create')).toBeInTheDocument();
    });

    const createButton = screen.getByText('Create');
    expect(createButton).toBeDisabled();
  });

  it('create task form submits successfully', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { id: '3', title: 'New Task', status: 'pending', priority: 'medium' },
        }),
      })
      .mockResolvedValueOnce({
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
      expect(screen.getByText('Create Task')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(screen.getByText('Create')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
      target: { value: 'New Task' },
    });

    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });

  it('pagination works correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          tasks: mockTasks,
          total: 50,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<TaskManagementPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toContain('page=2');
    });
  });
});
