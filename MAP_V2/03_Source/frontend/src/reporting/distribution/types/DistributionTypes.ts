export type DistributionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'scheduled';
export type DeliveryChannel = 'email' | 'teams' | 'sharepoint' | 'onedrive' | 'blob' | 'datalake' | 'download' | 'portal' | 'api' | 'webhook' | 'ftp' | 'sftp' | 'servicebus' | 'eventgrid';
export type ExportFormat = 'html' | 'pdf' | 'excel' | 'csv' | 'json' | 'xml' | 'docx' | 'pptx' | 'png' | 'zip' | 'print';
export type NotificationType = 'email' | 'teams' | 'sms' | 'portal';
export type AuditType = 'delivery' | 'recipient' | 'download' | 'security';

export interface DistributionProfile {
  id: string;
  name: string;
  description: string;
  channels: DeliveryChannel[];
  recipients: DistributionRecipient[];
  schedule?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionRecipient {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'group' | 'external';
  channel: DeliveryChannel;
}

export interface DistributionJob {
  id: string;
  reportId: string;
  reportName: string;
  profileId: string;
  profileName: string;
  channel: DeliveryChannel;
  status: DistributionStatus;
  recipient: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
}

export interface DistributionHistory {
  id: string;
  reportName: string;
  recipient: string;
  channel: DeliveryChannel;
  status: DistributionStatus;
  deliveryDate: string;
  runtime: number;
  auditReference: string;
  fileSize?: string;
  format: ExportFormat;
}

export interface DistributionTemplate {
  id: string;
  name: string;
  description: string;
  channels: DeliveryChannel[];
  format: ExportFormat;
  recipients: string[];
  schedule?: string;
  enabled: boolean;
  usageCount: number;
}

export interface DistributionNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DistributionAuditEntry {
  id: string;
  type: AuditType;
  action: string;
  user: string;
  details: string;
  timestamp: string;
}

export interface DistributionLog {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
  timestamp: string;
}

export interface DistributionStatistics {
  reportsDelivered: number;
  pendingDeliveries: number;
  failedDeliveries: number;
  deliverySuccessRate: number;
  queueLength: number;
  averageDeliveryTime: number;
  activeProfiles: number;
  channelUsage: Record<DeliveryChannel, number>;
  downloadsByFormat: Record<ExportFormat, number>;
  downloadsByChannel: Record<DeliveryChannel, number>;
  mostDistributedReports: Array<{ name: string; count: number }>;
  mostDownloadedReports: Array<{ name: string; count: number }>;
  mostUsedExportFormat: ExportFormat;
  deliveryPerformance: number;
  topDistributionChannels: Array<{ channel: DeliveryChannel; count: number }>;
  topDeliveryProfiles: Array<{ profile: string; count: number }>;
  averageDownloadTime: number;
  averagePackageSize: number;
}

export interface DistributionDashboardData {
  statistics: DistributionStatistics;
  recentJobs: DistributionJob[];
  pendingJobs: DistributionJob[];
  failedJobs: DistributionJob[];
}

export interface ExportEngineConfig {
  exportProfiles: ExportProfile[];
  outputProfiles: OutputProfile[];
  packaging: PackagingConfig;
  compression: CompressionConfig;
  encryption: EncryptionConfig;
  digitalSigning: DigitalSigningConfig;
  watermarking: WatermarkingConfig;
  versioning: VersioningConfig;
  downloadTokens: DownloadTokenConfig;
  secureLinks: SecureLinkConfig;
  expiryPolicies: ExpiryPolicy[];
  deliveryPolicies: DeliveryPolicy[];
  retentionPolicies: RetentionPolicy[];
}

export interface ExportProfile {
  id: string;
  name: string;
  format: ExportFormat;
  options: Record<string, unknown>;
}

export interface OutputProfile {
  id: string;
  name: string;
  format: ExportFormat;
  template?: string;
}

export interface PackagingConfig {
  enabled: boolean;
  formats: ExportFormat[];
}

export interface CompressionConfig {
  enabled: boolean;
  algorithm: 'zip' | 'gzip' | '7z';
  level: number;
}

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: string;
  keyLength: number;
}

export interface DigitalSigningConfig {
  enabled: boolean;
  certificateId?: string;
}

export interface WatermarkingConfig {
  enabled: boolean;
  text: string;
  opacity: number;
}

export interface VersioningConfig {
  enabled: boolean;
  maxVersions: number;
}

export interface DownloadTokenConfig {
  enabled: boolean;
  expiryMinutes: number;
  maxDownloads: number;
}

export interface SecureLinkConfig {
  enabled: boolean;
  expiryMinutes: number;
  requireAuth: boolean;
}

export interface ExpiryPolicy {
  id: string;
  name: string;
  expiryMinutes: number;
  action: 'delete' | 'archive' | 'notify';
}

export interface DeliveryPolicy {
  id: string;
  name: string;
  maxRetries: number;
  retryIntervalMinutes: number;
  timeoutMinutes: number;
}

export interface RetentionPolicy {
  id: string;
  name: string;
  retentionDays: number;
  action: 'delete' | 'archive';
}

export interface DistributionWorkspace {
  id: string;
  name: string;
  reports: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DistributionSettings {
  defaultFormat: ExportFormat;
  defaultChannel: DeliveryChannel;
  notifications: {
    email: boolean;
    teams: boolean;
    sms: boolean;
    portal: boolean;
  };
  autoRetry: boolean;
  maxRetries: number;
  retryIntervalMinutes: number;
}
