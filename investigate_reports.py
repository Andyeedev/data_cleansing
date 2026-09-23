"""MAP Nexus Reports - Root Cause Investigation Script for 5 Issues"""
import psycopg2
import json
from pprint import pprint

conn = psycopg2.connect(host='localhost', port=5432, dbname='migration_engine', user='postgres', password='dev123456')
cur = conn.cursor()

TENANT_E2E = '74dff1e4-7684-4fe7-8e38-915627120c8a'
BATCH = '0e9e0197-3d54-4273-ad79-cec612318d2a'

def query(sql, params=None):
    cur.execute(sql, params)
    cols = [d[0] for d in cur.description]
    rows = cur.fetchall()
    return [dict(zip(cols, r)) for r in rows]

def query_one(sql, params=None):
    rows = query(sql, params)
    return rows[0] if rows else None

def section(title):
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}")

# ============================================================
# ISSUE 1: Operational - Control Execution Status empty
# ============================================================
section("ISSUE 1: Operational - Control Execution Status Empty")

print("\n--- 1a. Batch resolution for tenant ---")
batch = query_one("SELECT * FROM engine.migration_batch_registry WHERE tenant_id = %s ORDER BY created_at DESC LIMIT 5", (TENANT_E2E,))
print(f"Latest batch for E2E tenant: {batch}")

all_batches = query("SELECT batch_id, tenant_id, batch_name, batch_status, created_at FROM engine.migration_batch_registry WHERE tenant_id = %s ORDER BY created_at DESC", (TENANT_E2E,))
print(f"\nAll batches for E2E tenant ({len(all_batches)}):")
for b in all_batches:
    print(f"  {b['batch_id']} | {b['batch_name']} | {b['batch_status']} | {b['created_at']}")

print("\n--- 1b. Check control_summary for the specific batch ---")
cs = query("SELECT * FROM engine.migration_control_summary WHERE batch_id = %s", (BATCH,))
print(f"Control summary rows for batch {BATCH}: {len(cs)}")
for c in cs:
    print(f"  {c.get('control_id')} | {c.get('overall_status')} | total={c.get('total_rules')} passed={c.get('passed_rules')} failed={c.get('failed_rules')}")

print("\n--- 1c. Check ALL control_summary for E2E tenant (across all batches) ---")
cs_all = query("""
    SELECT cs.*, mbr.tenant_id FROM engine.migration_control_summary cs
    JOIN engine.migration_batch_registry mbr ON cs.batch_id = mbr.batch_id
    WHERE mbr.tenant_id = %s
    ORDER BY cs.created_at DESC
""", (TENANT_E2E,))
print(f"Control summary rows across all batches for E2E tenant: {len(cs_all)}")
for c in cs_all[:10]:
    print(f"  batch={c.get('batch_id')} | {c.get('control_id')} | {c.get('overall_status')}")

print("\n--- 1d. Check control_registry for E2E tenant ---")
cr = query("SELECT * FROM engine.control_registry WHERE tenant_id = %s", (TENANT_E2E,))
print(f"Control registry entries for E2E tenant: {len(cr)}")
for c in cr:
    print(f"  {c.get('control_id')} | {c.get('control_name')} | enabled={c.get('enabled_flag')}")

print("\n--- 1e. Check what _build_operational actually queries ---")
# The code does: LEFT JOIN on cs ON c.control_id = cs.control_id AND cs.batch_id = <batch>
# using batches[0].get('batch_id') - the FIRST batch in the list (most recent)
# But it uses control_registry WITHOUT tenant filter!
cr_global = query("SELECT * FROM engine.control_registry ORDER BY control_id")
print(f"Total control_registry entries (no tenant filter): {len(cr_global)}")

# Check if the first batch for the tenant has control_summary
if all_batches:
    first_batch_id = all_batches[0]['batch_id']
    cs_first = query("SELECT * FROM engine.migration_control_summary WHERE batch_id = %s", (first_batch_id,))
    print(f"\nControl summary for first (most recent) batch {first_batch_id}: {len(cs_first)} rows")
    for c in cs_first:
        print(f"  {c.get('control_id')} | {c.get('overall_status')}")

