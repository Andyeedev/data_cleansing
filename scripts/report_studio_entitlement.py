"""
OC-REPORT-001 — browser-E2E helper: toggle an enterprise plan entitlement.

Called by the Playwright spec, which has no database driver available. Kept as a
separate process so the browser test does not need a JS postgres client, and so
the entitlement is always restored even if the browser run dies.

  python scripts/report_studio_entitlement.py snapshot
  python scripts/report_studio_entitlement.py drop <key>
  python scripts/report_studio_entitlement.py restore <json>
  python scripts/report_studio_entitlement.py show
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _load_env():
    for line in open(os.path.join(ROOT, ".env"), encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def _connect():
    import psycopg2
    _load_env()
    conn = psycopg2.connect(
        host=os.environ["ENGINE_DB_HOST"], port=os.environ["ENGINE_DB_PORT"],
        dbname=os.environ["ENGINE_DB_NAME"], user=os.environ["ENGINE_DB_USER"],
        password=os.environ["ENGINE_DB_PASS"])
    conn.autocommit = True
    return conn


def cmd_show():
    with _connect() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT plan_id, tier, entitlements FROM platform.plans "
                        "WHERE tier='enterprise' LIMIT 1")
            row = cur.fetchone()
            if not row:
                print(json.dumps({"error": "no enterprise plan found"}))
                return 1
            print(json.dumps({"plan_id": str(row[0]), "tier": row[1],
                              "entitlements": row[2]}))
    return 0


def cmd_snapshot():
    """Write the current enterprise entitlements to a temp file, print the path."""
    import tempfile
    with _connect() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT plan_id, entitlements FROM platform.plans "
                        "WHERE tier='enterprise' LIMIT 1")
            row = cur.fetchone()
            if not row:
                print(json.dumps({"error": "no enterprise plan found"}))
                return 1
            fd, path = tempfile.mkstemp(prefix="ocreport001_ent_", suffix=".json")
            with os.fdopen(fd, "w", encoding="utf-8") as fh:
                json.dump({"plan_id": str(row[0]), "entitlements": row[1]}, fh)
            print(json.dumps({"path": path, "entitlements": row[1]}))
    return 0


def cmd_drop(key):
    from psycopg2.extras import Json
    with _connect() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT plan_id, entitlements FROM platform.plans "
                        "WHERE tier='enterprise' LIMIT 1")
            plan_id, current = cur.fetchone()
            if key not in (current or {}):
                print(json.dumps({"error": f"{key} not present"}))
                return 1
            nxt = {k: v for k, v in current.items() if k != key}
            cur.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
                        (Json(nxt), plan_id))
            print(json.dumps({"dropped": key, "remaining": sorted(nxt)}))
    return 0


def cmd_restore(path):
    from psycopg2.extras import Json
    with _connect() as conn:
        with conn.cursor() as cur:
            with open(path, encoding="utf-8") as fh:
                saved = json.load(fh)
            cur.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
                        (Json(saved["entitlements"]), saved["plan_id"]))
            print(json.dumps({"restored": sorted((saved["entitlements"] or {}).keys())}))
    try:
        os.remove(path)
    except OSError:
        pass
    return 0


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    cmd = sys.argv[1]
    if cmd == "show":
        return cmd_show()
    if cmd == "snapshot":
        return cmd_snapshot()
    if cmd == "drop":
        return cmd_drop(sys.argv[2])
    if cmd == "restore":
        return cmd_restore(sys.argv[2])
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
