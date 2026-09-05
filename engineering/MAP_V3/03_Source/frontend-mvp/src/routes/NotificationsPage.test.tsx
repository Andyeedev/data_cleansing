import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationsPage } from './NotificationsPage';
import { renderWithProviders } from '../test-utils';

const mockNotifications = [
  {
    id: '1',
    type: 'info',
    title: 'Test Notification 1',
    message: 'Message for notification 1',
    read: false,
    created_at: '2026-07-20T10:00:00Z',
  },
  {
    id: '2',
    type: 'success',
    title: 'Test Notification 2',
    message: 'Message for notification 2',
    read: true,
    created_at: '2026-07-19T10:00:00Z',
  },
];

describe('NotificationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders loading state initially', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithProviders(<NotificationsPage />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('renders notification list after loading', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          notifications: mockNotifications,
          total: 2,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
      expect(screen.getByText('Test Notification 2')).toBeInTheDocument();
    });
  });

  it('renders empty state when no notifications', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          notifications: [],
          total: 0,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('HTTP 500'));

    renderWithProviders(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('displays unread indicator for unread notifications', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          notifications: [mockNotifications[0]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Mark Read')).toBeInTheDocument();
    });
  });

  it('shows mark all as read button', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          notifications: mockNotifications,
          total: 2,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Mark All as Read')).toBeInTheDocument();
    });
  });
});
