import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalendarPage } from './CalendarPage';
import { renderWithProviders } from '../test-utils';

const mockEvents = [
  {
    id: '1',
    title: 'Test Event 1',
    description: 'Description for event 1',
    event_type: 'migration',
    start_time: '2026-07-25T10:00:00Z',
    end_time: '2026-07-25T12:00:00Z',
    location: 'Room 1',
    all_day: false,
    created_at: '2026-07-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Test Event 2',
    description: 'Description for event 2',
    event_type: 'meeting',
    start_time: '2026-07-26T14:00:00Z',
    end_time: null,
    location: null,
    all_day: true,
    created_at: '2026-07-19T10:00:00Z',
  },
];

describe('CalendarPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders loading state initially', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithProviders(<CalendarPage />);
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  it('renders event list after loading', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          events: mockEvents,
          total: 2,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    });
  });

  it('renders empty state when no events', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          events: [],
          total: 0,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('No events found')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    renderWithProviders(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    });
  });

  it('displays event type badges correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          events: [mockEvents[0]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Migration')).toBeInTheDocument();
    });
  });

  it('opens create event modal on button click', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          events: [],
          total: 0,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Event')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Create Event'));

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });
});
