export type ReportCategory =
  | 'executive'
  | 'migration'
  | 'validation'
  | 'governance'
  | 'risk'
  | 'security'
  | 'administration'
  | 'audit'
  | 'ai';

export type ReportStatus = 'available' | 'generating' | 'completed' | 'failed' | 'scheduled';

export type ReportFormat = 'html' | 'pdf' | 'excel' | 'csv' | 'json' | 'powerpoint' | 'word';

export interface ReportItem {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  format: ReportFormat[];
  owner: string;
  createdAt: string;
  updatedAt: string;
  lastGenerated?: string;
  nextScheduled?: string;
  isFavourite: boolean;
  isShared: boolean;
  tags: string[];
}

export interface ReportSchedule {
  id: string;
  reportId: string;
  reportName: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  nextRun: string;
  lastRun: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  recipients: string[];
}

export interface ReportQueueItem {
  id: string;
  reportName: string;
  status: 'running' | 'pending' | 'failed' | 'completed';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  progress?: number;
}

export interface ReportHistoryEntry {
  id: string;
  reportName: string;
  action: 'generated' | 'downloaded' | 'shared' | 'exported';
  timestamp: string;
  user: string;
  format?: ReportFormat;
}

export interface ReportFilters {
  search: string;
  category: ReportCategory | 'all';
  status: ReportStatus | 'all';
  owner: string;
  dateFrom: string;
  dateTo: string;
  isFavourite: boolean;
  isScheduled: boolean;
  tags: string[];
}

export interface ReportCentreMetrics {
  totalReports: number;
  recentlyGenerated: number;
  favouriteReports: number;
  scheduledReports: number;
  pendingReports: number;
  failedReports: number;
}
