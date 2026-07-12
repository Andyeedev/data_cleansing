import { useState, useCallback } from 'react';
import type {
  DistributionJob,
  DistributionHistory,
  DistributionProfile,
  DistributionTemplate,
  DistributionNotification,
  DistributionAuditEntry,
  DistributionLog,
  DistributionStatistics,
  DistributionDashboardData,
  DistributionStatus,
  DeliveryChannel,
  ExportFormat,
} from '../types/DistributionTypes';

const mockProfiles: DistributionProfile[] = [
  { id: '1', name: 'Executive Distribution', description: 'Weekly executive summary distribution', channels: ['email', 'teams'], recipients: [], enabled: true, createdAt: '2026-01-15', updatedAt: '2026-06-20' },
  { id: '2', name: 'Governance Distribution', description: 'Monthly governance report distribution', channels: ['email', 'sharepoint'], recipients: [], enabled: true, createdAt: '2026-02-10', updatedAt: '2026-06-18' },
  { id: '3', name: 'Audit Distribution', description: 'Quarterly audit report distribution', channels: ['email'], recipients: [], enabled: true, createdAt: '2026-03-05', updatedAt: '2026-06-15' },
  { id: '4', name: 'Customer Distribution', description: 'Customer report delivery', channels: ['email', 'portal'], recipients: [], enabled: true, createdAt: '2026-04-01', updatedAt: '2026-06-22' },
  { id: '5', name: 'Internal Distribution', description: 'Internal team distribution', channels: ['teams', 'sharepoint'], recipients: [], enabled: true, createdAt: '2026-05-01', updatedAt: '2026-06-25' },
];

const mockJobs: DistributionJob[] = [
  { id: '1', reportId: 'r1', reportName: 'Executive Summary - June 2026', profileId: '1', profileName: 'Executive Distribution', channel: 'email', status: 'completed', recipient: 'ceo@mapnexus.com', completedAt: '2026-06-30T10:00:00Z', retryCount: 0, maxRetries: 3, createdAt: '2026-06-30T09:55:00Z' },
  { id: '2', reportId: 'r2', reportName: 'Migration Status Report', profileId: '2', profileName: 'Governance Distribution', channel: 'sharepoint', status: 'pending', recipient: 'compliance@mapnexus.com', scheduledAt: '2026-07-01T08:00:00Z', retryCount: 0, maxRetries: 3, createdAt: '2026-06-30T14:00:00Z' },
  { id: '3', reportId: 'r3', reportName: 'Data Quality Report', profileId: '3', profileName: 'Audit Distribution', channel: 'email', status: 'running', recipient: 'audit@mapnexus.com', startedAt: '2026-07-01T07:30:00Z', retryCount: 0, maxRetries: 3, createdAt: '2026-07-01T07:25:00Z' },
  { id: '4', reportId: 'r4', reportName: 'Compliance Dashboard', profileId: '4', profileName: 'Customer Distribution', channel: 'portal', status: 'failed', recipient: 'customer@example.com', errorMessage: 'Delivery timeout', retryCount: 2, maxRetries: 3, createdAt: '2026-06-29T16:00:00Z' },
  { id: '5', reportId: 'r5', reportName: 'Weekly Operations Summary', profileId: '5', profileName: 'Internal Distribution', channel: 'teams', status: 'completed', recipient: 'team@mapnexus.com', completedAt: '2026-06-28T11:00:00Z', retryCount: 0, maxRetries: 3, createdAt: '2026-06-28T10:55:00Z' },
];

const mockHistory: DistributionHistory[] = [
  { id: '1', reportName: 'Executive Summary - May 2026', recipient: 'ceo@mapnexus.com', channel: 'email', status: 'completed', deliveryDate: '2026-05-31', runtime: 12.5, auditReference: 'AUD-2026-001', format: 'pdf' },
  { id: '2', reportName: 'Migration Progress Report', recipient: 'team@mapnexus.com', channel: 'teams', status: 'completed', deliveryDate: '2026-06-15', runtime: 8.2, auditReference: 'AUD-2026-002', format: 'html' },
  { id: '3', reportName: 'Compliance Report Q2', recipient: 'compliance@mapnexus.com', channel: 'email', status: 'completed', deliveryDate: '2026-06-30', runtime: 15.8, auditReference: 'AUD-2026-003', format: 'pdf' },
  { id: '4', reportName: 'Data Quality Summary', recipient: 'data-team@mapnexus.com', channel: 'sharepoint', status: 'failed', deliveryDate: '2026-06-28', runtime: 0, auditReference: 'AUD-2026-004', format: 'excel' },
];

