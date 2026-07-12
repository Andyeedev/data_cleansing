import { useState, useMemo } from 'react';
import type {
  ReportItem,
  ReportSchedule,
  ReportQueueItem,
  ReportHistoryEntry,
  ReportCentreMetrics,
  ReportFilters,
  ReportCategory,
} from '../types/ReportCentreTypes';

const mockReports: ReportItem[] = [
  { id: 'r1', name: 'Executive Dashboard Report', description: 'Monthly executive summary with KPIs', category: 'executive', status: 'completed', format: ['html', 'pdf'], owner: 'John Smith', createdAt: '2026-06-15', updatedAt: '2026-07-01', lastGenerated: '2026-07-01', isFavourite: true, isShared: true, tags: ['monthly', 'executive'] },
  { id: 'r2', name: 'Migration Progress Report', description: 'Current migration status and metrics', category: 'migration', status: 'completed', format: ['html', 'pdf'], owner: 'Sarah Jones', createdAt: '2026-06-20', updatedAt: '2026-07-05', lastGenerated: '2026-07-05', isFavourite: false, isShared: false, tags: ['migration', 'weekly'] },
  { id: 'r3', name: 'Validation Results Report', description: 'Data validation outcomes', category: 'validation', status: 'available', format: ['html'], owner: 'Mike Chen', createdAt: '2026-06-25', updatedAt: '2026-07-08', isFavourite: true, isShared: false, tags: ['validation'] },
  { id: 'r4', name: 'Governance Compliance Report', description: 'Policy compliance status', category: 'governance', status: 'scheduled', format: ['html', 'pdf', 'excel'], owner: 'Emily Davis', createdAt: '2026-05-01', updatedAt: '2026-07-01', nextScheduled: '2026-08-01', isFavourite: false, isShared: true, tags: ['governance', 'quarterly'] },
  { id: 'r5', name: 'Risk Assessment Report', description: 'Current risk posture', category: 'risk', status: 'completed', format: ['html', 'pdf'], owner: 'Alex Brown', createdAt: '2026-06-10', updatedAt: '2026-07-03', lastGenerated: '2026-07-03', isFavourite: false, isShared: false, tags: ['risk'] },
  { id: 'r6', name: 'Security Audit Report', description: 'Security events and compliance', category: 'security', status: 'available', format: ['html'], owner: 'Lisa Wilson', createdAt: '2026-06-28', updatedAt: '2026-07-09', isFavourite: true, isShared: false, tags: ['security', 'audit'] },
  { id: 'r7', name: 'Platform Health Report', description: 'System health and performance', category: 'administration', status: 'completed', format: ['html'], owner: 'Tom Anderson', createdAt: '2026-06-01', updatedAt: '2026-07-09', lastGenerated: '2026-07-09', isFavourite: false, isShared: true, tags: ['health', 'daily'] },
  { id: 'r8', name: 'Audit Trail Report', description: 'Complete audit log', category: 'audit', status: 'generating', format: ['html', 'pdf'], owner: 'Karen White', createdAt: '2026-06-15', updatedAt: '2026-07-09', isFavourite: false, isShared: false, tags: ['audit'] },
  { id: 'r9', name: 'AI Insights Report', description: 'AI-generated insights and recommendations', category: 'ai', status: 'completed', format: ['html'], owner: 'MAP Nexus', createdAt: '2026-07-01', updatedAt: '2026-07-09', lastGenerated: '2026-07-09', isFavourite: true, isShared: true, tags: ['ai', 'insights'] },
  { id: 'r10', name: 'Quarterly Executive Briefing', description: 'Comprehensive quarterly review', category: 'executive', status: 'scheduled', format: ['html', 'pdf', 'powerpoint'], owner: 'John Smith', createdAt: '2026-04-01', updatedAt: '2026-07-01', nextScheduled: '2026-10-01', isFavourite: true, isShared: true, tags: ['quarterly', 'executive'] },
];

