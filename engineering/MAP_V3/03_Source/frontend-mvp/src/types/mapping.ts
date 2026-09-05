export interface MappingRow {
  column_mapping_id: string;
  mapping_id: string;
  source_column: string;
  source_data_type: string;
  target_column: string | null;
  target_data_type: string | null;
  match_status: 'AUTO_MATCHED' | 'MANUAL' | 'REVIEW_REQUIRED' | 'UNMAPPED';
  confidence_score: number | null;
  match_reason: string | null;
  source_table: string;
  target_table: string | null;
  source_schema: string;
  target_schema: string | null;
  source_system: string;
  transformation?: string | null;
}

export interface MappingSummary {
  tables_mapped: number;
  columns_mapped: number;
  match_rate_percent: number;
  auto_matched: number;
  manual_matched: number;
  review_needed: number;
}

export interface MappingSchemaEntry {
  table_name: string;
  schema_name: string;
  system_name: string;
  system_id: string;
}

export type TransformType = 'none' | 'lowercase' | 'uppercase' | 'trim' | 'cast' | 'map' | 'concat' | 'split' | 'custom';

export const TRANSFORM_OPTIONS: { value: TransformType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'lowercase', label: 'Lowercase' },
  { value: 'uppercase', label: 'Uppercase' },
  { value: 'trim', label: 'Trim' },
  { value: 'cast', label: 'Cast' },
  { value: 'map', label: 'Map' },
  { value: 'concat', label: 'Concat' },
  { value: 'split', label: 'Split' },
  { value: 'custom', label: 'Custom' },
];
