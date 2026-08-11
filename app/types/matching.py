from dataclasses import dataclass
from typing import List, Optional


@dataclass
class ColumnComparison:
    source_column: str
    target_column: Optional[str]
    source_type: str
    target_type: Optional[str]
    matched: bool
    match_type: str


@dataclass
class MatchDetails:
    column_similarity: float
    datatype_compatibility: float
    key_match: float
    fk_relationship_match: float
    column_comparisons: List[ColumnComparison]


@dataclass
class TableCandidate:
    source_schema: str
    source_table: str
    target_schema: str
    target_table: str
    confidence: float
    match_reason: str
    details: MatchDetails


@dataclass
class MatchingConfig:
    exact_name_weight: float = 1.0
    suffix_pattern_weight: float = 0.95
    column_name_weight: float = 0.4
    datatype_weight: float = 0.3
    key_match_weight: float = 0.2
    fk_match_weight: float = 0.1
    auto_approve_threshold: float = 90.0
    min_confidence_threshold: float = 40.0


DEFAULT_MATCHING_CONFIG = MatchingConfig()
