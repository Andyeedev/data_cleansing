import { screen, waitFor, fireEvent } from '@testing-library/react';
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

describe('NotificationsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches notifications on mount', async () => {
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
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0]).toContain('/api/v1/notifications');
    });
  });

  it('type filter updates displayed notifications', async () => {
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
      expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
    });

    const typeFilter = screen.getByDisplayValue('All Types');
    fireEvent.change(typeFilter, { target: { value: 'info' } });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toContain('type=info');
    });
  });

  it('read filter updates displayed notifications', async () => {
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
      expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
    });

    const readFilter = screen.getByDisplayValue('All Status');
    fireEvent.change(readFilter, { target: { value: 'unread' } });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toContain('read=false');
    });
  });

  it('mark all as read button triggers API call', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { updated: 2 },
        }),
      })
      .mockResolvedValueOnce({
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
      expect(screen.getByText('Mark All as Read')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Mark All as Read'));

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const markAllCall = calls.find((call: string[]) => call[0].includes('/read-all'));
      expect(markAllCall).toBeTruthy();
    });
  });
});
