"""OC-REPORT-001 Phase 1 — APPLY the two approved Phase 1 migrations.

This is a real, committed state change. It was authorised after the 95/95
service-level acceptance evidence was reviewed.

Order matters: the schema must exist before the templates/recipes seed, which
asserts against the data-source allowlist.
"""
import os
import re
import sys

import psycopg2

ROOT = os.getcwd()
MIGRATIONS = os.path.join(
    "engineering", "MAP_V3", "02_Output", "00_MAP_V3_Control", "migrations")

MIGRATIONS_TO_APPLY = [
    ("1. report studio schema",
     "OC-REPORT-001_phase1_report_studio_schema.sql"),
    ("2. templates and assistant recipes",
     "OC-REPORT-001_phase1_templates_recipes.sql"),
]


def load_env():
    with open(os.path.join(ROOT, ".env"), encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def main():
    load_env()
    conn = psycopg2.connect(
        host=os.environ["ENGINE_DB_HOST"], port=os.environ["ENGINE_DB_PORT"],
        dbname=os.environ["ENGINE_DB_NAME"], user=os.environ["ENGINE_DB_USER"],
        password=os.environ["ENGINE_DB_PASS"])
    conn.autocommit = True          # each file owns its BEGIN/COMMIT
    cur = conn.cursor()

    for label, fname in MIGRATIONS_TO_APPLY:
        path = os.path.join(MIGRATIONS, fname)
        if not os.path.exists(path):
            print(f"[FAIL] missing {fname}")
            return 1
        sql = open(path, encoding="utf-8").read()
        try:
            cur.execute(sql)                     # file's own BEGIN/COMMIT commits
        except Exception as exc:
            print(f"[FAIL] {label}: {type(exc).__name__}: {exc}")
            return 1
        print(f"  [committed] {label:42s} {fname}")

    # ---- verification ---------------------------------------------------
    cur.execute("""SELECT table_name FROM information_schema.tables
                   WHERE table_schema='platform'
                     AND table_name IN
                     ('reports','report_definitions','report_access',
                      'report_data_sources','report_catalog',
                      'report_templates','report_assistant_recipes')
                   ORDER BY 1""")
    tables = [r[0] for r in cur.fetchall()]
    print(f"\n  tables created: {len(tables)}/7 {tables}")

    cur.execute("""SELECT data_source_key, scope_family, required_entitlement
                   FROM platform.report_data_sources WHERE is_active
                   ORDER BY scope_family, data_source_key""")
    rows = cur.fetchall()
    print(f"\n  data sources ({len(rows)}):")
    for k, f, e in rows:
        print(f"    {f:15s} {k:30s} requires {e}")

    cur.execute("""SELECT template_key, version, required_entitlements
                   FROM platform.report_templates WHERE is_active ORDER BY sort_order""")
    print("\n  templates:")
    for k, v, e in cur.fetchall():
        print(f"    {k:28s} v{v}  requires {e}")

    cur.execute("""SELECT recipe_key, resulting_template_key
                   FROM platform.report_assistant_recipes WHERE is_active
                   ORDER BY priority""")
    print("\n  assistant recipes:")
    for r, t in cur.fetchall():
        print(f"    {r:28s} -> {t}")

    # Phase 0 must be untouched
    cur.execute("SELECT count(*) FROM platform.permissions")
    perms = cur.fetchone()[0]
    cur.execute("SELECT count(*) FROM platform.role_permissions WHERE granted IS TRUE")
    grants = cur.fetchone()[0]
    print(f"\n  Phase 0 intact: permissions={perms} (expect 58) "
          f"role_grants={grants} (expect 101)")

    cur.execute("""SELECT count(*) FROM platform.subscriptions s
                   JOIN platform.plans p ON s.plan_id=p.plan_id
                   WHERE p.tier='professional' AND p.entitlements ? 'report_studio'""")
    prof = cur.fetchone()[0]
    print(f"  professional tenants with report_studio: {prof} (expect 0)")

    conn.close()
    ok = (len(tables) == 7 and perms == 58 and grants == 101 and prof == 0)
    print(f"\n  RESULT: {'OK' if ok else 'PROBLEM'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
