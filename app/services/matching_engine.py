import re
from typing import List, Optional
from app.types.matching import (
  TableCandidate,
  MatchDetails,
  ColumnComparison,
  MatchingConfig,
  DEFAULT_MATCHING_CONFIG,
)


class MatchingEngine:
  def __init__(self, config: MatchingConfig = DEFAULT_MATCHING_CONFIG):
    self.config = config

  def find_candidates(
    self,
    source_tables: List[dict],
    target_tables: List[dict],
    source_columns: dict,
    target_columns: dict,
  ) -> List[TableCandidate]:
    candidates = []

    for src in source_tables:
      src_name = src.get("table_name", "")
      src_schema = src.get("schema_name", "")
      src_cols = source_columns.get(f"{src_schema}.{src_name}", [])

      for tgt in target_tables:
        tgt_name = tgt.get("table_name", "")
        tgt_schema = tgt.get("schema_name", "")
        tgt_cols = target_columns.get(f"{tgt_schema}.{tgt_name}", [])

        candidate = self._evaluate_match(
          src_schema, src_name, src_cols,
          tgt_schema, tgt_name, tgt_cols,
        )

        if candidate.confidence >= self.config.min_confidence_threshold:
          candidates.append(candidate)

    candidates.sort(key=lambda c: c.confidence, reverse=True)
    return candidates

  def _evaluate_match(
    self,
    src_schema: str,
    src_name: str,
    src_cols: list,
    tgt_schema: str,
    tgt_name: str,
    tgt_cols: list,
  ) -> TableCandidate:
    confidence = 0.0
    reasons = []

    name_score = self._match_table_names(src_name, tgt_name)
    if name_score >= self.config.exact_name_weight:
      confidence = max(confidence, name_score * 100)
      reasons.append(f"Exact name match: {src_name}")
    elif name_score >= self.config.suffix_pattern_weight:
      confidence = max(confidence, name_score * 100)
      reasons.append(f"Suffix pattern match: {src_name} -> {tgt_name}")

    column_sim = self._calc_column_similarity(src_cols, tgt_cols)
    datatype_compat = self._calc_datatype_compatibility(src_cols, tgt_cols)
    key_match = self._calc_key_match(src_cols, tgt_cols)
    fk_match = self._calc_fk_match(src_cols, tgt_cols)

    column_based_confidence = (
      column_sim * self.config.column_name_weight +
      datatype_compat * self.config.datatype_weight +
      key_match * self.config.key_match_weight +
      fk_match * self.config.fk_match_weight
    ) * 100

    if column_based_confidence > confidence:
      confidence = column_based_confidence
      if column_sim > 0.7:
        reasons.append(f"High column similarity: {column_sim:.0%}")
      if datatype_compat > 0.8:
        reasons.append(f"Data types compatible: {datatype_compat:.0%}")
      if key_match > 0.5:
        reasons.append("Primary key match found")

    column_comparisons = self._compare_columns(src_cols, tgt_cols)

    details = MatchDetails(
      column_similarity=column_sim,
      datatype_compatibility=datatype_compat,
      key_match=key_match,
      fk_relationship_match=fk_match,
      column_comparisons=column_comparisons,
    )

    return TableCandidate(
      source_schema=src_schema,
      source_table=src_name,
      target_schema=tgt_schema,
      target_table=tgt_name,
      confidence=round(confidence, 1),
      match_reason="; ".join(reasons) if reasons else "No significant match",
      details=details,
    )

  def _match_table_names(self, src: str, tgt: str) -> float:
    if src == tgt:
      return self.config.exact_name_weight

    src_base = src.replace("_source", "").replace("_src", "").lower().strip("_")
    tgt_base = tgt.replace("_target", "").replace("_tgt", "").lower().strip("_")

    if src_base == tgt_base:
      return self.config.suffix_pattern_weight

    if src in tgt or tgt in src:
      return 0.7

    src_normalized = re.sub(r'[^a-z0-9]', '', src.lower())
    tgt_normalized = re.sub(r'[^a-z0-9]', '', tgt.lower())

    if src_normalized == tgt_normalized:
      return 0.85

    return 0.0

  def _calc_column_similarity(self, src_cols: list, tgt_cols: list) -> float:
    if not src_cols or not tgt_cols:
      return 0.0

    src_names = {self._normalize_col_name(c.get("column_name", c[0] if isinstance(c, tuple) else c)) for c in src_cols}
    tgt_names = {self._normalize_col_name(c.get("column_name", c[0] if isinstance(c, tuple) else c)) for c in tgt_cols}

    if not src_names or not tgt_names:
      return 0.0

    intersection = src_names & tgt_names
    union = src_names | tgt_names

    return len(intersection) / len(union) if union else 0.0

  def _calc_datatype_compatibility(self, src_cols: list, tgt_cols: list) -> float:
    if not src_cols or not tgt_cols:
      return 0.0

    src_types = {}
    for c in src_cols:
      name = c.get("column_name", c[0] if isinstance(c, tuple) else c)
      dtype = c.get("data_type", c[2] if isinstance(c, tuple) and len(c) > 2 else "unknown")
      src_types[self._normalize_col_name(name)] = dtype

    tgt_types = {}
    for c in tgt_cols:
      name = c.get("column_name", c[0] if isinstance(c, tuple) else c)
      dtype = c.get("data_type", c[2] if isinstance(c, tuple) and len(c) > 2 else "unknown")
      tgt_types[self._normalize_col_name(name)] = dtype

    common_cols = set(src_types.keys()) & set(tgt_types.keys())
    if not common_cols:
      return 0.0

    compatible = sum(1 for col in common_cols if self._types_compatible(src_types[col], tgt_types[col]))
    return compatible / len(common_cols)

  def _calc_key_match(self, src_cols: list, tgt_cols: list) -> float:
    src_keys = {c.get("column_name", c[0] if isinstance(c, tuple) else c): c.get("data_type", c[2] if isinstance(c, tuple) and len(c) > 2 else "unknown") for c in src_cols if c.get("is_primary_key", False)}
    tgt_keys = {c.get("column_name", c[0] if isinstance(c, tuple) else c): c.get("data_type", c[2] if isinstance(c, tuple) and len(c) > 2 else "unknown") for c in tgt_cols if c.get("is_primary_key", False)}

    if not src_keys or not tgt_keys:
      return 0.0

    src_normalized = {self._normalize_col_name(k): v for k, v in src_keys.items()}
    tgt_normalized = {self._normalize_col_name(k): v for k, v in tgt_keys.items()}

    name_matches = set(src_normalized.keys()) & set(tgt_normalized.keys())
    type_matches = sum(1 for k in name_matches if self._types_compatible(src_normalized[k], tgt_normalized[k]))

    if type_matches > 0:
      return type_matches / max(len(src_normalized), len(tgt_normalized))

    if len(src_keys) > 0 and len(tgt_keys) > 0:
      src_types = set(src_keys.values())
      tgt_types = set(tgt_keys.values())
      if src_types & tgt_types:
        return 0.5

    return 0.0

  def _calc_fk_match(self, src_cols: list, tgt_cols: list) -> float:
    src_fks = {c.get("column_name", c[0] if isinstance(c, tuple) else c) for c in src_cols if c.get("is_foreign_key", False)}
    tgt_fks = {c.get("column_name", c[0] if isinstance(c, tuple) else c) for c in tgt_cols if c.get("is_foreign_key", False)}

    if not src_fks or not tgt_fks:
      return 0.0

    src_normalized = {self._normalize_col_name(k) for k in src_fks}
    tgt_normalized = {self._normalize_col_name(k) for k in tgt_fks}

    intersection = src_normalized & tgt_normalized
    return len(intersection) / max(len(src_normalized), len(tgt_normalized))

  def _compare_columns(self, src_cols: list, tgt_cols: list) -> List[ColumnComparison]:
    comparisons = []
    tgt_matched = set()

    for src in src_cols:
      src_name = src.get("column_name", src[0] if isinstance(src, tuple) else src)
      src_type = src.get("data_type", src[2] if isinstance(src, tuple) and len(src) > 2 else "unknown")

      best_match = None
      best_type = None
      match_type = "none"

      for i, tgt in enumerate(tgt_cols):
        if i in tgt_matched:
          continue

        tgt_name = tgt.get("column_name", tgt[0] if isinstance(tgt, tuple) else tgt)
        tgt_type = tgt.get("data_type", tgt[2] if isinstance(tgt, tuple) and len(tgt) > 2 else "unknown")

        if self._normalize_col_name(src_name) == self._normalize_col_name(tgt_name):
          best_match = tgt_name
          best_type = tgt_type
          match_type = "exact"
          tgt_matched.add(i)
          break

      comparisons.append(ColumnComparison(
        source_column=src_name,
        target_column=best_match,
        source_type=src_type,
        target_type=best_type,
        matched=best_match is not None,
        match_type=match_type,
      ))

    return comparisons

  @staticmethod
  def _normalize_col_name(name: str) -> str:
    return re.sub(r'[^a-z0-9]', '', name.lower())

  @staticmethod
  def _types_compatible(type1: str, type2: str) -> bool:
    t1 = type1.lower()
    t2 = type2.lower()

    if t1 == t2:
      return True

    numeric_types = {'int', 'integer', 'bigint', 'smallint', 'tinyint', 'decimal', 'numeric', 'float', 'real', 'money'}
    string_types = {'varchar', 'nvarchar', 'char', 'nchar', 'text', 'string'}
    date_types = {'date', 'datetime', 'datetime2', 'smalldatetime', 'time'}

    if t1 in numeric_types and t2 in numeric_types:
      return True
    if t1 in string_types and t2 in string_types:
      return True
    if t1 in date_types and t2 in date_types:
      return True

    return False
