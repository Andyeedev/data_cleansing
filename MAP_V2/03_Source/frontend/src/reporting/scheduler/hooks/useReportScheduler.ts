import { useState, useMemo } from 'react';
import type {
  ScheduleConfig,
  ScheduleTemplate,
  ScheduleLogEntry,
  SchedulerMetrics,
  SchedulerFilters,
  QueueStatus,
} from '../types/SchedulerTypes';

const mockSchedules: ScheduleConfig[] = [
  { id: 'sc1', reportId: 'r4', reportName: 'Governance Compliance Report', frequency: 'quarterly', startDate: '2026-01-01', lastRun: '2026-07-01', nextRun: '2026-10-01', time: '08:00', timeZone: 'UTC', priority: 'high', owner: 'Emily Davis', status: 'active', recipients: ['emily@example.com', 'compliance@example.com'], notifications: { email: true, teams: true, sms: false, web: true }, createdAt: '2026-01-01', updatedAt: '2026-07-01' },
  { id: 'sc2', reportId: 'r10', reportName: 'Quarterly Executive Briefing', frequency: 'quarterly', startDate: '2026-01-01', lastRun: '2026-07-01', nextRun: '2026-10-01', time: '09:00', timeZone: 'UTC', priority: 'critical', owner: 'John Smith', status: 'active', recipients: ['exec-team@example.com'], notifications: { email: true, teams: true, sms: true, web: true }, createdAt: '2026-01-01', updatedAt: '2026-07-01' },
  { id: 'sc3', reportId: 'r7', reportName: 'Platform Health Report', frequency: 'daily', startDate: '2026-06-01', lastRun: '2026-07-09', nextRun: '2026-07-10', time: '06:00', timeZone: 'UTC', priority: 'medium', owner: 'Tom Anderson', status: 'active', recipients: ['ops@example.com'], notifications: { email: true, teams: false, sms: false, web: true }, createdAt: '2026-06-01', updatedAt: '2026-07-09' },
  { id: 'sc4', reportId: 'r2', reportName: 'Migration Progress Report', frequency: 'weekly', startDate: '2026-03-01', lastRun: '2026-07-05', nextRun: '2026-07-12', time: '07:00', timeZone: 'UTC', priority: 'high', owner: 'Sarah Jones', status: 'active', recipients: ['migration-team@example.com'], notifications: { email: true, teams: true, sms: false, web: true }, createdAt: '2026-03-01', updatedAt: '2026-07-05' },
  { id: 'sc5', reportId: 'r5', reportName: 'Risk Assessment Report', frequency: 'monthly', startDate: '2026-01-01', lastRun: '2026-07-03', nextRun: '2026-08-01', time: '10:00', timeZone: 'UTC', priority: 'high', owner: 'Alex Brown', status: 'active', recipients: ['risk-team@example.com'], notifications: { email: true, teams: true, sms: false, web: true }, createdAt: '2026-01-01', updatedAt: '2026-07-03' },
  { id: 'sc6', reportId: 'r8', reportName: 'Audit Trail Report', frequency: 'daily', startDate: '2026-05-01', lastRun: '2026-07-08', nextRun: '2026-07-09', time: '23:00', timeZone: 'UTC', priority: 'medium', owner: 'Karen White', status: 'active', recipients: ['audit@example.com'], notifications: { email: true, teams: false, sms: false, web: true }, createdAt: '2026-05-01', updatedAt: '2026-07-09' },
  { id: 'sc7', reportId: 'r1', reportName: 'Executive Dashboard Report', frequency: 'monthly', startDate: '2026-01-01', lastRun: '2026-07-01', nextRun: '2026-08-01', time: '08:00', timeZone: 'UTC', priority: 'critical', owner: 'John Smith', status: 'active', recipients: ['exec-team@example.com', 'board@example.com'], notifications: { email: true, teams: true, sms: true, web: true }, createdAt: '2026-01-01', updatedAt: '2026-07-01' },
  { id: 'sc8', reportId: 'r6', reportName: 'Security Audit Report', frequency: 'weekly', startDate: '2026-04-01', lastRun: '2026-06-15', time: '09:00', timeZone: 'UTC', priority: 'high', owner: 'Lisa Wilson', status: 'paused', recipients: ['security@example.com'], notifications: { email: true, teams: true, sms: false, web: true }, createdAt: '2026-04-01', updatedAt: '2026-06-15' },
  { id: 'sc9', reportId: 'r9', reportName: 'AI Insights Report', frequency: 'daily', startDate: '2026-07-01', lastRun: '2026-07-09', nextRun: '2026-07-10', time: '05:00', timeZone: 'UTC', priority: 'low', owner: 'MAP Nexus', status: 'active', recipients: ['ai-team@example.com'], notifications: { email: false, teams: true, sms: false, web: true }, createdAt: '2026-07-01', updatedAt: '2026-07-09' },
  { id: 'sc10', reportId: 'r3', reportName: 'Validation Results Report', frequency: 'event-driven', startDate: '2026-06-01', lastRun: '2026-07-08', time: '00:00', timeZone: 'UTC', priority: 'medium', owner: 'Mike Chen', status: 'active', recipients: ['validation@example.com'], notifications: { email: true, teams: false, sms: false, web: true }, createdAt: '2026-06-01', updatedAt: '2026-07-08' },
];

