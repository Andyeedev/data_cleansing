import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  user_id: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  page_size: number;
}

interface UseNotificationsOptions {
  is_read?: boolean;
  type?: string;
  page?: number;
  page_size?: number;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.is_read !== undefined) params.append('is_read', String(options.is_read));
      if (options.type) params.append('type', options.type);
      if (options.page) params.append('page', String(options.page));
      if (options.page_size) params.append('page_size', String(options.page_size));
      
      const query = params.toString();
      const data = await api.get<{ success: boolean; data: NotificationListResponse }>(`/notifications/${query ? `?${query}` : ''}`);
      setNotifications(data.data.notifications);
      setTotal(data.data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [options.is_read, options.type, options.page, options.page_size]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, total, loading, error, refetch: fetchNotifications };
}

export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<{ success: boolean; data: { count: number } }>('/notifications/unread/count');
      setCount(data.data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch unread count');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return { count, loading, error, refetch: fetchCount };
}

export function useMarkNotificationRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markRead = async (notificationId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/notifications/${notificationId}/read`, {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { markRead, loading, error };
}

export function useMarkAllRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAllRead = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.put('/notifications/read-all', {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { markAllRead, loading, error };
}

export function useDeleteNotification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (notificationId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}
