"""OC-REPORT-001 — provision an Enterprise test tenant for Report Studio acceptance.

Creates an isolated Enterprise test tenant (or reuses it) with the personas the
acceptance scenario needs:

  Tenant A  (enterprise, active)     <-- the Enterprise tenant under test
    analyst@...   Data Analyst   build / publish / share / export
    viewer@...    Viewer         can read, CANNOT export  (the 403 case)
  Tenant B  (enterprise, active)     <-- proves cross-tenant 404
    other@...     Data Analyst

The existing Professional tenant is NEVER touched.

Credentials are generated here and written to .ocreport001_test_creds.json,
which is gitignored, so no password is ever committed. Re-running is safe: the
tenant is looked up by name and passwords are only rotated when --rotate-pw is
passed.

    python scripts/provision_report_studio_test_tenant.py
    python scripts/provision_report_studio_test_tenant.py --rotate-pw
"""
import argparse
import json
import os
import secrets
import string
import sys
import uuid
from datetime import date, timedelta

import psycopg2
import psycopg2.extras

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CREDS_PATH = os.path.join(ROOT, ".ocreport001_test_creds.json")
GITIGNORE_ENTRY = ".ocreport001_test_creds.json"

TENANT_A = "OC-REPORT-001 Test Enterprise A"
TENANT_B = "OC-REPORT-001 Test Enterprise B"
DOMAIN = "ocreport001.test"

# The 5 personas, as (tenant, local part, role, first, last)
PERSONAS = [
    ("A", "analyst", "Data Analyst", "Ada", "Analyst"),
    ("A", "viewer", "Viewer", "Vic", "Viewer"),
    ("B", "other", "Data Analyst", "Otto", "Other"),
]


