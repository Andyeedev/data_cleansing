export interface ControlItem {
  control_id: string;
  control_name: string | null;
  description: string | null;
  severity_level: string | null;
  enabled_flag: boolean;
  created_at: string | null;
  project_id: string | null;
}

export interface ControlsResponse {
  controls: ControlItem[];
  total: number;
}

export interface ControlDependency {
  control_id: string;
  depends_on_control_id: string;
  project_id: string | null;
  created_at: string | null;
}

export interface DependencyTree {
  chains: string[][];
  standalone: string[];
  control_status: Record<string, boolean>;
}

export interface ControlDependencyResponse {
  dependencies: ControlDependency[];
  tree: DependencyTree;
  total: number;
}

export interface ExecutionOutcomeSummary {
  passed: number;
  attention: number;
  critical: number;
  disabled: number;
  skipped: number;
  total_executed: number;
  total_controls: number;
}

export interface ControlOutcome {
  control_id: string;
  overall_status: string;
  total_rules: number;
  passed_rules: number;
  failed_rules: number;
  error_rules: number;
  skipped_rules: number;
}

export interface ExecutionOutcomesResponse {
  summary: ExecutionOutcomeSummary;
  controls: ControlOutcome[];
}
