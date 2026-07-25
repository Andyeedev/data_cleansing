export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  type: string;
  start_time: string;
  end_time: string | null;
  all_day: boolean;
  timezone: string;
  attendees: string[];
  location: string | null;
  meeting_url: string | null;
  status: string;
  created_by: string | null;
  created_at: string;
}

export interface CalendarEventListResponse {
  events: CalendarEvent[];
  total: number;
  page: number;
  page_size: number;
}

export interface EventCreateRequest {
  title: string;
  description?: string;
  type?: string;
  start_time: string;
  end_time?: string;
  all_day?: boolean;
  timezone?: string;
  attendees?: string[];
  location?: string;
  meeting_url?: string;
}

export interface EventUpdateRequest {
  title?: string;
  description?: string;
  type?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  location?: string;
}
