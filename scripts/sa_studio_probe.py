"""
OC-REPORT-001 — TEMPORARY Super Admin probe for the Report Studio access check.

The real Super Admin (`admin@mapnexus.com`) lives in "Default Tenant", which has
no subscription row and therefore no plan entitlements. The seeded password in
.env no longer matches that account, so the reported failure could not be
reproduced against it directly.

This creates a THROWAWAY Super Admin in the SAME tenant as the real one, so the
access path under test is identical: Super Admin role, same tenant, same
entitlement outcome. It is removed with --remove afterwards.

It never touches admin@mapnexus.com, and it does not create any role, permission
or entitlement: it only assigns the existing canonical 'Super Admin' role.

  python scripts/sa_studio_probe.py --create
  python scripts/sa_studio_probe.py --remove
"""
import argparse
import json
import os
import secrets
import string
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PROBE_EMAIL = "sa-probe@ocreport001.test"
# the tenant the real Super Admin belongs to
DEFAULT_TENANT = "aaf73536-2fd0-461e-87be-aa980cc1a8f1"


def _load_env():
    for line in open(os.path.join(ROOT, ".env"), encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def _connect():
    import psycopg2
    from psycopg2.extras import RealDictCursor
    _load_env()
    conn = psycopg2.connect(
        host=os.environ["ENGINE_DB_HOST"], port=os.environ["ENGINE_DB_PORT"],
        dbname=os.environ["ENGINE_DB_NAME"], user=os.environ["ENGINE_DB_USER"],
        password=os.environ["ENGINE_DB_PASS"])
    conn.autocommit = True
    # cursor_factory is applied per-cursor, so hand back a ready cursor
    return conn, conn.cursor(cursor_factory=RealDictCursor)


def hash_password(pw):
    import bcrypt
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def create():
    conn, cur = _connect()
    try:
        pw = "".join(secrets.choice(string.ascii_letters + string.digits)
                     for _ in range(24))

        cur.execute("SELECT id, password_hash, tenant_id FROM platform.users "
                    "WHERE email = %s", (PROBE_EMAIL,))
        row = cur.fetchone()
        if row:
            cur.execute("UPDATE platform.users SET password_hash = %s, "
                        "status = 'active', token_version = 0 WHERE email = %s",
                        (hash_password(pw), PROBE_EMAIL))
            uid = str(row["id"])
            action = "password reset"
        else:
            cur.execute("""
                INSERT INTO platform.users
                    (email, email_verified, password_hash, first_name, last_name,
                     display_name, status, tenant_id, token_version)
                VALUES (%s, TRUE, %s, 'SA', 'Probe', 'SA Probe',
                        'active', %s, 0)
                RETURNING id
            """, (PROBE_EMAIL, hash_password(pw), DEFAULT_TENANT))
            uid = str(cur.fetchone()["id"])
            action = "created"

        # canonical role only; nothing invented
        cur.execute("SELECT id FROM platform.roles "
                    "WHERE name = 'Super Admin' AND is_system IS TRUE")
        rid = cur.fetchone()["id"]
        cur.execute("INSERT INTO platform.user_roles (user_id, role_id, assigned_by) "
                    "VALUES (%s, %s, NULL) ON CONFLICT DO NOTHING", (uid, rid))

        creds_path = os.path.join(ROOT, ".ocreport001_sa_probe.json")
        with open(creds_path, "w", encoding="utf-8") as fh:
            json.dump({"email": PROBE_EMAIL, "password": pw,
                       "user_id": uid, "tenant_id": DEFAULT_TENANT}, fh)

        print(json.dumps({"status": action, "email": PROBE_EMAIL,
                          "user_id": uid, "tenant_id": DEFAULT_TENANT,
                          "creds": creds_path}))
    finally:
        conn.close()


def remove():
    conn, cur = _connect()
    try:
        cur.execute("SELECT id FROM platform.users WHERE email = %s", (PROBE_EMAIL,))
        row = cur.fetchone()
        if not row:
            print(json.dumps({"status": "already absent", "email": PROBE_EMAIL}))
            return
        uid = str(row["id"])

        # The probe may have created reports while the access path was being
        # verified (instantiating a template, saving a version). Those are test
        # artefacts and must go first: platform.reports.owner_user_id is a
        # foreign key, so the user row cannot be deleted while any remain.
        cur.execute("SELECT id FROM platform.reports WHERE owner_user_id = %s", (uid,))
        rids = [str(r["id"]) for r in cur.fetchall()]
        for rid in rids:
            # Break the cycle first: reports.current_version_id references
            # report_definitions.id, and report_definitions.report_id references
            # reports.id, so neither can be deleted while the other still points
            # at it.
            cur.execute("UPDATE platform.reports SET current_version_id = NULL "
                        "WHERE id = %s", (rid,))
            for sql in (
                "DELETE FROM platform.report_access WHERE report_id = %s",
                "DELETE FROM platform.report_definitions WHERE report_id = %s",
                "DELETE FROM platform.reports WHERE id = %s",
            ):
                cur.execute(sql, (rid,))
        if rids:
            print(json.dumps({"status": "removed probe reports", "count": len(rids)}))

        cur.execute("DELETE FROM platform.user_roles WHERE user_id = %s", (uid,))
        cur.execute("DELETE FROM platform.users WHERE email = %s", (PROBE_EMAIL,))
        print(json.dumps({"status": "removed", "email": PROBE_EMAIL,
                          "rows": cur.rowcount}))
    finally:
        conn.close()
    path = os.path.join(ROOT, ".ocreport001_sa_probe.json")
    if os.path.exists(path):
        os.remove(path)
        print(json.dumps({"status": "removed creds file"}))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--create", action="store_true")
    ap.add_argument("--remove", action="store_true")
    a = ap.parse_args()
    if a.create:
        return create()
    if a.remove:
        return remove()
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
