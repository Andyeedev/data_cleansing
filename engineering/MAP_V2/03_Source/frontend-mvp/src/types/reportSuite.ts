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

export interface OperationalPhase {
  phase: string;
  status: string;
  progress: number;
}

export interface OperationalBatch {
  batch_id: string;
  batch_name: string;
  status: string;
  total_controls: number;
  completed_controls: number;
  failed_controls: number;
  duration_seconds: number | null;
  started_at: string;
  ended_at: string;
  created_at: string;
}

export interface OperationalControl {
  control_id: string;
  control_name: string;
  severity: string;
  enabled: boolean;
  status: string;
  total_rules: number;
  passed_rules: number;
  failed_rules: number;
  error_rules: number;
}

export interface OperationalSection {
  overview: { total_batches: number; completed: number; running: number; failed: number; pending: number };
  phases: OperationalPhase[];
  batches: OperationalBatch[];
  control_status: OperationalControl[];
}

export interface MigrationPackEntity {
  source_schema: string;
  source_table: string;
  target_schema: string;
  target_table: string;
  source_columns: number;
  target_columns: number;
  matched_columns: number;
  match_pct: string;
  status: string;
}

export interface MigrationPackColumn {
  source_table: string;
  target_table: string;
  match_status: string;
  confidence: number | null;
}

export interface MigrationPackSection {
  overview: { total_projects: number; total_entities: number; total_source_columns: number; total_target_columns: number; overall_match_pct: number };
  projects: { id: string; name: string; type: string; status: string }[];
  entities: MigrationPackEntity[];
  entity_summary: { passed: number; attention: number; failed: number };
  column_mappings: MigrationPackColumn[];
  column_summary: { total: number; auto_matched: number; manual_review: number };
}

export interface ValidationPackControl {
  control_id: string;
  control_name: string;
  severity: string;
  status: string;
  total_rules: number;
  passed_rules: number;
  failed_rules: number;
  error_rules: number;
  skipped_rules: number;
  pass_rate: number;
}

export interface ValidationPackSection {
  overview: { total_controls: number; passed: number; failed: number; error: number; blocked: number; skipped: number; pass_rate: number };
  rules_summary: { total_rules: number; passed_rules: number; failed_rules: number; error_rules: number; skipped_rules: number };
  controls: ValidationPackControl[];
  analysis: string;
}

export interface GovernancePackFinding {
  control_id: string;
  control_name: string;
  entity_name: string;
  rule_id: string;
  type: string;
  owner: string;
  severity: string;
  source_value: string;
  target_value: string;
  variance_value: string;
  status: string;
}

export interface GovernancePackSection {
  overview: { total_findings: number; critical: number; high: number; medium: number; low: number };
  findings: GovernancePackFinding[];
  severity_distribution: Record<string, number>;
  type_distribution: Record<string, number>;
  ownership_distribution: Record<string, number>;
  analysis: string;
}

export interface AuditPackTrail {
  batch_id: string;
  batch_name: string;
  status: string;
  total_controls: number;
  completed_controls: number;
  failed_controls: number;
  duration: string;
  created_at: string;
}

export interface AuditPackSection {
  overview: { total_batches: number; completed_batches: number; failed_batches: number; compliance_pct: number; total_controls_executed: number; passed_controls: number; failed_controls: number; error_controls: number };
  audit_trail: AuditPackTrail[];
  batch_status_distribution: Record<string, number>;
  severity_findings: Record<string, number>;
  analysis: string;
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
  operational?: OperationalSection;
  migration_pack?: MigrationPackSection;
  validation_pack?: ValidationPackSection;
  governance_pack?: GovernancePackSection;
  audit_pack?: AuditPackSection;
}
