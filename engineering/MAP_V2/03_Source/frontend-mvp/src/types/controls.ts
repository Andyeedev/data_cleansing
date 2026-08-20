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
