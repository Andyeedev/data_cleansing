export interface MigrationMetrics {
  activeProjects: number;
  runningExecutions: number;
  completedMigrations: number;
  failedExecutions: number;
  successRate: number;
  migrationHealth: number;
  totalDatasets: number;
  mappedDatasets: number;
  pendingMappings: number;
  totalRules: number;
  passedRules: number;
  failedRules: number;
  scheduledJobs: number;
  upcomingExecutions: number;
  completedToday: number;
  failedToday: number;
}

export const defaultMigrationMetrics: MigrationMetrics = {
  activeProjects: 8,
  runningExecutions: 5,
  completedMigrations: 234,
  failedExecutions: 3,
  successRate: 98.7,
  migrationHealth: 95,
  totalDatasets: 156,
  mappedDatasets: 142,
  pendingMappings: 14,
  totalRules: 487,
  passedRules: 479,
  failedRules: 8,
  scheduledJobs: 12,
  upcomingExecutions: 6,
  completedToday: 18,
  failedToday: 1,
};
