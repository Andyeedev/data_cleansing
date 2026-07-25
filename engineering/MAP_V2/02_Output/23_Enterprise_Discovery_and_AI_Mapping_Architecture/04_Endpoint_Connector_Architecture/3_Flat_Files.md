# Flat Files

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 04_Source_Connector_Architecture / Flat_Files

---

## Purpose

Connector standards for discovering metadata from flat file sources. Implements the `Connector` interface (`Connector_Interface.md`).

## Supported Formats

| Format | Detection | Schema Inference |
|--------|-----------|------------------|
| CSV | `.csv` extension / content sniff | Header row → column names; sample rows → types |
| TSV | `.tsv` / tab delimiter sniff | Same as CSV with tab delimiter |
| Fixed Width | Explicit column spec or layout file | Column offsets from spec; types from sample |
| Excel (`.xlsx` / `.xls`) | Extension + magic bytes | Each sheet → table; header row → columns |

## Inference Rules

- **Delimiter detection:** sniff first N bytes; fall back to comma when ambiguous (flag `delimiter_inferred = true`).
- **Type inference:** per-column, from sampled values — empty-heavy columns default to `string`; numeric/date patterns promote type when consistent ≥ 95% of sample.
- **Header:** if first row parses as non-data (mixed types / all-unique strings), treat as header; otherwise auto-generate `col_1..col_n`.
- **Encoding:** detect BOM / `charset` hint; default UTF-8, flag if mismatch.
- **Quoting / escaping:** honour RFC-4180 quoting; warn on malformed rows (`malformed_row_count`).

## Excel Specifics

- Each worksheet is treated as an independent table (`sheet_name` becomes table name).
- Merged cells are expanded; empty trailing rows/cols trimmed.
- Named ranges and formulas are noted but values are sampled (formulas not evaluated for type inference).

## Output

Produces `TableRegistry` + `ColumnRegistry` entries; constraints are generally absent for flat files (flag `constraint_discovery = unsupported`).
