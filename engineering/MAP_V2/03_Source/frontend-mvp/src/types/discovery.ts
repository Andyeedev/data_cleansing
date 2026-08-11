export interface SchemaNode {
  id: string;
  name: string;
  type: 'system' | 'schema' | 'table' | 'column';
  parent_id: string | null;
  status: 'matched' | 'unmatched_source' | 'unmatched_target' | 'unmatched' | 'modified';
  database_type?: string;
  target_table?: string;
  mapped_from_table?: string;
  confidence?: number;
  columns?: SchemaNode[];
  data_type?: string;
  is_nullable?: boolean;
  is_primary_key?: boolean;
}

export interface ColumnDiff {
  column_name: string;
  source_type: string;
  target_type: string;
  status: 'match' | 'type_change' | 'source_only' | 'target_only';
  is_primary_key?: boolean;
}

export interface DiscoveryTableRow {
  source_table: string;
  target_table: string | null;
  mapped_from_table?: string;
  schema_name?: string;
  system_name?: string;
  status: 'matched' | 'unmatched_source' | 'unmatched_target' | 'unmatched' | 'modified';
  confidence?: number;
  column_diff?: ColumnDiff[];
}

export interface DiscoverySummary {
  total_systems: number;
  total_schemas: number;
  total_tables: number;
  matched_tables: number;
  match_rate_percent: number;
}