const mockTemplates: DistributionTemplate[] = [
  { id: '1', name: 'Executive Weekly Pack', description: 'Weekly executive summary package', channels: ['email', 'teams'], format: 'pdf', recipients: ['ceo@mapnexus.com', 'cfo@mapnexus.com'], enabled: true, usageCount: 24 },
  { id: '2', name: 'Monthly Audit Pack', description: 'Monthly audit report package', channels: ['email', 'sharepoint'], format: 'pdf', recipients: ['audit@mapnexus.com'], enabled: true, usageCount: 12 },
  { id: '3', name: 'Migration Completion Pack', description: 'Migration completion notification', channels: ['email', 'teams'], format: 'html', recipients: ['migration-team@mapnexus.com'], enabled: true, usageCount: 8 },
  { id: '4', name: 'Compliance Pack', description: 'Compliance reporting package', channels: ['email'], format: 'pdf', recipients: ['compliance@mapnexus.com'], enabled: true, usageCount: 6 },
  { id: '5', name: 'Customer Delivery Pack', description: 'Customer report delivery', channels: ['email', 'portal'], format: 'pdf', recipients: [], enabled: true, usageCount: 15 },
];

const mockNotifications: DistributionNotification[] = [
  { id: '1', type: 'email', title: 'Distribution Completed', message: 'Executive Summary delivered successfully', read: false, createdAt: '2026-07-01T10:00:00Z' },
  { id: '2', type: 'teams', title: 'Delivery Failed', message: 'Compliance Dashboard delivery failed', read: false, createdAt: '2026-07-01T09:30:00Z' },
  { id: '3', type: 'portal', title: 'New Report Available', message: 'Monthly Audit Pack is ready', read: true, createdAt: '2026-06-30T16:00:00Z' },
];

const mockAudit: DistributionAuditEntry[] = [
  { id: '1', type: 'delivery', action: 'Report Delivered', user: 'system', details: 'Executive Summary delivered via email', timestamp: '2026-07-01T10:00:00Z' },
  { id: '2', type: 'recipient', action: 'Recipient Added', user: 'admin', details: 'Added compliance@mapnexus.com to distribution list', timestamp: '2026-06-30T14:00:00Z' },
  { id: '3', type: 'download', action: 'Report Downloaded', user: 'ceo@mapnexus.com', details: 'Downloaded Executive Summary - June 2026', timestamp: '2026-07-01T11:00:00Z' },
  { id: '4', type: 'security', action: 'Token Generated', user: 'system', details: 'Secure download token generated for Compliance Report', timestamp: '2026-07-01T08:00:00Z' },
];

const mockLogs: DistributionLog[] = [
  { id: '1', level: 'info', message: 'Distribution job started', source: 'DistributionEngine', timestamp: '2026-07-01T07:30:00Z' },
  { id: '2', level: 'warning', message: 'Delivery timeout approaching', source: 'DistributionEngine', timestamp: '2026-07-01T07:45:00Z' },
  { id: '3', level: 'error', message: 'Delivery failed: timeout exceeded', source: 'DistributionEngine', timestamp: '2026-07-01T07:50:00Z' },
  { id: '4', level: 'info', message: 'Retry scheduled for failed job', source: 'DistributionEngine', timestamp: '2026-07-01T07:55:00Z' },
];

