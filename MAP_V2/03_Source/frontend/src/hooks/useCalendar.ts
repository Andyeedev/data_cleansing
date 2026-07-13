import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: string;
  start_time: string;
  end_time?: string;
  all_day: boolean;
  timezone: string;
  attendees: string[];
  location?: string;
  meeting_url?: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface EventListResponse {
  events: CalendarEvent[];
  total: number;
  page: number;
  page_size: number;
}

interface UseEventsOptions {
  type?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

export function useEvents(options: UseEventsOptions = {}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.type) params.append('type', options.type);
      if (options.start_date) params.append('start_date', options.start_date);
      if (options.end_date) params.append('end_date', options.end_date);
      if (options.page) params.append('page', String(options.page));
      if (options.page_size) params.append('page_size', String(options.page_size));
      
      const query = params.toString();
      const data = await api.get<{ success: boolean; data: EventListResponse }>(`/calendar/events${query ? `?${query}` : ''}`);
      setEvents(data.data.events);
      setTotal(data.data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [options.type, options.start_date, options.end_date, options.page, options.page_size]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, total, loading, error, refetch: fetchEvents };
}

export function useUpcomingEvents(days: number = 7) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<{ success: boolean; data: CalendarEvent[] }>(`/calendar/events/upcoming/list?days=${days}`);
      setEvents(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming events');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

export function useCreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: Partial<CalendarEvent>) => {
    setLoading(true);
    setError(null);
    try {
    const result = await api.post<{ success: boolean; data: CalendarEvent }>('/calendar/events', payload);
    return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}
