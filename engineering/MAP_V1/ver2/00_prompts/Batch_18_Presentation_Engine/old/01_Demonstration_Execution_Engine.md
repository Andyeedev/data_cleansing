# Module 01 — Demonstration Execution Engine

**Purpose:** Generate live demonstration data from MAP Pipeline execution
**Input:** PostgreSQL database (migration_engine schema)
**Output:** 02_Dashboard_Data/ JSON files

---

## Execution Steps

### Step 1: Connect to MAP Engine
```bash
cd fs-migration-validation-engine
python -m app.main execute --scenario scenario_3
```

### Step 2: Query Results
```sql
-- Control results
SELECT control_id, status, findings_count 
FROM engine.control_execution 
WHERE batch_id = 'd3f78b07-09f4-4f92-be32-06efd06a5f71';

-- Dataset statistics
SELECT dataset_name, source_rows, target_rows, match_pct
FROM engine.dataset_mapping;
```

### Step 3: Generate JSON
Convert SQL results to JSON format matching 02_Dashboard_Data/ schema.

### Step 4: Validate
Verify all 7 JSON files are valid and consistent.

---

## Output Files

| File | Source Query |
|------|-------------|
| 01_Executive_Overview.json | Aggregated control + dataset results |
| 02_Migration_Overview.json | platform_info + dataset_mapping |
| 03_Validation_Centre.json | control_execution + findings |
| 04_Data_Quality.json | quality_dimensions + trend |
| 05_Risk_Assessment.json | risk_matrix + top_risks |
| 06_Migration_Progress.json | phase_progress + milestones |
| 07_Governance_Centre.json | findings + severity |

---

## Status: COMPLETE ✅

All 7 JSON files generated from live PostgreSQL execution.
