"""
OC-REPORT-001 — seed demo data for the Report Studio test tenant.

WHY THIS EXISTS
---------------
The Enterprise test tenant (Tenant A) was provisioned with users, roles and a
subscription but NO project and NO migration data. Every Studio report therefore
read correctly and returned an empty result: the authorisation path, provenance
and metadata were all exercised, but no actual values were ever rendered. That
made both the Phase 1 browser evidence and the Phase 2 builder preview weaker
than they looked.

This seeds a small, clearly-labelled dataset so the Studio renders real numbers.

The `batch_registry` relation carries a `tenant_id` column, but it is NULL for
most rows, so the Studio's batch_family scope resolves tenant through the
`core.projects` join. The project row below is therefore the load-bearing part.

Idempotent: re-running replaces only rows it previously tagged as demo data.

  python scripts/seed_report_studio_test_data.py            # seed
  python scripts/seed_report_studio_test_data.py --status   # inspect
  python scripts/seed_report_studio_test_data.py --remove   # remove demo rows
"""
import datetime
import os
import sys
import uuid

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TENANT_A = "fc5c09d2-f5ff-4c3b-a6dd-4d46e089e457"
PROJECT_NAME = "OC-REPORT-001 Demo Project"
BATCH_PREFIX = "OCRE001-DEMO"