def load_env():
    with open(os.path.join(ROOT, ".env"), "r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def connect():
    load_env()
    return psycopg2.connect(
        host=os.environ["ENGINE_DB_HOST"],
        port=os.environ["ENGINE_DB_PORT"],
        dbname=os.environ["ENGINE_DB_NAME"],
        user=os.environ["ENGINE_DB_USER"],
        password=os.environ["ENGINE_DB_PASS"],
    )


def gen_password():
    alphabet = string.ascii_letters + string.digits
    # keep it shell/URL safe and comfortably long
    while True:
        pw = "".join(secrets.choice(alphabet) for _ in range(24))
        if (any(c.isupper() for c in pw) and any(c.islower() for c in pw)
                and any(c.isdigit() for c in pw)):
            return pw


def ensure_gitignored():
    """Append the creds filename to .gitignore using BYTES.

    The repository .gitignore is not valid UTF-8 (it contains CP1252 bytes), so
    a text read raises UnicodeDecodeError. Reading and appending as bytes avoids
    transcoding the existing file and preserves whatever encoding it already is.
    """
    gi = os.path.join(ROOT, ".gitignore")
    if not os.path.exists(gi):
        return
    with open(gi, "rb") as fh:
        body = fh.read()
    if GITIGNORE_ENTRY.encode() in body:
        return
    suffix = (b"\n# OC-REPORT-001 test credentials (never commit)\n"
              + GITIGNORE_ENTRY.encode() + b"\n")
    with open(gi, "ab") as fh:
        fh.write(suffix)
    print(f"  added {GITIGNORE_ENTRY} to .gitignore")


def hash_password(pw):
    """Hash with the same scheme the app verifies with.

    app/services/auth_service.py:74 verifies with
    ``bcrypt.checkpw(password.encode(), password_hash.encode())`` and
    app/services/auth_service.py:150 hashes with
    ``bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()``.
    The provisioner must match exactly or the provisioned users cannot log in
    through the normal /auth/login path.
    """
    import bcrypt
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def upsert_tenant(cur, name):
    cur.execute("SELECT tenant_id FROM core.tenants WHERE tenant_name = %s", (name,))
    row = cur.fetchone()
    if row:
        return row["tenant_id"], False
    cur.execute("""
        INSERT INTO core.tenants (tenant_name, status, max_users, max_projects, max_connections)
        VALUES (%s, 'ACTIVE', 50, 50, 50)
        RETURNING tenant_id
    """, (name,))
    return cur.fetchone()["tenant_id"], True


def upsert_subscription(cur, tenant_id, plan_id):
    """Exactly one ACTIVE subscription, so get_tenant_entitlements() resolves
    deterministically (it takes the latest by created_at)."""
    cur.execute("""
        SELECT subscription_id FROM platform.subscriptions
        WHERE tenant_id = %s AND status IN
              ('active','trialing','past_due','pending_cancellation')
        ORDER BY created_at DESC LIMIT 1
    """, (tenant_id,))
    row = cur.fetchone()
    if row:
        return row["subscription_id"], False
    cur.execute("""
        INSERT INTO platform.subscriptions
            (tenant_id, plan_id, status, start_date, billing_cycle, created_by)
        VALUES (%s, %s, 'active', %s, 'annual', NULL)
        RETURNING subscription_id
    """, (tenant_id, plan_id, date.today()))
    return cur.fetchone()["subscription_id"], True


def upsert_user(cur, email, first, last, tenant_id, role_name, password, force=False):
    cur.execute("SELECT id, password_hash FROM platform.users WHERE email = %s", (email,))
    row = cur.fetchone()
    if row:
        uid, existing = row["id"], row["password_hash"]
        usable = existing and not existing.startswith("!unhashed!")
        if usable and not force:
            return uid, "kept", role_name
        cur.execute(
            "UPDATE platform.users SET password_hash = %s, status = 'active' WHERE id = %s",
            (hash_password(password), uid))
        return uid, ("password-rotated" if usable else "password-set"), role_name

    cur.execute("""
        INSERT INTO platform.users
            (email, email_verified, password_hash, first_name, last_name,
             display_name, status, tenant_id, token_version)
        VALUES (%s, TRUE, %s, %s, %s, %s, 'active', %s, 0)
        RETURNING id
    """, (email, hash_password(password), first, last,
          f"{first} {last}", tenant_id))
    uid = cur.fetchone()["id"]

    cur.execute("SELECT id FROM platform.roles WHERE name = %s AND is_system IS TRUE",
                (role_name,))
    rid = cur.fetchone()["id"]
    cur.execute("""
        INSERT INTO platform.user_roles (user_id, role_id, assigned_by)
        VALUES (%s, %s, NULL) ON CONFLICT DO NOTHING
    """, (uid, rid))
    return uid, "created", role_name


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--rotate-pw", action="store_true",
                    help="reset passwords even if the user already exists")
    args = ap.parse_args()

    conn = connect()
    conn.autocommit = False
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    try:
        cur.execute("SELECT plan_id, tier FROM platform.plans WHERE tier = 'enterprise'")
        plan = cur.fetchone()
        if not plan:
            print("[FAIL] no enterprise plan in platform.plans")
            return 1
        print(f"enterprise plan: {plan['plan_id']} (tier={plan['tier']})")

        tenants = {}
        for key, name in (("A", TENANT_A), ("B", TENANT_B)):
            tid, created = upsert_tenant(cur, name)
            tenants[key] = tid
            sub, sub_created = upsert_subscription(cur, tid, plan["plan_id"])
            print(f"tenant {key}: {tid} ({'created' if created else 'existing'}) "
                  f"subscription {sub} ({'created' if sub_created else 'existing'})")

        creds = {"tenant_id": {}, "users": {}}
        for key, tid in tenants.items():
            creds["tenant_id"][key] = str(tid)

        for tkey, local, role, first, last in PERSONAS:
            email = f"{local}@{DOMAIN}"
            pw = gen_password()
            uid, how, _ = upsert_user(
                cur, email, first, last, tenants[tkey], role, pw,
                force=args.rotate_pw)
            if how == "kept":
                pw = "<unchanged — see prior creds file>"
            creds["users"][f"{tkey}_{local}"] = {
                "user_id": str(uid), "email": email, "role": role,
                "tenant": tkey, "password": pw,
            }
            print(f"user {email:28s} {role:14s} {how}")

        conn.commit()
    except Exception as exc:
        conn.rollback()
        print(f"[FAIL] {type(exc).__name__}: {exc}")
        return 1
    conn.close()

    ensure_gitignored()
    with open(CREDS_PATH, "w", encoding="utf-8") as fh:
        json.dump(creds, fh, indent=2)
    os.chmod(CREDS_PATH, 0o600)
    print(f"\ncredentials written to {GITIGNORE_PATH_REL} (gitignored)")

    # ---- verification ----------------------------------------------------
    sys.path.insert(0, ROOT)      # so the app's own entitlement reader is used
    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    from app.middleware.entitlement_middleware import get_tenant_entitlements
    print("\nVERIFICATION")
    ok = True
    for key in ("A", "B"):
        e = get_tenant_entitlements(tenants[key])
        rs, ar = "report_studio" in e, "advanced_reporting" in e
        print(f"  tenant {key}: {len(e):2d} entitlements  "
              f"report_studio={rs}  advanced_reporting={ar}")
        if not (rs and ar):
            ok = False

    cur.execute("""
        SELECT u.email, r.name AS role
        FROM platform.users u
        JOIN platform.user_roles ur ON ur.user_id = u.id
        JOIN platform.roles r ON r.id = ur.role_id
        WHERE u.email LIKE %s ORDER BY u.email
    """, (f"%@{DOMAIN}",))
    for row in cur.fetchall():
        print(f"  role check: {row['email']:28s} {row['role']}")
    conn.close()

    # the professional tenant must be untouched
    print("\nProfessional tenant untouched: verified separately by the "
          "acceptance test (report_studio must remain absent).")
    return 0 if ok else 1


GITIGNORE_PATH_REL = ".ocreport001_test_creds.json"

if __name__ == "__main__":
    sys.exit(main())
