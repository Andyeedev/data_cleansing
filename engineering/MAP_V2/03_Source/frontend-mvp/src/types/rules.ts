export interface RuleRegistryItem {
  rule_id: string;
  control_id: string | null;
  rule_name: string | null;
  sql_template_file: string | null;
  severity_level: string | null;
  enabled_flag: boolean | null;
  created_at: string | null;
}

export interface RuleRegistryListResponse {
  rules: RuleRegistryItem[];
  total: number;
}

export interface RuleRegistryCreateRequest {
  rule_id: string;
  control_id: string;
  rule_name: string;
  sql_template_file?: string;
  severity_level?: string;
  enabled_flag?: boolean;
}

export interface RuleRegistryUpdateRequest {
  rule_id?: string;
  control_id?: string;
  rule_name?: string;
  sql_template_file?: string;
  severity_level?: string;
  enabled_flag?: boolean;
}