print("\n--- 1f. Compare with Cert tenant (if exists) ---")
cert_tenant = query("SELECT DISTINCT tenant_id FROM engine.control_registry WHERE tenant_id != %s", (TENANT_E2E,))
print(f"Other tenants in control_registry: {cert_tenant}")

print("\n--- 1g. Check batch record itself ---")
batch_rec = query_one("SELECT * FROM engine.migration_batch_registry WHERE batch_id = %s", (BATCH,))
if batch_rec:
    print(f"Batch {BATCH}:")
    print(f"  tenant_id: {batch_rec.get('tenant_id')}")
    print(f"  status: {batch_rec.get('batch_status')}")
    print(f"  total_controls: {batch_rec.get('total_controls')}")
    print(f"  completed_controls: {batch_rec.get('completed_controls')}")
    print(f"  failed_controls: {batch_rec.get('failed_controls')}")
else:
    print(f"Batch {BATCH} NOT FOUND!")

print("\n--- 1h. _build_operational logic trace ---")
# The code does: batches = query for tenant_id, ORDER BY created_at DESC LIMIT 20
# Then: ctrl_rows = JOIN control_registry c LEFT JOIN migration_control_summary cs
#        ON c.control_id = cs.control_id AND cs.batch_id = batches[0].batch_id
batches_e2e = query("SELECT batch_id, batch_name, batch_status FROM engine.migration_batch_registry WHERE tenant_id = %s ORDER BY created_at DESC LIMIT 20", (TENANT_E2E,))
if batches_e2e:
    latest_batch = batches_e2e[0]['batch_id']
    print(f"Latest batch_id used by _build_operational: {latest_batch}")
    ctrl_rows = query("""
        SELECT c.control_id, c.control_name, cs.overall_status, cs.batch_id
        FROM engine.control_registry c
        LEFT JOIN engine.migration_control_summary cs ON c.control_id = cs.control_id AND cs.batch_id = %s
        ORDER BY c.control_id
    """, (latest_batch,))
    print(f"control_registry entries (no tenant filter): {len(ctrl_rows)}")
    for r in ctrl_rows:
        print(f"  {r.get('control_id')} | {r.get('control_name')} | status={r.get('overall_status')} | batch={r.get('batch_id')}")

# ============================================================
# ISSUE 2: Migration - Source/Target Columns showing 0s
# ============================================================
section("ISSUE 2: Migration Pack - Source/Target Columns showing 0s")

print("\n--- 2a. Check dataset_mappings source_columns and target_columns ---")
dm = query("""
    SELECT dm.mapping_id, dm.source_table, dm.target_table,
           dm.source_columns, dm.target_columns,
           array_length(dm.source_columns, 1) as src_len,
           array_length(dm.target_columns, 1) as tgt_len
    FROM core.dataset_mappings dm
    JOIN core.projects p ON dm.project_id = p.project_id
    WHERE p.tenant_id = %s
    LIMIT 10
""", (TENANT_E2E,))
print(f"Dataset mappings for E2E tenant: {len(dm)}")
for d in dm:
    print(f"  {d.get('source_table')} -> {d.get('target_table')} | src_cols={d.get('source_columns')} (len={d.get('src_len')}) | tgt_cols={d.get('target_columns')} (len={d.get('tgt_len')})")

print("\n--- 2b. Check if source_columns arrays are NULL or empty ---")
dm_nulls = query("""
    SELECT
        COUNT(*) as total,
        SUM(CASE WHEN dm.source_columns IS NULL THEN 1 ELSE 0 END) as src_null,
        SUM(CASE WHEN dm.target_columns IS NULL THEN 1 ELSE 0 END) as tgt_null,
        SUM(CASE WHEN array_length(dm.source_columns, 1) = 0 THEN 1 ELSE 0 END) as src_empty,
        SUM(CASE WHEN array_length(dm.target_columns, 1) = 0 THEN 1 ELSE 0 END) as tgt_empty,
        SUM(CASE WHEN array_length(dm.source_columns, 1) > 0 THEN 1 ELSE 0 END) as src_populated,
        SUM(CASE WHEN array_length(dm.target_columns, 1) > 0 THEN 1 ELSE 0 END) as tgt_populated
    FROM core.dataset_mappings dm
    JOIN core.projects p ON dm.project_id = p.project_id
    WHERE p.tenant_id = %s
""", (TENANT_E2E,))
print(f"Stats for E2E tenant dataset_mappings: {dm_nulls}")

