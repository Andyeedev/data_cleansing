export interface ValidationDashboardSummary {
  total_batches: number;
  compliance_rate: number;
  passed: number;
  failed: number;
  running: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
  unscored_count: number;
}

export interface RiskDistribution {
  high: number;
  medium: number;
  low: number;
}

export interface ActiveRun {
  batch_id: string;
  status: string;
  started_at: string;
  project_id: string;
}

export interface Alert {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  timestamp: string;
  batch_id: string;
}

export interface RecentBatch {
  batch_id: string;
  project_id: string;
  batch_status: string;
  total_controls: number;
  completed_controls: number;
  failed_controls: number;
  batch_start_time: string;
  batch_end_time: string;
}

export interface ValidationDashboard {
  summary: ValidationDashboardSummary;
  risk_distribution: RiskDistribution;
  active_runs: ActiveRun[];
  alerts: Alert[];
  recent_batches: RecentBatch[];
}

export interface ValidationReport {
  batch_id: string;
  project_id: string | null;
  overall_status: string;
  overall_score: number;
  total_controls: number;
  completed_controls: number;
  failed_controls: number;
  control_summaries: ControlSummary[];
  started_at: string | null;
  completed_at: string | null;
}

export interface ControlSummary {
  control_id: string;
  overall_status: string;
  total_rules: number;
  passed_rules: number;
  failed_rules: number;
  error_rules: number;
}

export interface GovernanceDecision {
  batch_id: string;
  project_id: string | null;
  migration_status: string;
  blocking_controls: number;
  total_failed_rules: number;
  decision_time: string | null;
}

export interface RiskScore {
  batch_id: string;
  risk_score: number;
  risk_level: string;
  calculated_at: string | null;
}

export interface ComplianceCheck {
  batch_id: string;
  total_exceptions: number;
  critical_exceptions: number;
  high_exceptions: number;
  medium_exceptions: number;
  low_exceptions: number;
  exceptions: Exception[];
}

export interface Exception {
  exception_id: string;
  batch_id: string;
  control_id: string;
  rule_id: string;
  entity_name: string;
  source_value: string;
  target_value: string;
  delta_value: number | null;
  cause: string;
  failure_scope: string;
  created_at: string | null;
}

export interface ExecutionHistoryItem {
  batch_id: string;
  batch_name?: string | null;
  project_id: string;
  batch_status: string;
  total_controls: number;
  completed_controls: number;
  failed_controls: number;
  batch_start_time: string;
  batch_end_time: string;
}
