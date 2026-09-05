import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import { TaskDetailPage } from './TaskDetailPage';
import { renderWithProviders } from '../test-utils';

const mockTask = {
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
};

const mockComments = [
  {
    id: 'c1',
    content: 'This is a comment',
    created_at: '2026-07-20T11:00:00Z',
  },
  {
    id: 'c2',
    content: 'Another comment',
    created_at: '2026-07-20T12:00:00Z',
  },
];

function renderTaskDetail() {
  return renderWithProviders(
    <Routes>
      <Route path="/tasks/:id" element={<TaskDetailPage />} />
    </Routes>,
    {
      initialRole: 'admin',
      initialEntries: ['/tasks/1'],
    }
  );
}

function renderTaskDetailAsViewer() {
  return renderWithProviders(
    <Routes>
      <Route path="/tasks/:id" element={<TaskDetailPage />} />
    </Routes>,
    {
      initialRole: 'viewer',
      initialEntries: ['/tasks/1'],
    }
  );
}

describe('TaskDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderTaskDetailAsViewer();
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => {})
    );

    renderTaskDetail();
    expect(document.querySelector('[style*="animation: spin"]')).toBeInTheDocument();
  });

  it('renders task details after loading', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockTask,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockComments,
        }),
      });

    renderTaskDetail();

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Description for task 1')).toBeInTheDocument();
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('HTTP 404'));

    renderTaskDetail();

    await waitFor(() => {
      expect(screen.getByText(/HTTP 404/)).toBeInTheDocument();
    });
  });

  it('displays status badge correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockTask,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [],
        }),
      });

    renderTaskDetail();

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  it('displays priority badge correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockTask,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [],
        }),
      });

    renderTaskDetail();

    await waitFor(() => {
      expect(screen.getByText('high')).toBeInTheDocument();
    });
  });

  it('displays comments after loading', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockTask,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockComments,
        }),
      });

    renderTaskDetail();

    await waitFor(() => {
      expect(screen.getByText('This is a comment')).toBeInTheDocument();
      expect(screen.getByText('Another comment')).toBeInTheDocument();
    });
  });

  it('shows "No comments yet" when no comments exist', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockTask,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [],
        }),
      });

    renderTaskDetail();

    await waitFor(() => {
      expect(screen.getByText('No comments yet')).toBeInTheDocument();
    });
  });

  it('displays completion percentage', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockTask,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [],
        }),
      });

    renderTaskDetail();

    await waitFor(() => {
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  it('shows "—" for tasks without due date', async () => {
    const taskNoDueDate = { ...mockTask, due_date: null };
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: taskNoDueDate,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [],
        }),
      });

    renderTaskDetail();

    await waitFor(() => {
      const dashElements = screen.getAllByText('—');
      expect(dashElements.length).toBeGreaterThan(0);
    });
  });
});