print("\n--- 2c. Show actual array values for a few rows ---")
dm_samples = query("""
    SELECT dm.source_columns, dm.target_columns
    FROM core.dataset_mappings dm
    JOIN core.projects p ON dm.project_id = p.project_id
    WHERE p.tenant_id = %s
    LIMIT 5
""", (TENANT_E2E,))
for d in dm_samples:
    print(f"  source_columns: {d.get('source_columns')}")
    print(f"  target_columns: {d.get('target_columns')}")
    print()

print("\n--- 2d. Check SUM aggregation used in code ---")
sum_result = query_one("""
    SELECT
        COALESCE(SUM(array_length(dm.source_columns, 1)), 0) as total_src,
        COALESCE(SUM(array_length(dm.target_columns, 1)), 0) as total_tgt
    FROM core.dataset_mappings dm
    JOIN core.projects p ON dm.project_id = p.project_id
    WHERE p.tenant_id = %s
""", (TENANT_E2E,))
print(f"SUM aggregation for E2E tenant: {sum_result}")

print("\n--- 2e. Check column_mappings table ---")
cm = query("""
    SELECT COUNT(*) as total FROM core.column_mappings cm
    JOIN core.dataset_mappings dm ON cm.mapping_id = dm.mapping_id
    JOIN core.projects p ON dm.project_id = p.project_id
    WHERE p.tenant_id = %s
""", (TENANT_E2E,))
print(f"Column mappings for E2E tenant: {cm}")

# ============================================================
# ISSUE 3: Governance and Governance Pack - empty data
# ============================================================
section("ISSUE 3: Governance and Governance Pack - Empty")

print("\n--- 3a. Check migration_control_exceptions for batch ---")
exceptions = query("SELECT * FROM engine.migration_control_exceptions WHERE batch_id = %s", (BATCH,))
print(f"Exceptions for batch {BATCH}: {len(exceptions)}")
for e in exceptions[:5]:
    print(f"  {e.get('control_id')} | {e.get('rule_id')} | cause={e.get('cause')} | entity={e.get('entity_name')}")

print("\n--- 3b. Check ALL exceptions for E2E tenant (across all batches) ---")
exc_all = query("""
    SELECT mce.*, mbr.tenant_id FROM engine.migration_control_exceptions mce
    JOIN engine.migration_batch_registry mbr ON mce.batch_id = mbr.batch_id
    WHERE mbr.tenant_id = %s
    ORDER BY mce.created_at DESC
    LIMIT 20
""", (TENANT_E2E,))
print(f"All exceptions for E2E tenant: {len(exc_all)}")

print("\n--- 3c. Check migration_exception_register table (governance_pack source) ---")
try:
    er = query("""
        SELECT * FROM engine.migration_exception_register
        WHERE batch_id = %s
        LIMIT 10
    """, (BATCH,))
    print(f"migration_exception_register for batch {BATCH}: {len(er)}")
    for e in er:
        print(f"  {e.get('control_id')} | {e.get('rule_id')} | {e.get('entity_name')}")
except Exception as ex:
    print(f"Table migration_exception_register may not exist: {ex}")

print("\n--- 3d. Check if exceptions exist for ANY batch ---")
exc_any = query("""
    SELECT batch_id, COUNT(*) as cnt
    FROM engine.migration_control_exceptions
    GROUP BY batch_id
    ORDER BY cnt DESC
""")
print("Exceptions by batch:")
for e in exc_any:
    print(f"  batch={e['batch_id']} | count={e['cnt']}")

print("\n--- 3e. _build_governance code trace ---")
print("_build_governance queries: engine.migration_control_exceptions WHERE batch_id = %s")
print(f"Batch used: {BATCH}")
print(f"Exceptions found: {len(exceptions)}")

print("\n--- 3f. _build_governance_pack code trace ---")
print("_build_governance_pack queries: engine.migration_exception_register")
print(f"JOIN on control_registry and migration_control_summary")
try:
    gp = query("""
        SELECT er.*, cr.severity_level, cr.control_name
        FROM engine.migration_exception_register er
        JOIN engine.control_registry cr ON er.control_id = cr.control_id
        JOIN engine.migration_control_summary mcs ON er.batch_id = mcs.batch_id AND er.control_id = mcs.control_id
        WHERE er.batch_id = %s
        LIMIT 10
    """, (BATCH,))
    print(f"Governance pack query result: {len(gp)} rows")
