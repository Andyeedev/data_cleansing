# Semi-Structured Data

**Part of:** 23_Enterprise_Discovery_and_AI_Mapping_Architecture
**Section:** 04_Source_Connector_Architecture / Semi_Structured_Data

---

## Purpose

Connector standards for discovering schema from semi-structured sources. Implements the `Connector` interface (`Connector_Interface.md`).

## Supported Formats

| Format | Detection | Schema Inference |
|--------|-----------|------------------|
| JSON | `.json` / content sniff | Sample documents → inferred field tree |
| XML | `.xml` / `<` root sniff | Element/attribute tree from samples |
| YAML | `.yaml` / `.yml` | Same as JSON (after parse) |

## Inference Strategy

- **Sampling:** Parse a capped sample of N documents/records.
- **Field union:** Build a union of fields across samples; missing-in-some field → `nullable = true`.
- **Type per field:** Most-specific common type across samples; conflicting types → `string` (with `type_conflict = true`).
- **Nesting:** Objects → nested `ColumnRegistry` group; arrays → `array<element>` with element schema.
- **Keys:** Fields ending in `_id` / matching FK patterns are flagged for `Constraint_Analysis.md` relationship hints.

## Format Notes

- **JSON:** Supports JSON Lines (one object per line) and single document; arrays-of-objects at root → table of elements.
- **XML:** Attributes modelled as columns (`@attr`); repeating elements → repeated group; namespaces preserved as prefixes.
- **YAML:** Parsed to same model as JSON; multi-document streams treated like JSON Lines.

## Output

Produces `TableRegistry` + `ColumnRegistry` (with nested groups). Constraint discovery is limited to naming-pattern hints; full PK/FK requires target-side confirmation in `Approval_Workflow.md`.
