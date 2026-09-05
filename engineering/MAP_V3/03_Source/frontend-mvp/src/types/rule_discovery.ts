export interface DiscoveredRule {
  rule_id: string;
  rule_name: string | null;
  enabled_flag: boolean;
  dataset_name: string | null;
  mapping_id: string;
  control_id: string | null;
  severity_level: string | null;
  sql_template_file: string | null;
}

export interface DiscoveredRulesResponse {
  project_id: string;
  rules: DiscoveredRule[];
  count: number;
}

export interface DiscoveryMapping {
  mapping_id: string;
  dataset_name: string | null;
  rule_id: string;
  rule_name: string | null;
  sql_template: string | null;
}

export interface DiscoveryMappingsResponse {
  project_id: string;
  mappings: DiscoveryMapping[];
}

export interface DiscoveryStatusResponse {
  project_id: string;
  total_mappings: number;
  rules_discovered: number;
  last_discovery_at: string | null;
}

export interface DiscoveryTriggerResponse {
  status: string;
  message: string;
  project_id: string;
}

export interface DiscoveryTreeNode {
  id: string;
  name: string;
  type: 'control' | 'rule' | 'dataset';
  status: 'active' | 'inactive' | 'critical';
  children?: DiscoveryTreeNode[];
  rule?: DiscoveredRule;
  mapping?: DiscoveryMapping;
}