except Exception as ex:
    print(f"Governance pack query failed: {ex}")

# ============================================================
# ISSUE 4: Exceptions (Issues) - empty
# ============================================================
section("ISSUE 4: Exceptions (Issues) - Empty")

print("\n--- 4a. _build_issues calls _build_governance ---")
print("_build_issues() just calls _build_governance(batch_id) and restructures the output.")
print(f"Since governance returns empty for batch {BATCH}, issues will also be empty.")

print("\n--- 4b. Verify _build_governance return ---")
gov_findings = []
for e in exceptions:
    gov_findings.append({
        'control_id': e.get('control_id'),
        'cause': e.get('cause'),
        'entity': e.get('entity_name'),
    })
print(f"Governance findings from exceptions: {len(gov_findings)}")

print("\n--- 4c. Check if exceptions exist for tenant's batches ---")
if all_batches:
    for b in all_batches[:3]:
        bid = b['batch_id']
        exc_b = query("SELECT COUNT(*) as cnt FROM engine.migration_control_exceptions WHERE batch_id = %s", (bid,))
        print(f"  batch {bid} ({b['batch_name']}): {exc_b[0]['cnt']} exceptions")

# ============================================================
# ISSUE 5: Skipped reasons not shown in reports
# ============================================================
section("ISSUE 5: Skipped Reasons Not Shown in Reports")

print("\n--- 5a. Check migration_control_exceptions cause field ---")
try:
    exc_with_cause = query("""
        SELECT control_id, cause, failure_scope, COUNT(*) as cnt
        FROM engine.migration_control_exceptions
        GROUP BY control_id, cause, failure_scope
        ORDER BY cnt DESC
    """)
    print(f"Distinct cause combinations: {len(exc_with_cause)}")
    for e in exc_with_cause:
        print(f"  {e.get('control_id')} | cause={e.get('cause')} | failure_scope={e.get('failure_scope')} | count={e['cnt']}")
except Exception as ex:
    print(f"Error: {ex}")
    # Try simpler query
    exc_with_cause = query("""
        SELECT * FROM engine.migration_control_exceptions LIMIT 1
    """)
    if exc_with_cause:
        print(f"Columns in migration_control_exceptions: {list(exc_with_cause[0].keys())}")
    exc_with_cause = query("""
        SELECT control_id, cause, COUNT(*) as cnt
        FROM engine.migration_control_exceptions
        GROUP BY control_id, cause
        ORDER BY cnt DESC
    """)
    print(f"Distinct cause combinations: {len(exc_with_cause)}")
    for e in exc_with_cause:
        print(f"  {e.get('control_id')} | cause={e.get('cause')} | count={e['cnt']}")

print("\n--- 5b. Check control_summary skipped_rules ---")
skipped = query("""
    SELECT control_id, overall_status, skipped_rules
    FROM engine.migration_control_summary
    WHERE skipped_rules > 0 OR overall_status = 'SKIPPED'
    ORDER BY created_at DESC
    LIMIT 20
""")
print(f"Controls with skipped rules: {len(skipped)}")
for s in skipped:
    print(f"  {s.get('control_id')} | status={s.get('overall_status')} | skipped_rules={s.get('skipped_rules')}")

print("\n--- 5c. Check if there are SKIPPED exceptions ---")
skipped_exc = query("""
    SELECT * FROM engine.migration_control_exceptions
    WHERE cause ILIKE '%skip%' OR cause ILIKE '%NO_NUMERIC%' OR cause ILIKE '%NO_PRIMARY%'
    LIMIT 20
""")
print(f"Skipped-type exceptions: {len(skipped_exc)}")
for s in skipped_exc:
    print(f"  {s.get('control_id')} | cause={s.get('cause')} | entity={s.get('entity_name')}")

print("\n--- 5d. Check _build_validation for skipped reason display ---")
print("_build_validation method builds ctrl_outcomes with:")
print("  - control_id, control_name, severity, status, total_rules, passed_rules, failed_rules, error_rules, skipped_rules")
print("  It does NOT include 'cause' or 'skipped_reason' from exceptions.")

