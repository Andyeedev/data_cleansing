export interface OperationsMetrics {
  runningExecutions: number;
  queuedJobs: number;
  completedToday: number;
  failedToday: number;
  averageRuntime: string;
  executionSuccessRate: number;
  runningControls: number;
  completedControls: number;
  failedControls: number;
  retryControls: number;
  pausedControls: number;
  waitingControls: number;
  rulesExecuted: number;
  controlsExecuted: number;
  passRate: number;
  failureRate: number;
  warningCount: number;
  exceptionCount: number;
  datasetsProcessed: number;
  datasetsPending: number;
  datasetsFailed: number;
  datasetThroughput: number;
  largestDataset: string;
  averageProcessingTime: string;
  upcomingExecutions: number;
  recurringSchedules: number;
  completedJobs: number;
  failedJobs: number;
  cancelledJobs: number;
  criticalAlerts: number;
  warnings: number;
  executionTimeouts: number;
  dependencyFailures: number;
  validationErrors: number;
  infrastructureAlerts: number;
  retryQueue: number;
  automaticRetries: number;
  manualRetries: number;
  retrySuccess: number;
  retryFailure: number;
  apiStatus: 'healthy' | 'degraded' | 'down';
  databaseStatus: 'healthy' | 'degraded' | 'down';
  queueStatus: 'healthy' | 'degraded' | 'down';
  aiStatus: 'healthy' | 'degraded' | 'down';
  aiRecommendation: string;
}

export const defaultOperationsMetrics: OperationsMetrics = {
  runningExecutions: 12,
  queuedJobs: 18,
  completedToday: 147,
  failedToday: 3,
  averageRuntime: '2m 34s',
  executionSuccessRate: 99.4,
  runningControls: 8,
  completedControls: 142,
  failedControls: 2,
  retryControls: 3,
  pausedControls: 1,
  waitingControls: 5,
  rulesExecuted: 1842,
  controlsExecuted: 1842,
  passRate: 99.4,
  failureRate: 0.6,
  warningCount: 14,
  exceptionCount: 3,
  datasetsProcessed: 847,
  datasetsPending: 23,
  datasetsFailed: 2,
  datasetThroughput: 45,
  largestDataset: '2.4 GB',
  averageProcessingTime: '4m 12s',
  upcomingExecutions: 24,
  recurringSchedules: 8,
  completedJobs: 147,
  failedJobs: 3,
  cancelledJobs: 1,
  criticalAlerts: 1,
  warnings: 5,
  executionTimeouts: 1,
  dependencyFailures: 0,
  validationErrors: 2,
  infrastructureAlerts: 0,
  retryQueue: 5,
  automaticRetries: 3,
  manualRetries: 2,
  retrySuccess: 12,
  retryFailure: 1,
  apiStatus: 'healthy',
  databaseStatus: 'healthy',
  queueStatus: 'healthy',
  aiStatus: 'healthy',
  aiRecommendation: 'Investigate repeated failures for Customer Migration Batch 17.',
};
