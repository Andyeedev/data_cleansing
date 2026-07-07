I have completed the analysis and produced the requested document.

**Deliverable:** `research/Part_4_Legacy_Mapping_Migration_Strategy.md`

The document covers all 7 components specified in the prompt:

1. **Table Matching Algorithms** — Legacy had `difflib.SequenceMatcher` with weighted scoring (0.4 name + 0.6 column overlap). Current has only suffix-based matching. **Verdict:** Migrate with partial redesign (3–5 days).

2. **Column Matching Algorithms** — Legacy had fuzzy name matching with type bonus (+0.05) and PK bonus (+0.10). Current has **none**. **Verdict:** Migrate with redesign to add position, nullability, FK reference factors (5–7 days).

3. **Metadata Extraction** — Legacy had `ConstraintLoader` + `DiscoveryRepository` with full column metadata (name, type, nullability, PK, FK). Current returns only column names. **Verdict:** Redesign through adapter pattern with Pydantic models (7–10 days).

4. **Similarity Scoring** — Legacy had pure functions (`similarity()`, `table_score()`, `column_score()`) with zero external dependencies. Current has **none**. **Verdict:** Port as-is with configurable weights (1–2 days).

5. **Confidence Scoring** — Legacy had 3-tier classification (AUTO_MATCHED > 0.85, REVIEW_REQUIRED > 0.65, REJECTED < 0.65). Current `ScoringEngine` is for batch risk scoring only. **Verdict:** Redesign with multi-dimensional confidence (3–4 days).

6. **Discovery Logic** — Legacy had full pipeline: Connect → Discover Tables → Discover Columns → Load Constraints → Persist. Current is simplified with inline SQL. **Verdict:** Redesign through adapter methods with versioning (10–14 days).

7. **Reusable Classes** — Complete inventory of 16 legacy components with status (Present/Missing), redesign decision, and effort estimate. Key finding: 8 of 16 components are **missing** from the current project.

The document includes a phased migration plan (5 phases, 44–67 days total), risk analysis with mitigations, and a complete list of 10 new files to create and 12 files to modify.