import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';

export interface MigrationProject {
  project_id: string;
  project_name: string;
  project_type: string;
  status: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  total_batches: number;
  completed_batches: number;
  failed_batches: number;
  total_controls: number;
  completed_controls: number;
  dataset_count: number;
  datasets?: MigrationDataset[];
}

export interface MigrationDataset {
  dataset_id: string;
  table_name: string;
  schema_name: string;
  discovered_at: string;
  last_seen: string;
}

export interface MigrationSchedule {
  schedule_id: string;
  calendar_event_id: string | null;
  project_id: string;
  tenant_id: string;
  name: string;
  description: string;
  cron_expression: string;
  timezone: string;
  enabled: boolean;
  status: string;
  next_run: string | null;
  last_run: string | null;
  last_status: string | null;
  execution_count: number;
  failure_count: number;
  created_at: string;
  updated_at: string;
  project_name: string;
  tenant_name: string;
  calendar_event_title: string | null;
  calendar_event_type: string | null;
}

export interface ScheduleStats {
  total_schedules: number;
  running_schedules: number;
  enabled_schedules: number;
  total_runs: number;
  pass_rate: number;
}

export interface ScheduleExecutionLog {
  execution_id: string;
  schedule_id: string;
  batch_id: string | null;
  status: string;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  terminal_output: string | null;
  error_message: string | null;
  exit_code: number | null;
  triggered_by: string;
  created_at: string;
}

export interface CalendarEvent {
  event_id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  start_time: string;
  end_time: string | null;
  recurrence: any;
  project_id: string;
  tenant_id: string;
  schedule_id: string;
  schedule_name: string;
  cron_expression: string;
}

export interface Tenant {
  tenant_id: string;
  tenant_name: string;
}

export interface MigrationOverview {
  total_projects: number;
  total_batches: number;
  total_controls: number;
  completed_controls: number;
  total_datasets: number;
  active_projects: number;
  active_batches: number;
  health_score: number;
  recent_activity: ActivityEntry[];
  top_projects: TopProject[];
}

export interface ActivityEntry {
  id: number;
  status: string;
  entity_name: string;
  created_at: string;
}

export interface TopProject {
  project_name: string;
  total_batches: number;
  completed_batches: number;
}

interface ProjectsResponse {
  items: MigrationProject[];
  total: number;
}

export function useMigrationProjects(status?: string, tenantId?: string) {
  const [projects, setProjects] = useState<MigrationProject[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { limit: 200 };
      if (status) params.status = status;
      if (tenantId) params.tenant_id = tenantId;
      const data = await apiGet<ProjectsResponse>('/migration/projects', params);
      setProjects(data.items || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [status, tenantId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, total, loading, error, refetch: fetchProjects };
}

export function useMigrationTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Tenant[]>('/migration/projects/tenants');
      setTenants(data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load tenants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return { tenants, loading, error, refetch: fetchTenants };
}

export function useMigrationOverview(tenantId?: string) {
  const [overview, setOverview] = useState<MigrationOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (tenantId) params.tenant_id = tenantId;
      const data = await apiGet<MigrationOverview>('/migration/projects/overview', params);
      setOverview(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load overview');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { overview, loading, error, refetch: fetchOverview };
}

export function useMigrationDatasets(projectId?: string, tenantId?: string) {
  const [datasets, setDatasets] = useState<MigrationDataset[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { limit: 200 };
      if (projectId) params.project_id = projectId;
      if (tenantId) params.tenant_id = tenantId;
      const data = await apiGet<{ items: MigrationDataset[]; total: number }>('/migration/datasets', params);
      setDatasets(data.items || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err?.message || 'Failed to load datasets');
    } finally {
      setLoading(false);
    }
  }, [projectId, tenantId]);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  return { datasets, total, loading, error, refetch: fetchDatasets };
}

export function useMigrationSchedules(tenantId?: string, projectId?: string) {
  const [schedules, setSchedules] = useState<MigrationSchedule[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { limit: 200 };
      if (tenantId) params.tenant_id = tenantId;
      if (projectId) params.project_id = projectId;
      const data = await apiGet<{ items: MigrationSchedule[]; total: number }>('/migration/schedules', params);
      setSchedules(data.items || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err?.message || 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  }, [tenantId, projectId]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return { schedules, total, loading, error, refetch: fetchSchedules };
}

export function useScheduleStats(tenantId?: string) {
  const [stats, setStats] = useState<ScheduleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (tenantId) params.tenant_id = tenantId;
      const data = await apiGet<ScheduleStats>('/migration/schedules/stats', params);
      setStats(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useScheduleLogs(scheduleId: string | null) {
  const [logs, setLogs] = useState<ScheduleExecutionLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!scheduleId) {
      setLogs([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<{ items: ScheduleExecutionLog[]; total: number }>(
        `/migration/schedules/${scheduleId}/logs`,
        { limit: 50 }
      );
      setLogs(data.items || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err?.message || 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, total, loading, error, refetch: fetchLogs };
}

export function useCalendarEvents(tenantId?: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (tenantId) params.tenant_id = tenantId;
      const data = await apiGet<CalendarEvent[]>('/migration/schedules/calendar-events', params);
      setEvents(data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

export async function triggerScheduleRun(scheduleId: string): Promise<{ execution_id: string; status: string; duration?: number; error?: string }> {
  return apiPost(`/migration/schedules/${scheduleId}/run`);
}

export interface ScheduleCreateInput {
  name: string;
  description?: string;
  project_id: string;
  tenant_id: string;
  cron_expression: string;
  timezone?: string;
  enabled?: boolean;
}

export interface ScheduleUpdateInput {
  name?: string;
  description?: string;
  cron_expression?: string;
  timezone?: string;
  enabled?: boolean;
}

export async function createSchedule(input: ScheduleCreateInput): Promise<MigrationSchedule> {
  return apiPost('/migration/schedules', input);
}

export async function updateSchedule(scheduleId: string, input: ScheduleUpdateInput): Promise<MigrationSchedule> {
  return apiPut(`/migration/schedules/${scheduleId}`, input);
}

export async function toggleSchedule(scheduleId: string): Promise<MigrationSchedule> {
  return apiPut(`/migration/schedules/${scheduleId}/toggle`);
}

export async function deleteSchedule(scheduleId: string): Promise<void> {
  return apiDelete(`/migration/schedules/${scheduleId}`);
}