const mockTemplates: ScheduleTemplate[] = [
  { id: 't1', name: 'Daily Executive Report', description: 'Quick daily executive summary delivered each morning', frequency: 'daily', priority: 'high', config: { time: '07:00', timeZone: 'UTC', notifications: { email: true, teams: true, sms: false, web: true } }, usageCount: 12 },
  { id: 't2', name: 'Weekly Governance Report', description: 'Governance compliance overview delivered every Monday', frequency: 'weekly', priority: 'medium', config: { time: '08:00', timeZone: 'UTC', notifications: { email: true, teams: true, sms: false, web: true } }, usageCount: 8 },
  { id: 't3', name: 'Monthly Audit Pack', description: 'Complete audit trail and compliance pack delivered monthly', frequency: 'monthly', priority: 'high', config: { time: '09:00', timeZone: 'UTC', notifications: { email: true, teams: true, sms: false, web: true } }, usageCount: 15 },
  { id: 't4', name: 'Quarterly Migration Review', description: 'Comprehensive quarterly migration progress and risk review', frequency: 'quarterly', priority: 'critical', config: { time: '08:00', timeZone: 'UTC', notifications: { email: true, teams: true, sms: true, web: true } }, usageCount: 5 },
  { id: 't5', name: 'Annual Compliance Report', description: 'Full-year compliance and governance report', frequency: 'annually', priority: 'critical', config: { time: '08:00', timeZone: 'UTC', notifications: { email: true, teams: true, sms: true, web: true } }, usageCount: 2 },
];

const mockLogs: ScheduleLogEntry[] = [
  { id: 'l1', scheduleId: 'sc3', scheduleName: 'Platform Health Report', level: 'info', message: 'Report generated successfully', timestamp: '2026-07-09T06:00:00' },
  { id: 'l2', scheduleId: 'sc6', scheduleName: 'Audit Trail Report', level: 'info', message: 'Report generation started', timestamp: '2026-07-09T23:00:00' },
  { id: 'l3', scheduleId: 'sc1', scheduleName: 'Governance Compliance Report', level: 'warning', message: 'Schedule approaching end date', timestamp: '2026-07-08T14:00:00' },
  { id: 'l4', scheduleId: 'sc8', scheduleName: 'Security Audit Report', level: 'error', message: 'Failed to connect to email server', timestamp: '2026-07-07T09:00:00' },
  { id: 'l5', scheduleId: 'sc9', scheduleName: 'AI Insights Report', level: 'info', message: 'AI model updated, insights refreshed', timestamp: '2026-07-09T05:00:00' },
  { id: 'l6', scheduleId: 'sc4', scheduleName: 'Migration Progress Report', level: 'info', message: 'Weekly report queued for generation', timestamp: '2026-07-07T07:00:00' },
  { id: 'l7', scheduleId: 'sc5', scheduleName: 'Risk Assessment Report', level: 'debug', message: 'Risk calculation completed in 2.3s', timestamp: '2026-07-03T10:00:00' },
  { id: 'l8', scheduleId: 'sc2', scheduleName: 'Quarterly Executive Briefing', level: 'info', message: 'Presentation deck generated', timestamp: '2026-07-01T09:00:00' },
  { id: 'l9', scheduleId: 'sc3', scheduleName: 'Platform Health Report', level: 'warning', message: 'Health check threshold exceeded', timestamp: '2026-07-08T06:00:00' },
  { id: 'l10', scheduleId: 'sc7', scheduleName: 'Executive Dashboard Report', level: 'info', message: 'Monthly dashboard delivered to board', timestamp: '2026-07-01T08:00:00' },
  { id: 'l11', scheduleId: 'sc8', scheduleName: 'Security Audit Report', level: 'error', message: 'Schedule paused due to repeated failures', timestamp: '2026-06-15T09:00:00' },
  { id: 'l12', scheduleId: 'sc6', scheduleName: 'Audit Trail Report', level: 'info', message: 'Audit log archived for previous period', timestamp: '2026-07-08T23:00:00' },
  { id: 'l13', scheduleId: 'sc10', scheduleName: 'Validation Results Report', level: 'info', message: 'Event trigger received, report generated', timestamp: '2026-07-08T15:00:00' },
  { id: 'l14', scheduleId: 'sc9', scheduleName: 'AI Insights Report', level: 'debug', message: 'NLP processing completed for 1,247 records', timestamp: '2026-07-09T05:00:00' },
  { id: 'l15', scheduleId: 'sc4', scheduleName: 'Migration Progress Report', level: 'warning', message: 'Data source latency detected', timestamp: '2026-07-07T07:00:00' },
];

