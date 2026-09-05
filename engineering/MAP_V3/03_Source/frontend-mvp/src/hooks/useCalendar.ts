import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';
import type { CalendarEvent, CalendarEventListResponse, EventCreateRequest, EventUpdateRequest } from '../types/calendar';

export function useCalendarEventList(params?: { page?: number; page_size?: number; type?: string; start_date?: string; end_date?: string }) {
  const [data, setData] = useState<CalendarEventListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<CalendarEventListResponse>('/calendar/events', params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.page_size, params?.type, params?.start_date, params?.end_date]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { data, loading, error, refetch: fetchEvents };
}

export function useCalendarEventDetail(eventId: string | null) {
  const [data, setData] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    setLoading(true);
    setError(null);
    apiGet<CalendarEvent>(`/calendar/events/${eventId}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch event'))
      .finally(() => setLoading(false));
  }, [eventId]);

  return { data, loading, error };
}

export function useCreateCalendarEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (payload: EventCreateRequest): Promise<CalendarEvent | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost<CalendarEvent>('/calendar/events', payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateCalendarEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (eventId: string, payload: EventUpdateRequest): Promise<CalendarEvent | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPut<CalendarEvent>(`/calendar/events/${eventId}`, payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteCalendarEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (eventId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/calendar/events/${eventId}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}

export function useUpcomingEvents(days: number = 7) {
  const [data, setData] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcoming = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<CalendarEvent[]>(`/calendar/events/upcoming/list`, { days });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming events');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchUpcoming();
  }, [fetchUpcoming]);

  return { data, loading, error, refetch: fetchUpcoming };
}
