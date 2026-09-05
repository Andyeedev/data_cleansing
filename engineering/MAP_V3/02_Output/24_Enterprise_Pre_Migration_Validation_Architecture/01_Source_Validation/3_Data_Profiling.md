# Data Profiling

**Part of:** 24_Enterprise_Pre_Migration_Validation_Architecture
**Section:** 01_Source_Validation / 3_Data_Profiling

---

## Purpose

Generate column-level statistical profiles that inform mapping confidence, transformation logic, and target schema design.

## Profile Attributes

| Attribute | Description |
|-----------|-------------|
| `row_count` | Total rows |
| `null_count` / `null_pct` | Null frequency |
| `distinct_count` | Cardinality |
| `min` / `max` | Value bounds (numeric, temporal) |
| `mean` / `median` / `stddev` | Distribution shape |
| `top_values` | Most frequent values |
| `format_patterns` | Detected format strings (dates, emails, phones) |
| `length_min` / `length_max` | String length range |

## Sampling Strategy

- Full scan for small tables (< 1M rows).
- Statistical sampling (≥ 10K rows) for large tables with stratification.
- Dedicated scan for high-cardinality or skewed columns.

## Integration

- Feeds AI mapping confidence (Doc 23, 02_AI_Machine_Learning).
- Profiles stored in the metadata contract (Doc 21) alongside column definitions.
- Supports target capacity planning and column-type mapping decisions.