def _load_env():
    for line in open(os.path.join(ROOT, ".env"), encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def _connect():
    import psycopg2
    from psycopg2.extras import register_uuid
    # Without this psycopg2 cannot adapt a uuid.UUID at all ("can't adapt type
    # 'UUID'"), and passing raw strings instead builds uuid = ANY(text[]), which
    # Postgres also rejects. Registering the adapter makes uuid.UUID work
    # natively on both sides.
    register_uuid()
    _load_env()
    conn = psycopg2.connect(
        host=os.environ["ENGINE_DB_HOST"], port=os.environ["ENGINE_DB_PORT"],
        dbname=os.environ["ENGINE_DB_NAME"], user=os.environ["ENGINE_DB_USER"],
        password=os.environ["ENGINE_DB_PASS"])
    conn.autocommit = True
    return conn


# A fixed project id keeps the seed idempotent across runs.
DEMO_PROJECT_ID = "0c0e0001-0000-4000-8000-000000000001"

CONTROLS = [
    ("C01-COMPLETENESS", "CRITICAL", 412, 400, 12, 0),
    ("C04-REFERENTIAL", "HIGH", 388, 372, 16, 0),
    ("C07-ACCURACY", "HIGH", 296, 281, 15, 0),
    ("C09-TIMELINESS", "MEDIUM", 205, 199, 6, 0),
    ("C10-VALIDITY", "CRITICAL", 187, 171, 16, 0),
]

BATCHES = [
    ("B001", "completed", 5, 5, 1),
    ("B002", "completed", 5, 5, 0),
    ("B003", "completed", 5, 4, 2),
    ("B004", "in_progress", 5, 2, 1),
    ("B005", "failed", 5, 3, 3),
    ("B006", "completed", 5, 5, 0),
    ("B007", "completed", 5, 5, 1),
    ("B008", "completed", 5, 4, 1),
    ("B009", "in_progress", 5, 1, 0),
    ("B010", "completed", 5, 5, 0),
]

OWNERS = ["ann", "raj", "mei", "tom", "sof"]


def _demo_batch_ids(cur):
    """Return the demo batch ids coerced to ``uuid.UUID``.

    ``batch_id`` is a uuid column. Building the array from raw values makes
    psycopg2 emit ``uuid = ANY(text[])``, which Postgres rejects outright, so the
    coercion is done here once and reused by every caller.
    """
    cur.execute("""SELECT batch_id FROM engine.migration_batch_registry
                   WHERE batch_name LIKE %s""", (BATCH_PREFIX + "%",))
    return [r[0] if isinstance(r[0], uuid.UUID) else uuid.UUID(str(r[0]))
            for r in cur.fetchall()]


def remove(cur):
    ids = _demo_batch_ids(cur)
    if not ids:
        print("no demo rows to remove")
        return
    for table in ("migration_control_exceptions", "migration_control_execution",
                  "migration_control_summary", "migration_governance_status"):
        cur.execute(f"DELETE FROM engine.{table} WHERE batch_id = ANY(%s)", (ids,))
        print(f"  cleared engine.{table}")
    cur.execute("DELETE FROM engine.migration_batch_registry WHERE batch_id = ANY(%s)", (ids,))
    print(f"  cleared engine.migration_batch_registry ({len(ids)} batches)")
    cur.execute("DELETE FROM core.projects WHERE project_id = %s", (DEMO_PROJECT_ID,))
    print("  cleared core.projects demo project")


def status(cur):
    cur.execute("SELECT count(*) FROM core.projects WHERE tenant_id = %s", (TENANT_A,))
    projects = cur.fetchone()[0]
    ids = _demo_batch_ids(cur)
    print(f"tenant A projects      : {projects}")
    print(f"tenant A demo batches  : {len(ids)}")
    for table in ("migration_control_summary", "migration_control_execution",
                  "migration_control_exceptions", "migration_governance_status"):
        if ids:
            cur.execute(f"SELECT count(*) FROM engine.{table} WHERE batch_id = ANY(%s)", (ids,))
            print(f"  {table:34s}: {cur.fetchone()[0]}")


def seed(cur):
    now = datetime.datetime.now()

    # Remove any previous demo rows FIRST. Doing it after the project upsert
    # would delete the project that was just written, leaving the batches
    # orphaned with no tenant-scope anchor.
    remove(cur)

    # -- project (the tenant-scope anchor for every batch_family source) -----
    # project_type/status are constrained enums: MIGRATION / ACTIVE.
    cur.execute("""INSERT INTO core.projects
                     (project_id, tenant_id, project_name, project_type, status, created_at)
                   VALUES (%s, %s, %s, 'MIGRATION', 'ACTIVE', %s)
                   ON CONFLICT (project_id) DO UPDATE
                     SET tenant_id = EXCLUDED.tenant_id,
                         project_name = EXCLUDED.project_name""",
                (DEMO_PROJECT_ID, TENANT_A, PROJECT_NAME, now))
    print(f"  core.projects        : {DEMO_PROJECT_ID} ({PROJECT_NAME})")

    batch_ids = []
    base = now - datetime.timedelta(days=len(BATCHES))
    for i, (code, status, total, completed, failed) in enumerate(BATCHES):
        bid = str(uuid.uuid4())
        batch_ids.append(bid)
        started = base + datetime.timedelta(days=i)
        cur.execute("""INSERT INTO engine.migration_batch_registry
                         (batch_id, project_id, batch_start_time, batch_end_time,
                          batch_status, total_controls, completed_controls,
                          failed_controls, created_at, batch_name, tenant_id)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                    (bid, DEMO_PROJECT_ID, started,
                     started + datetime.timedelta(minutes=42), status, total,
                     completed, failed, started,
                     f"{BATCH_PREFIX}-{code}", TENANT_A))

        for control_id, severity, total_rules, passed, failed_rules, error_rules in CONTROLS:
            # not every batch has failed every control; keep the numbers coherent
            p = passed if status != "in_progress" else max(0, passed // 2)
            f = failed_rules if status != "in_progress" else failed_rules // 2
            t = p + f
            overall = "FAILED" if f else ("ERROR" if error_rules else "PASSED")
            cur.execute("""INSERT INTO engine.migration_control_summary
                             (batch_id, control_id, overall_status, total_rules,
                              passed_rules, failed_rules, error_rules,
                              created_at, skipped_rules)
                           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                        (bid, control_id, overall, t, p, f, error_rules, started, 0))

            # row-level executions so the table/register section has content
            for r in range(1, min(f, 4) + 1):
                cur.execute("""INSERT INTO engine.migration_control_execution
                                 (batch_id, control_id, rule_id, entity_name,
                                  execution_status, delta_value,
                                  execution_time_seconds, created_at,
                                  severity_level, slow_flag)
                               VALUES (%s, %s, %s, %s, 'FAILED', %s, %s, %s, %s, %s)""",
                            (bid, control_id, f"{control_id}-R{r:02d}",
                             f"{OWNERS[(i + r) % len(OWNERS)]}_entity_{r}",
                             float(r * 3), 1.5 + r * 0.75, started, severity,
                             "true" if r > 2 else "false"))
                if r <= 2:
                    cur.execute("""INSERT INTO engine.migration_control_exceptions
                                     (batch_id, control_id, rule_id, entity_name,
                                      source_value, target_value, delta_value,
                                      created_at, cause, failure_scope)
                                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'record')""",
                                (bid, control_id, f"{control_id}-R{r:02d}",
                                 f"{OWNERS[(i + r) % len(OWNERS)]}_entity_{r}",
                                 str(r * 100), str(r * 103), r * 3, started,
                                 "target value drift"))

        cur.execute("""INSERT INTO engine.migration_governance_status
                         (batch_id, project_id, migration_status,
                          blocking_controls, total_failed_rules, decision_time)
                       VALUES (%s, %s, %s, %s, %s, %s)""",
                    (bid, DEMO_PROJECT_ID,
                     "blocked" if failed else "ready", failed, failed * 12, started))

    print(f"  migration_batch_registry      : {len(batch_ids)} batches")
    print(f"  migration_control_summary     : {len(batch_ids) * len(CONTROLS)} rows")
    print(f"  migration_governance_status   : {len(batch_ids)} rows")
    for table in ("migration_control_execution", "migration_control_exceptions"):
        cur.execute(f"SELECT count(*) FROM engine.{table} WHERE batch_id = ANY(%s)",
                    ([uuid.UUID(b) for b in batch_ids],))
        print(f"  {table:28s}: {cur.fetchone()[0]} rows")


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "--seed"
    conn = _connect()
    try:
        with conn.cursor() as cur:
            if mode in ("--seed", "seed"):
                print("seeding Report Studio demo data for tenant A...")
                seed(cur)
                print()
                status(cur)
            elif mode in ("--remove", "remove"):
                print("removing Report Studio demo data...")
                remove(cur)
                print()
                status(cur)
            elif mode in ("--status", "status"):
                status(cur)
            else:
                print(__doc__)
                return 2
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
