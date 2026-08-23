export interface SuiteBatch {
  batch_id: string;
  batch_name: string;
  batch_status: string;
  started_at: string | null;
  ended_at: string | null;
  created_at: string | null;
  duration_seconds: number | null;
}

export interface ControlOutcomeRow {
  control_id: string;
  control_name: string;
  severity: string;
  status: string;
  total_rules: number;
  passed_rules: number;
  failed_rules: number;
  error_rules: number;
  skipped_rules: number;
}

export interface ExecutiveSection {
  controls_summary: { total: number; passed: number; failed: number; error: number; blocked: number };
  readiness_pct: number;
  validation_score: number;
  data_quality_score: number | null;
  blocking_controls: number;
  total_failed_rules: number;
  total_error_rules: number;
  issues_by_severity: { severity: string; controls: number }[];
  recommendation: string;
  next_steps: string[];
  scenario: { entities_mapped: number | null; duration_seconds: number | null };
}

export interface EntityMappingRow {
  source: string;
  target: string;
  source_columns: number;
  target_columns: number;
  match_pct: string;
  status: string;
}

export interface MigrationSection {
  platform: { projects: number; mapped_datasets: number; mapped_columns: number };
  entity_mapping: { entities: EntityMappingRow[]; total: number };
}

export interface ValidationSection {
  distribution: Record<string, number>;
  controls: ControlOutcomeRow[];
}

export interface GovernanceFinding {
  id: string;
  control_id: string;
  rule_id: string | null;
  entity: string | null;
  type: string;
  severity: string;
  owner: string;
  status: string;
  source_value: string | null;
  target_value: string | null;
  delta_value: string | null;
  created_at: string | null;
}

export interface GovernanceOverview {
  total_findings: number;
  open: number;
  critical: number;
  high: number;
  medium: number;
  low?: number;
}

export interface OwnerBreakdown {
  owner: string;
  total: number;
  critical: number;
  high: number;
  medium: number;
}

export interface GovernanceSection {
  overview: GovernanceOverview;
  total: number;
  findings: GovernanceFinding[];
  by_type: { label: string; value: number }[];
  by_owner: OwnerBreakdown[];
}

export interface RiskItem {
  id: string;
  risk: string;
  severity: string;
  impact: string;
  detail: string;
  mitigation: string;
  owner: string;
  status: string;
}

export interface RiskSection {
  decision: string;
  level: string;
  score: number | null;
  reason: string;
  overview: { total_risks: number; critical: number; high: number; medium: number; low?: number };
  minimum_requirements: { label: string; met: boolean }[];
  risks: RiskItem[];
}

export interface QualityDimension {
  name: string;
  score: number | null;
  rating: string;
  assessment: string;
  details: string;
}

export interface QualitySection {
  overall_score: number | null;
  dimensions: QualityDimension[];
  trend: { label: string; value: number | null }[];
  best_dimension: { name: string; score: number } | null;
  worst_dimension: { name: string; score: number } | null;
  analysis: { narrative: string; strengths: string; remediation: string };
}

export interface ReadinessCategory {
  category: string;
  weight: number;
  score: number;
  weighted: number;
  met: boolean;
}

export interface ReadinessSection {
  score: { overall: number; threshold: number; gap: number; ready: boolean };
  categories: ReadinessCategory[];
  verdict_title: string;
  verdict_text: string;
  required_actions: string[];
}

export interface IssuesSection {
  summary: { total: number; open: number; critical: number; high: number; medium: number };
  issues: GovernanceFinding[];
  by_owner: OwnerBreakdown[];
}

export interface ReportSuite {
  has_data: boolean;
  generated_at: string;
  batch: SuiteBatch | null;
  message?: string;
  executive?: ExecutiveSection;
  migration?: MigrationSection;
  validation?: ValidationSection;
  governance?: GovernanceSection;
  risk?: RiskSection;
  quality?: QualitySection;
  readiness?: ReadinessSection;
  issues?: IssuesSection;
}
