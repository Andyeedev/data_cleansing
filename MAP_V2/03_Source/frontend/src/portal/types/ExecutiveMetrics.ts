export interface ExecutiveMetrics {
  migrationHealth: number;
  programmeStatus: string;
  projects: number;
  datasets: number;
  rulesExecuted: number;
  controlsPassed: number;
  controlsExecuted: number;
  failures: number;
  warnings: number;
  exceptions: number;
  auditFindings: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  overallRiskScore: number;
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  completionPercentage: number;
  confidenceScore: number;
  aiSummary: string;
}

export const defaultExecutiveMetrics: ExecutiveMetrics = {
  migrationHealth: 96,
  programmeStatus: 'On Track',
  projects: 12,
  datasets: 847,
  rulesExecuted: 1842,
  controlsPassed: 99.6,
  controlsExecuted: 1842,
  failures: 2,
  warnings: 14,
  exceptions: 3,
  auditFindings: 7,
  criticalRisks: 1,
  highRisks: 3,
  mediumRisks: 8,
  lowRisks: 11,
  overallRiskScore: 42,
  overallRiskLevel: 'medium',
  completionPercentage: 78,
  confidenceScore: 94,
  aiSummary:
    'Migration progressing normally. Validation success is above target at 99.6%. No critical issues detected. One project requires attention due to increased warning volume. Overall confidence score remains high at 94%.',
};
