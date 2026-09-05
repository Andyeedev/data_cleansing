import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { MigrationSchedulesPage } from './MigrationSchedulesPage';

vi.mock('../hooks/useMigration', () => ({
  useMigrationTenants: () => ({
    tenants: [{ tenant_id: 'tenant-1', tenant_name: 'Default Tenant' }],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useMigrationSchedules: () => ({
    schedules: [{
      schedule_id: 'schedule-1',
      calendar_event_id: null,
      project_id: 'proj-1',
      tenant_id: 'tenant-1',
      name: 'Daily Record Count Validation',
      description: 'Runs daily to validate row counts',
      cron_expression: '0 2 * * *',
      timezone: 'UTC',
      enabled: true,
      status: 'pending',
      next_run: '2024-01-02T02:00:00Z',
      last_run: '2024-01-01T02:00:00Z',
      last_status: 'completed',
      execution_count: 12,
      failure_count: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      project_name: 'Data Migration Alpha',
      tenant_name: 'Default Tenant',
      calendar_event_title: null,
      calendar_event_type: null,
    }],
    total: 1,
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useScheduleStats: () => ({
    stats: { total_schedules: 4, running_schedules: 1, enabled_schedules: 4, total_runs: 28, pass_rate: 75.0 },
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useScheduleLogs: () => ({
    logs: [],
    total: 0,
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useCalendarEvents: () => ({
    events: [{
      event_id: 'ev-1',
      title: 'Daily Alpha Validation Event',
      description: '',
      type: 'task',
      status: 'scheduled',
      start_time: '2024-01-02T02:00:00Z',
      end_time: null,
      recurrence: { frequency: 'daily' },
      project_id: 'proj-1',
      tenant_id: 'tenant-1',
      schedule_id: 'schedule-1',
      schedule_name: 'Daily Record Count Validation',
      cron_expression: '0 2 * * *',
    }],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
  triggerScheduleRun: vi.fn(),
  createSchedule: vi.fn(),
  updateSchedule: vi.fn(),
  toggleSchedule: vi.fn(),
  deleteSchedule: vi.fn(),
}));

vi.mock('../utils/apiClient', () => ({
  apiGet: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
}));

describe('MigrationSchedulesPage', () => {
  it('renders page title', async () => {
    render(
      <BrowserRouter>
        <MigrationSchedulesPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Migration Schedules')).toBeInTheDocument();
    });
  });

  it('renders KPI cards', async () => {
    render(
      <BrowserRouter>
        <MigrationSchedulesPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Schedules')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  it('renders New Schedule button', async () => {
    render(
      <BrowserRouter>
        <MigrationSchedulesPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('+ New Schedule')).toBeInTheDocument();
    });
  });

  it('renders ON/OFF toggle', async () => {
    render(
      <BrowserRouter>
        <MigrationSchedulesPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('ON')).toBeInTheDocument();
    });
  });

  it('renders calendar events panel', async () => {
    render(
      <BrowserRouter>
        <MigrationSchedulesPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Calendar Events')).toBeInTheDocument();
      expect(screen.getByText('Daily Alpha Validation Event')).toBeInTheDocument();
    });
  });
});