const mockQueue: { id: string; reportName: string; status: QueueStatus; startedAt?: string; progress?: number; error?: string }[] = [
  { id: 'q1', reportName: 'Audit Trail Report', status: 'running', startedAt: '2026-07-09T23:00:00', progress: 65 },
  { id: 'q2', reportName: 'Migration Progress Report', status: 'pending', startedAt: '2026-07-10T07:00:00' },
  { id: 'q3', reportName: 'Validation Results Report', status: 'completed', startedAt: '2026-07-08T15:00:00' },
  { id: 'q4', reportName: 'Security Audit Report', status: 'failed', startedAt: '2026-07-07T09:00:00', error: 'Email server unreachable' },
  { id: 'q5', reportName: 'AI Insights Report', status: 'completed', startedAt: '2026-07-09T05:00:00' },
  { id: 'q6', reportName: 'Platform Health Report', status: 'cancelled', startedAt: '2026-07-09T06:00:00' },
];

export const useReportScheduler = () => {
  const [filters, setFilters] = useState<SchedulerFilters>({
    search: '',
    frequency: 'all',
    status: 'all',
    priority: 'all',
    owner: '',
  });

  const metrics: SchedulerMetrics = {
    totalScheduled: mockSchedules.length,
    runningJobs: mockQueue.filter((q) => q.status === 'running').length,
    nextExecutions: mockSchedules.filter((s) => s.status === 'active').length,
    failedSchedules: mockSchedules.filter((s) => s.status === 'failed').length,
    queueSize: mockQueue.filter((q) => q.status === 'pending' || q.status === 'running').length,
    healthScore: 87,
    successRate: 94.2,
    failureRate: 5.8,
    averageRuntime: 45,
    peakHours: '08:00 - 10:00',
  };

  const filteredSchedules = useMemo(() => {
    return mockSchedules.filter((schedule) => {
      if (filters.search && !schedule.reportName.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.frequency !== 'all' && schedule.frequency !== filters.frequency) return false;
      if (filters.status !== 'all' && schedule.status !== filters.status) return false;
      if (filters.priority !== 'all' && schedule.priority !== filters.priority) return false;
      if (filters.owner && schedule.owner !== filters.owner) return false;
      return true;
    });
  }, [filters]);

  const schedulesByFrequency = useMemo(() => {
    const grouped: Record<string, ScheduleConfig[]> = {
      daily: [], weekly: [], monthly: [], quarterly: [], annually: [], 'event-driven': [], 'on-demand': [],
    };
    mockSchedules.forEach((schedule) => {
      grouped[schedule.frequency].push(schedule);
    });
    return grouped;
  }, []);

  const schedulesByStatus = useMemo(() => {
    const grouped: Record<string, ScheduleConfig[]> = {
      active: [], paused: [], completed: [], failed: [],
    };
    mockSchedules.forEach((schedule) => {
      grouped[schedule.status].push(schedule);
    });
    return grouped;
  }, []);

  return {
    metrics,
    schedules: filteredSchedules,
    allSchedules: mockSchedules,
    templates: mockTemplates,
    logs: mockLogs,
    queue: mockQueue,
    schedulesByFrequency,
    schedulesByStatus,
    filters,
    setFilters,
  };
};
