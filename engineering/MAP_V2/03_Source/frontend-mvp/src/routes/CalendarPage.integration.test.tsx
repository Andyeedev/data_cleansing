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

describe('CalendarPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches events on mount', async () => {
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
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0]).toContain('/api/v1/calendar/events');
    });
  });

  it('type filter updates displayed events', async () => {
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
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    });

    const typeFilter = screen.getByDisplayValue('All Types');
    fireEvent.change(typeFilter, { target: { value: 'migration' } });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toContain('type=migration');
    });
  });

  it('date filter updates displayed events', async () => {
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
    });

    const startDateInputs = screen.getAllByDisplayValue('');
    const startDateInput = startDateInputs.find((el) => el.getAttribute('type') === 'date');
    if (startDateInput) {
      fireEvent.change(startDateInput, { target: { value: '2026-07-25' } });

      await waitFor(() => {
        const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
        const lastCall = calls[calls.length - 1];
        expect(lastCall[0]).toContain('start_date=2026-07-25');
      });
    }
  });

  it('create event modal opens and closes', async () => {
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
      expect(screen.getByRole('button', { name: 'Create new event' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create new event' }));

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });

  it('create event form validates required fields', async () => {
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
      expect(screen.getByRole('button', { name: 'Create new event' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create new event' }));

    await waitFor(() => {
      expect(screen.getByText('Create')).toBeInTheDocument();
    });

    const createButton = screen.getByText('Create');
    expect(createButton).toBeDisabled();
  });
});
