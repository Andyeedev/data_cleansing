export interface TableCandidate {
  source_schema: string;
  source_table: string;
  target_schema: string;
  target_table: string;
  confidence: number;
  match_reason: string;
  details: MatchDetails;
}

export interface MatchDetails {
  column_similarity: number;
  datatype_compatibility: number;
  key_match: number;
  fk_relationship_match: number;
  column_comparisons: ColumnComparison[];
}

export interface ColumnComparison {
  source_column: string;
  target_column: string | null;
  source_type: string;
  target_type: string | null;
  matched: boolean;
  match_type: 'exact' | 'name' | 'type' | 'none';
}

export interface MatchingConfig {
  exact_name_weight: number;
  suffix_pattern_weight: number;
  column_name_weight: number;
  datatype_weight: number;
  key_match_weight: number;
  fk_match_weight: number;
  auto_approve_threshold: number;
  min_confidence_threshold: number;
}

export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  exact_name_weight: 1.0,
  suffix_pattern_weight: 0.95,
  column_name_weight: 0.4,
  datatype_weight: 0.3,
  key_match_weight: 0.2,
  fk_match_weight: 0.1,
  auto_approve_threshold: 90,
  min_confidence_threshold: 50,
};
