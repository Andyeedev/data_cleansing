"""
OC-REPORT-001 — purge accumulated Report Studio TEST artefacts.

WHY THIS EXISTS
---------------
Every Playwright run of `e2e/reportStudio.e2e.mjs` instantiates a real report
(template, assistant, duplicate, adoption cases). Until the spec cleaned up
after itself, each full run left roughly 25-30 live report rows behind, so the
Saved Reports list filled with byte-identical copies of the same templates
("Migration Health - Weekly" reached 76 live rows with a single distinct
definition).

These are NOT version bumps: a report is a row in platform.reports and its
versions are child rows in platform.report_definitions. Repeated template
instantiation creates independent report rows, which is correct product
behaviour - the duplication was purely a test artefact.

This script soft-deletes (status='deleted', deleted_at=now()) every live report
owned by the OC-REPORT-001 test users. It is deliberately conservative:

  * DEFAULT IS A DRY RUN. Nothing is written without --execute.
  * Reports owned by admin@mapnexus.com are NEVER touched, so manual work done
    during review survives.
  * It only targets the two provisioned test tenants.
  * It soft-deletes rather than dropping rows, so it is reversible
    (UPDATE ... SET deleted_at = NULL, status = 'draft' to restore).

  python scripts/purge_report_studio_test_reports.py            # dry run
  python scripts/purge_report_studio_test_reports.py --execute  # do it
  python scripts/purge_report_studio_test_reports.py --status   # counts only
"""
import argparse
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TEST_USERS = ("analyst@ocreport001.test", "viewer@ocreport001.test",
              "other@ocreport001.test")
NEVER_TOUCH = ("admin@mapnexus.com",)


def _connect():
    import psycopg2
    from psycopg2.extras import register_uuid
    # report ids are uuid columns; without this psycopg2 builds
    # `uuid = ANY(text[])` (or cannot adapt UUID at all)
    register_uuid()
    for line in open(os.path.join(ROOT, ".env"), encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
    conn = psycopg2.connect(
        host=os.environ["ENGINE_DB_HOST"], port=os.environ["ENGINE_DB_PORT"],
        dbname=os.environ["ENGINE_DB_NAME"], user=os.environ["ENGINE_DB_USER"],
        password=os.environ["ENGINE_DB_PASS"])
    conn.autocommit = True
    return conn


def report(cur):
    # purgeable: owned by a provisioned test user
    cur.execute("""
        SELECT u.email, count(*)
        FROM platform.reports r
        JOIN platform.users u ON u.id = r.owner_user_id
        WHERE r.deleted_at IS NULL AND u.email = ANY(%s)
        GROUP BY 1 ORDER BY 2 DESC
    """, (list(TEST_USERS),))
    purgeable = cur.fetchall()
    total_purgeable = sum(n for _e, n in purgeable)
    print(f"  purgeable test reports : {total_purgeable}")
    for email, n in purgeable:
        print(f"    purge {email}: {n}")

    # protected: anyone who is NOT a provisioned test user, by name
    cur.execute("""
        SELECT u.email, count(*)
        FROM platform.reports r
        JOIN platform.users u ON u.id = r.owner_user_id
        WHERE r.deleted_at IS NULL
          AND NOT (u.email = ANY(%s))
        GROUP BY 1 ORDER BY 2 DESC
    """, (list(TEST_USERS),))
    print("  protected (never touched):")
    rows = cur.fetchall()
    if not rows:
        print("      (none)")
    for email, n in rows:
        marker = "manual work" if email in NEVER_TOUCH else "OTHER - review"
        print(f"    KEEP {email}: {n}  ({marker})")
    return total_purgeable


def purge(cur):
    cur.execute("""
        SELECT r.id FROM platform.reports r
        JOIN platform.users u ON u.id = r.owner_user_id
        WHERE r.deleted_at IS NULL AND u.email = ANY(%s)
    """, (list(TEST_USERS),))
    ids = [r[0] for r in cur.fetchall()]
    if not ids:
        print("  nothing to purge")
        return 0
    # soft delete, exactly as the product's own delete does
    cur.execute("""
        UPDATE platform.reports
        SET status = 'deleted', deleted_at = now(), updated_at = now()
        WHERE id = ANY(%s) AND deleted_at IS NULL
    """, (ids,))
    print(f"  soft-deleted {cur.rowcount} report(s)")
    return cur.rowcount


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--execute", action="store_true",
                    help="actually soft-delete (default is a dry run)")
    ap.add_argument("--status", action="store_true", help="counts only")
    a = ap.parse_args()

    conn = _connect()
    try:
        with conn.cursor() as cur:
            report(cur)
            if a.status:
                return 0
            if not a.execute:
                print("\n  DRY RUN - nothing written. Re-run with --execute.")
                return 0
            print()
            purge(cur)
            print("\n  after purge:")
            report(cur)
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