const mockStatistics: DistributionStatistics = {
  reportsDelivered: 1247,
  pendingDeliveries: 23,
  failedDeliveries: 8,
  deliverySuccessRate: 98.7,
  queueLength: 15,
  averageDeliveryTime: 12.5,
  activeProfiles: 5,
  channelUsage: { email: 450, teams: 320, sharepoint: 180, onedrive: 50, blob: 30, datalake: 20, download: 120, portal: 80, api: 15, webhook: 10, ftp: 5, sftp: 3, servicebus: 2, eventgrid: 1 },
  downloadsByFormat: { html: 350, pdf: 500, excel: 200, csv: 100, json: 50, xml: 30, docx: 20, pptx: 10, png: 5, zip: 3, print: 0 },
  downloadsByChannel: { email: 450, teams: 320, sharepoint: 180, onedrive: 50, blob: 30, datalake: 20, download: 120, portal: 80, api: 15, webhook: 10, ftp: 5, sftp: 3, servicebus: 2, eventgrid: 1 },
  mostDistributedReports: [{ name: 'Executive Summary', count: 150 }, { name: 'Migration Status', count: 120 }, { name: 'Compliance Report', count: 90 }],
  mostDownloadedReports: [{ name: 'Executive Summary', count: 200 }, { name: 'Data Quality Report', count: 150 }, { name: 'Migration Progress', count: 100 }],
  mostUsedExportFormat: 'pdf',
  deliveryPerformance: 98.7,
  topDistributionChannels: [{ channel: 'email', count: 450 }, { channel: 'teams', count: 320 }, { channel: 'sharepoint', count: 180 }],
  topDeliveryProfiles: [{ profile: 'Executive Distribution', count: 300 }, { profile: 'Governance Distribution', count: 200 }, { profile: 'Customer Distribution', count: 150 }],
  averageDownloadTime: 8.5,
  averagePackageSize: 2.5,
};

export const useDistribution = () => {
  const [jobs, setJobs] = useState<DistributionJob[]>(mockJobs);
  const [profiles] = useState<DistributionProfile[]>(mockProfiles);
  const [history] = useState<DistributionHistory[]>(mockHistory);
  const [templates] = useState<DistributionTemplate[]>(mockTemplates);
  const [notifications] = useState<DistributionNotification[]>(mockNotifications);
  const [auditEntries] = useState<DistributionAuditEntry[]>(mockAudit);
  const [logs] = useState<DistributionLog[]>(mockLogs);
  const [statistics] = useState<DistributionStatistics>(mockStatistics);

  const dashboardData: DistributionDashboardData = {
    statistics,
    recentJobs: jobs.slice(0, 5),
    pendingJobs: jobs.filter((j) => j.status === 'pending'),
    failedJobs: jobs.filter((j) => j.status === 'failed'),
  };

  const cancelJob = useCallback((jobId: string) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: 'cancelled' as DistributionStatus } : j)));
  }, []);

  const retryJob = useCallback((jobId: string) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: 'pending' as DistributionStatus, retryCount: j.retryCount + 1 } : j)));
  }, []);

  const getStatusColor = useCallback((status: DistributionStatus): string => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'running': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'cancelled': return '#6b7280';
      case 'scheduled': return '#8b5cf6';
      default: return '#6b7280';
    }
  }, []);

  const getChannelLabel = useCallback((channel: DeliveryChannel): string => {
    const labels: Record<DeliveryChannel, string> = {
      email: 'Email',
      teams: 'Microsoft Teams',
      sharepoint: 'SharePoint',
      onedrive: 'OneDrive',
      blob: 'Azure Blob Storage',
      datalake: 'Azure Data Lake',
      download: 'Download Centre',
      portal: 'Secure Portal',
      api: 'REST API',
      webhook: 'Webhook',
      ftp: 'FTP',
      sftp: 'SFTP',
      servicebus: 'Azure Service Bus',
      eventgrid: 'Event Grid',
    };
    return labels[channel] || channel;
  }, []);

  const getFormatLabel = useCallback((format: ExportFormat): string => {
    return format.toUpperCase();
  }, []);

  return {
    jobs,
    profiles,
    history,
    templates,
    notifications,
    auditEntries,
    logs,
    statistics,
    dashboardData,
    cancelJob,
    retryJob,
    getStatusColor,
    getChannelLabel,
    getFormatLabel,
  };
};