print("\n--- 5e. Check ALL report sections for cause field ---")
print("_build_governance: DOES include 'cause' field (line 411/427)")
print("_build_quality: DOES include 'cause' in rule_violations (line 561)")
print("_build_validation: Does NOT include 'cause' or skipped reasons")
print("_build_validation_pack: Does NOT include 'cause' or skipped reasons")
print("_build_issues: Delegates to _build_governance, so inherits 'cause'")
print("_build_governance_pack: Queries migration_exception_register (different table), does NOT include 'cause'")

print("\n--- 5f. Check migration_control_execution table ---")
try:
    mce = query("""
        SELECT * FROM engine.migration_control_execution WHERE batch_id = %s LIMIT 10
    """, (BATCH,))
    print(f"migration_control_execution for batch: {len(mce)}")
    for m in mce[:3]:
        print(f"  {m.get('control_id')} | status={m.get('execution_status')} | keys={list(m.keys())}")
except Exception as ex:
    print(f"migration_control_execution: {ex}")

print("\n--- 5g. Check columns in key tables ---")
for tbl in ['migration_control_exceptions', 'migration_control_summary', 'migration_control_execution', 'migration_exception_register']:
    try:
        all_cols = query(f"""
            SELECT column_name FROM information_schema.columns
            WHERE table_schema = 'engine' AND table_name = '{tbl}'
            ORDER BY ordinal_position
        """)
        print(f"\nColumns in engine.{tbl}:")
        for c in all_cols:
            print(f"  {c['column_name']}")
    except Exception as ex:
        print(f"  {tbl}: {ex}")

# ============================================================
# SUMMARY
# ============================================================
section("SUMMARY OF FINDINGS")

print("""
ISSUE 1: Operational - Control Execution Status Empty
---------
Root cause: The _build_operational method queries control_registry (global, no tenant filter)
and LEFT JOINs migration_control_summary on batch_id = batches[0].batch_id.
If the batch has no matching control_summary rows, all controls show "NOT RUN".
The issue is that control_summary is populated per-batch, and if no controls were
actually executed for the E2E tenant's batch, the LEFT JOIN returns NULLs.
TYPE: DATA issue (control_summary is empty for the batch)

ISSUE 2: Migration Pack - Source/Target Columns showing 0s
---------
Root cause: The source_columns and target_columns arrays in core.dataset_mappings
are NULL or empty arrays. The code uses array_length(dm.source_columns, 1) which
returns NULL for NULL arrays, and COALESCE makes them 0.
If the arrays were populated during discovery/profiling but are now NULL/empty,
the column counts show as 0.
TYPE: DATA issue (source_columns/target_columns arrays not populated)

ISSUE 3: Governance and Governance Pack - Empty
---------
Root cause: Both sections query exception tables (migration_control_exceptions for
governance, migration_exception_register for governance_pack). If no exceptions
were written during control execution (because controls passed or were skipped),
these tables are empty for the batch.
TYPE: DATA issue (no exceptions recorded during execution)

ISSUE 4: Exceptions (Issues) - Empty
---------
Root cause: _build_issues() delegates to _build_governance() which queries
migration_control_exceptions. Same as Issue 3 - if no exceptions exist, it's empty.
TYPE: DATA issue (same root cause as Issue 3)

ISSUE 5: Skipped Reasons Not Shown
---------
Root cause: The code structure has the following gaps:
1. _build_validation and _build_validation_pack do NOT query exception causes
   for skipped controls - they only get counts from control_summary
2. _build_governance DOES include 'cause' from exceptions, but only for
   controls that HAVE exceptions (skipped controls typically have no exceptions)
3. No report section maps skipped_rules back to their specific skip reasons
   (e.g., NO_NUMERIC_COLUMN, NO_PRIMARY_KEY)
4. The migration_control_summary table has skipped_rules count but no
   skipped_reasons column
TYPE: DESIGN GAP (skip reasons are not captured/stored per-control)

The control execution engine needs to store a "skip_reason" or "cause" in
migration_control_summary when a control is SKIPPED, and the report builders
need to surface that field.
""")

conn.close()
print("\nInvestigation complete.")
