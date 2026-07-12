export interface ReportDefinition {
  id: string;
  name: string;
  category: 'executive' | 'operational' | 'migration' | 'validation' | 'governance' | 'audit' | 'regulatory' | 'scheduled';
  type: 'standard' | 'custom' | 'scheduled' | 'template';
  status: 'available' | 'generating' | 'completed' | 'failed' | 'scheduled';
  format: 'pdf' | 'html' | 'excel' | 'csv' | 'json' | 'powerpoint' | 'word';
  lastGenerated?: string;
  nextScheduled?: string;
  owner: string;
  description: string;
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

export interface ReportTemplate {
  id: string;
  name: string;
  category: 'standard' | 'executive' | 'audit' | 'governance' | 'custom';
  description: string;
  format: string;
  lastUpdated: string;
  usageCount: number;
}

export interface ReportingMetrics {
  reportsGenerated: number;
  scheduledReports: number;
  failedReports: number;
  pendingReports: number;
  reportUsage: number;
  exportActivity: number;
  aiReportSummary: string;
  generationTrend: number[];
  usageTrend: number[];
  categoryBreakdown: Record<string, number>;
}
