import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPut, apiDelete } from '../utils/apiClient';
import type { Notification, NotificationListResponse, NotificationPreference, PreferenceUpdateRequest } from '../types/notifications';

export function useNotificationList(params?: { page?: number; page_size?: number; is_read?: boolean; type?: string; read?: boolean }) {
  const [data, setData] = useState<NotificationListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<NotificationListResponse>('/notifications', params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.page_size, params?.is_read, params?.type, params?.read]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { data, loading, error, refetch: fetchNotifications };
}

export function useMarkAsRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPut(`/notifications/${notificationId}/read`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { markAsRead, loading, error };
}

export function useMarkAllAsRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPut('/notifications/read-all');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { markAllAsRead, loading, error };
}

export function useDeleteNotification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (notificationId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/notifications/${notificationId}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}

export function useUnreadCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<number>('/notifications/unread/count');
      setCount(result);
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

export function useNotificationPreferences() {
  const [data, setData] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<NotificationPreference[]>('/notifications/preferences/list');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch preferences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return { data, loading, error, refetch: fetchPreferences };
}

export function useUpdatePreference() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePreference = useCallback(async (payload: PreferenceUpdateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPut('/notifications/preferences', payload);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preference');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updatePreference, loading, error };
}
