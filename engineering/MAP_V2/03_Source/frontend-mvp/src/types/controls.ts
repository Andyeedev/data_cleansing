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