const mockSchedules: ReportSchedule[] = [
  { id: 's1', reportId: 'r4', reportName: 'Governance Compliance Report', frequency: 'quarterly', nextRun: '2026-08-01', lastRun: '2026-07-01', status: 'active', recipients: ['emily@example.com', 'compliance@example.com'] },
  { id: 's2', reportId: 'r10', reportName: 'Quarterly Executive Briefing', frequency: 'quarterly', nextRun: '2026-10-01', lastRun: '2026-07-01', status: 'active', recipients: ['exec-team@example.com'] },
  { id: 's3', reportId: 'r7', reportName: 'Platform Health Report', frequency: 'daily', nextRun: '2026-07-10', lastRun: '2026-07-09', status: 'active', recipients: ['ops@example.com'] },
];

const mockQueue: ReportQueueItem[] = [
  { id: 'q1', reportName: 'Audit Trail Report', status: 'running', startedAt: '2026-07-09T10:30:00', progress: 65 },
  { id: 'q2', reportName: 'Migration Progress Report', status: 'pending', startedAt: '2026-07-09T10:35:00' },
  { id: 'q3', reportName: 'Validation Results Report', status: 'failed', startedAt: '2026-07-09T09:00:00', error: 'Timeout exceeded' },
];

const mockHistory: ReportHistoryEntry[] = [
  { id: 'h1', reportName: 'Platform Health Report', action: 'generated', timestamp: '2026-07-09T08:00:00', user: 'System' },
  { id: 'h2', reportName: 'Executive Dashboard Report', action: 'downloaded', timestamp: '2026-07-08T14:30:00', user: 'John Smith', format: 'pdf' },
  { id: 'h3', reportName: 'AI Insights Report', action: 'generated', timestamp: '2026-07-09T07:00:00', user: 'MAP Nexus' },
  { id: 'h4', reportName: 'Governance Compliance Report', action: 'shared', timestamp: '2026-07-07T11:00:00', user: 'Emily Davis' },
  { id: 'h5', reportName: 'Risk Assessment Report', action: 'exported', timestamp: '2026-07-06T16:00:00', user: 'Alex Brown', format: 'excel' },
];

export const useReportCentre = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    search: '',
    category: 'all',
    status: 'all',
    owner: '',
    dateFrom: '',
    dateTo: '',
    isFavourite: false,
    isScheduled: false,
    tags: [],
  });

  const metrics: ReportCentreMetrics = {
    totalReports: mockReports.length,
    recentlyGenerated: mockReports.filter((r) => r.lastGenerated).length,
    favouriteReports: mockReports.filter((r) => r.isFavourite).length,
    scheduledReports: mockReports.filter((r) => r.status === 'scheduled').length,
    pendingReports: mockQueue.filter((q) => q.status === 'pending').length,
    failedReports: mockQueue.filter((q) => q.status === 'failed').length,
  };

  const filteredReports = useMemo(() => {
    return mockReports.filter((report) => {
      if (filters.search && !report.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category !== 'all' && report.category !== filters.category) return false;
      if (filters.status !== 'all' && report.status !== filters.status) return false;
      if (filters.isFavourite && !report.isFavourite) return false;
      if (filters.isScheduled && report.status !== 'scheduled') return false;
      return true;
    });
  }, [filters]);

  const reportsByCategory = useMemo(() => {
    const grouped: Record<ReportCategory, ReportItem[]> = {
      executive: [], migration: [], validation: [], governance: [],
      risk: [], security: [], administration: [], audit: [], ai: [],
    };
    mockReports.forEach((report) => {
      grouped[report.category].push(report);
    });
    return grouped;
  }, []);

  const toggleFavourite = (reportId: string) => {
    const report = mockReports.find((r) => r.id === reportId);
    if (report) report.isFavourite = !report.isFavourite;
  };

  return {
    metrics,
    reports: filteredReports,
    allReports: mockReports,
    reportsByCategory,
    schedules: mockSchedules,
    queue: mockQueue,
    history: mockHistory,
    filters,
    setFilters,
    toggleFavourite,
  };
};
