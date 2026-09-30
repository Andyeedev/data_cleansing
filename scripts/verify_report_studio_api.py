"""OC-REPORT-001 — Studio API end-to-end over REAL HTTP.

Every request is a real HTTP call to a running uvicorn instance. Authentication
is the real /auth/login endpoint, so JWT issuance, cookie handling, bcrypt
verification, role resolution and tenant scoping all run for real. Nothing is
mocked and no dependency is overridden.

Covers the required scenarios:
  1. template visibility (5 for an entitled tenant, filtered without the tier)
  2. create / edit / version / publish, with v1 still reproducible
  3. the Report Assistant (match, keywords, constrained questions, candidate, save)
  4. sharing
  5. Viewer reads but export returns 403
  6. cross-tenant read returns 404
  7. entitlement removal returns 403 and hides the template

Usage:  python scripts/verify_report_studio_api.py [--base-url http://127.0.0.1:8010]
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CREDS = os.path.join(ROOT, ".ocreport001_test_creds.json")

PASS, FAIL = [], []


def call(method, url, token=None, body=None, raw=False):
    """Real HTTP call.

    /auth/login sets the JWT in an httponly cookie and returns only
    {"message": ...} (app/api/routes/auth_routes.py:63-72), so the cookie MUST be
    carried on subsequent requests — which is exactly how the real frontend
    authenticates. Passing a Bearer header as well would not be a real client.
    """
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Accept", "application/json")
    if data:
        req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Cookie", f"access_token={token}")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            payload = r.read()
            if raw:
                return r.status, payload
            return r.status, json.loads(payload or b"{}")
    except urllib.error.HTTPError as e:
        payload = e.read()
        if raw:
            return e.code, payload
        try:
            return e.code, json.loads(payload or b"{}")
        except Exception:
            return e.code, {"raw": payload[:400].decode("utf-8", "replace")}


def check(name, condition, detail=""):
    if condition:
        PASS.append(name)
        print(f"  [PASS] {name}")
    else:
        FAIL.append((name, detail))
        print(f"  [FAIL] {name}  {detail}")
    return bool(condition)


def login(base, email, password):
    """Real /auth/login. The JWT comes back in the Set-Cookie header."""
    data = json.dumps({"username": email, "password": password}).encode()
    req = urllib.request.Request(
        f"{base}/api/v1/auth/login", data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            r.read()
            cookie = r.headers.get("Set-Cookie", "")
    except urllib.error.HTTPError as e:
        raise SystemExit(f"login failed for {email}: {e.code} {e.read()[:300]}")

    token = ""
    for part in cookie.split(";"):
        part = part.strip()
        if part.startswith("access_token="):
            token = part.split("=", 1)[1]
    if not token:
        raise SystemExit(f"no access_token cookie for {email}; got {cookie[:200]!r}")
    return token


def section(title):
    print(f"\n{title}")
    print("-" * len(title))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="http://127.0.0.1:8010")
    args = ap.parse_args()
    base = args.base_url.rstrip("/")
    studio = f"{base}/api/v1/reports/studio"

    creds = json.load(open(CREDS, encoding="utf-8"))
    u = creds["users"]
    ta, tb = creds["tenant_id"]["A"], creds["tenant_id"]["B"]

    # ---- real logins -----------------------------------------------------
    section("0. REAL AuthService login (bcrypt + RBAC + tenant scope)")
    tok_analyst = login(base, u["A_analyst"]["email"], u["A_analyst"]["password"])
    tok_viewer = login(base, u["A_viewer"]["email"], u["A_viewer"]["password"])
    tok_other = login(base, u["B_other"]["email"], u["B_other"]["password"])
    check("analyst logged in over real HTTP", bool(tok_analyst))
    check("viewer logged in over real HTTP", bool(tok_viewer))
    check("tenant B user logged in over real HTTP", bool(tok_other))

    me, _ = call("GET", f"{base}/api/v1/auth/me", tok_analyst)
    st, me = call("GET", f"{base}/api/v1/auth/me", tok_analyst)
    analyst_reports = sorted(p for p in (me.get("data", {}).get("permissions") or me.get("permissions") or [])
                             if p.startswith("reports:"))
    st2, me_v = call("GET", f"{base}/api/v1/auth/me", tok_viewer)
    viewer_reports = sorted(p for p in (me_v.get("data", {}).get("permissions") or me_v.get("permissions") or [])
                            if p.startswith("reports:"))
    print(f"  analyst reports:* = {analyst_reports}")
    print(f"  viewer  reports:* = {viewer_reports}")
    check("analyst holds reports:share", "reports:share" in analyst_reports)
    check("viewer holds reports:read", "reports:read" in viewer_reports)
    check("viewer does NOT hold reports:export",
          "reports:export" not in viewer_reports)

    # ---- 1. template visibility -----------------------------------------
    section("1. TEMPLATE VISIBILITY (entitlement-filtered server-side)")
    st, body = call("GET", f"{studio}/templates", tok_analyst)
    check("GET /templates returns 200", st == 200, str(body)[:200])
    templates = body.get("data", {}).get("items", [])
    keys = sorted(t["template_key"] for t in templates)
    print(f"  templates visible to analyst: {keys}")
    check("analyst sees all 5 templates", len(templates) == 5, str(keys))
    check("executive_status present for an entitled tenant",
          "executive_status" in keys)

    st, body = call("GET", f"{studio}/catalog", tok_analyst)
    check("GET /catalog returns 200", st == 200)
    cat = body.get("data", {})
    check("catalog lists data sources for the field picker",
          len(cat.get("data_sources", [])) == 8,
          str(len(cat.get("data_sources", []))))
    check("catalog reports report_studio in entitlements",
          "report_studio" in cat.get("entitlements", []))

    # viewer is on the same tenant, so sees the same templates
    st, body = call("GET", f"{studio}/templates", tok_viewer)
    check("viewer also sees the 5 templates (read-only, same tenant)",
          st == 200 and len(body.get("data", {}).get("items", [])) == 5)

    # ---- 2. create / edit / version / publish ----------------------------
    section("2. CREATE / EDIT / VERSION / PUBLISH")
    st, body = call("POST", f"{studio}/templates/instantiate", tok_analyst,
                    {"template_key": "migration_health_weekly",
                     "title": "E2E Migration Health"})
    check("POST /templates/instantiate returns 200", st == 200, str(body)[:300])
    report = body.get("data", {})
    rid = report.get("id")
    check("instantiated report is a draft", report.get("status") == "draft")
    check("provenance records the template",
          report.get("derived_from_template_key") == "migration_health_weekly"
          and report.get("derived_from_template_version") == 3,
          str(report.get("derived_from_template_key")))
    check("pinned by default", report.get("template_state") == "pinned")

    st, body = call("GET", f"{studio}/reports/{rid}", tok_analyst)
    check("GET /reports/{id} returns 200", st == 200)
    # the endpoint returns {report, definition} where `definition` is the
    # VERSION ROW, so the definition JSON is one level deeper
    d1 = body.get("data", {}).get("definition", {}).get("definition", {})
    check("v1 has 5 sections", len(d1.get("sections", [])) == 5,
          str(len(d1.get("sections", []))))
    d1["sections"][0]["title"] = "Key metrics (E2E adjusted)"
    st, body = call("PUT", f"{studio}/reports/{rid}/definition", tok_analyst,
                    {"definition": d1})
    check("PUT /definition returns 200 (creates v2)", st == 200, str(body)[:200])

    st, body = call("GET", f"{studio}/reports/{rid}/versions", tok_analyst)
    versions = body.get("data", {}).get("items", [])
    check("version list has 2 entries", len(versions) == 2, str(len(versions)))
    check("v2 is current", versions[0]["version_no"] == 2, str(versions[0]["version_no"]))

    st, body = call("GET", f"{studio}/reports/{rid}?version=1", tok_analyst)
    v1_sections = (body.get("data", {}).get("definition", {})
                   .get("definition", {}).get("sections", []))
    check("v1 is still reproducible",
          v1_sections and v1_sections[0].get("title") == "Key metrics",
          str(v1_sections[0].get("title") if v1_sections else "no sections"))

    st, body = call("PATCH", f"{studio}/reports/{rid}/status", tok_analyst,
                    {"status": "published"})
    check("PATCH /status publishes", st == 200 and
          body.get("data", {}).get("status") == "published", str(body)[:200])
    check("published report is tenant-visible",
          body.get("data", {}).get("visibility") == "tenant")

    # ---- read path -------------------------------------------------------
    section("3. READ PATH (real SQL, real tenant scope)")
    st, body = call("GET", f"{studio}/reports/{rid}/data", tok_analyst)
    check("GET /data returns 200", st == 200, str(body)[:300])
    data = body.get("data", {})
    check("read meta ok", data.get("meta", {}).get("ok") is True)
    check("read is not truncated", data.get("meta", {}).get("truncated") is False)
    comps = data.get("components", [])
    check("read returned components", len(comps) > 0, str(len(comps)))
    print(f"  components: {[(c.get('id'), c.get('type'), c.get('row_count')) for c in comps]}")
    print(f"  scope_family: {data.get('meta', {}).get('scope_family')}")
    check("query was batch_family scoped",
          data.get("meta", {}).get("scope_family") == "batch_family")
    check("columns present for rendering",
          all(c.get("columns") for c in comps), "a component had no columns")

    # ---- 4. assistant ----------------------------------------------------
    section("4. REPORT ASSISTANT (deterministic, no external AI)")
    st, body = call("GET", f"{studio}/assistant/recipes", tok_analyst)
    recipes = body.get("data", {}).get("items", [])
    check("5 recipes listed", st == 200 and len(recipes) == 5, str(len(recipes)))

    st, body = call("POST", f"{studio}/assistant/match", tok_analyst,
                    {"request": "show me failed controls for the last 10 batches"})
    match = body.get("data", {})
    check("match returns 200", st == 200, str(body)[:200])
    check("a recipe matched", match.get("matched") is True)
    check("matched recipe is migration_health_weekly",
          match.get("recipe_key") == "migration_health_weekly",
          str(match.get("recipe_key")))
    check("matched keywords are shown to the user",
          bool(match.get("matched_keywords")), str(match.get("matched_keywords")))
    print(f"  matched keywords: {match.get('matched_keywords')}")
    questions = match.get("questions", [])
    check("2 constrained questions offered", len(questions) == 2, str(len(questions)))
    check("every question is a closed choice",
          all(q.get("type") == "choice" and q.get("options") for q in questions))

    answers = {q["id"]: q["default"] for q in questions}
    st, body = call("POST", f"{studio}/assistant/candidate", tok_analyst,
                    {"recipe_key": match["recipe_key"], "answers": answers,
                     "title": "E2E Assistant Report"})
    check("candidate definition produced (not saved)", st == 200, str(body)[:250])
    check("candidate is not yet a report", "id" not in (body.get("data", {}).get("candidate") or {}))

    st, body = call("POST", f"{studio}/assistant/candidate", tok_analyst,
                    {"recipe_key": match["recipe_key"], "answers": answers,
                     "title": "E2E Assistant Report", "save": True})
    check("assistant report saved", st == 200 and body.get("data", {}).get("id"),
          str(body)[:250])
    rid2 = body.get("data", {}).get("id")
    check("origin is recorded as assistant",
          body.get("data", {}).get("origin") == "assistant")
    check("recipe provenance recorded",
          body.get("data", {}).get("origin_recipe_key") == "migration_health_weekly")

    # an out-of-options answer must be refused
    st, body = call("POST", f"{studio}/assistant/candidate", tok_analyst,
                    {"recipe_key": match["recipe_key"],
                     "answers": {"severity": "DROP EVERYTHING",
                                 "group_by": "control_id"}})
    check("out-of-options answer is refused", st >= 400, str(st))

    # ---- 5. sharing + Viewer export 403 ----------------------------------
    section("5. SHARING + VIEWER READ / EXPORT 403")
    st, body = call("POST", f"{studio}/reports/{rid}/access", tok_analyst,
                    {"grantee_user_id": u["A_viewer"]["user_id"]})
    check("POST /access grants the Viewer", st == 200, str(body)[:250])
    check("grant reports that the recipient cannot export",
          body.get("data", {}).get("grantee_can_export") is False,
          str(body.get("data", {}).get("grantee_can_export")))

    st, body = call("GET", f"{studio}/reports/{rid}/data", tok_viewer)
    check("Viewer can READ the shared report", st == 200, str(body)[:250])
    check("Viewer read is tenant-scoped",
          body.get("data", {}).get("meta", {}).get("ok") is True)

    st, body = call("GET", f"{studio}/reports/{rid}/export?format=csv", tok_viewer)
    check("Viewer EXPORT returns 403", st == 403, f"got {st}: {str(body)[:200]}")
    check("403 names the missing capability",
          "reports:export" in json.dumps(body), json.dumps(body)[:200])

    st, raw = call("GET", f"{studio}/reports/{rid}/export?format=csv",
                   tok_analyst, raw=True)
    check("analyst EXPORT returns 200", st == 200, str(st))
    csv_text = raw.decode("utf-8", "replace")
    check("CSV carries a provenance preamble", csv_text.startswith("# MAP Nexus"))
    check("CSV reports truncation state", "# truncated" in csv_text)
    print(f"  csv first line: {csv_text.splitlines()[0]!r}")

    st, raw = call("GET", f"{studio}/reports/{rid}/export?format=xlsx",
                   tok_analyst, raw=True)
    check("analyst XLSX export returns 200", st == 200, str(st))
    check("XLSX is a real workbook",
          st == 200 and raw[:2] == b"PK", str(raw[:8]))

    # A report title is free text and the seeded V1 templates use typographic
    # characters (the em-dash in "Migration Health - Weekly"). HTTP headers are
    # latin-1, so interpolating such a title into Content-Disposition used to
    # raise UnicodeEncodeError and 500 the whole export. Exercise it here so the
    # API evidence covers it, not just the browser journey.
    unicode_rid = body.get("data", {}).get("id")
    st, created = call("POST", f"{studio}/reports", tok_analyst, {
        "title": "Unicode \u2014 \u00e9\u00e8 \u201cquoted\u201d report",
        "definition": {
            "schema_version": 1, "data_source_key": "migration.control_summary",
            "sections": [{"id": "k", "type": "kpi", "title": "\u2014 total",
                          "bindings": {"measure": "total_rules",
                                       "aggregation": "sum"}}],
            "filters": []}})
    unicode_rid = (created.get("data") or {}).get("id")
    check("created a report with a non-latin-1 title", bool(unicode_rid),
          json.dumps(created)[:200])
    if unicode_rid:
        for fmt in ("csv", "xlsx"):
            st, raw = call("GET", f"{studio}/reports/{unicode_rid}/export?format={fmt}",
                           tok_analyst, raw=True)
            check(f"export of a non-ASCII title returns 200 ({fmt})", st == 200,
                  f"got {st}")
        call("PATCH", f"{studio}/reports/{unicode_rid}/status", tok_analyst,
             {"status": "deleted"})

    # ---- 6. cross-tenant 404 ---------------------------------------------
    section("6. CROSS-TENANT ISOLATION (404, not 403)")
    st, body = call("GET", f"{studio}/reports/{rid}/data", tok_other)
    check("tenant B read of tenant A report returns 404", st == 404, f"got {st}")
    st, body = call("GET", f"{studio}/reports/{rid}", tok_other)
    check("tenant B GET report returns 404", st == 404, f"got {st}")
    st, body = call("GET", f"{studio}/reports/{rid}/export?format=csv", tok_other)
    check("tenant B export returns 404", st == 404, f"got {st}")
    st, body = call("PATCH", f"{studio}/reports/{rid}/status", tok_other,
                    {"status": "deleted"})
    check("tenant B delete returns 404", st == 404, f"got {st}")
    st, body = call("GET", f"{studio}/reports", tok_other)
    items = body.get("data", {}).get("items", [])
    check("tenant B listing excludes tenant A reports",
          all(i.get("tenant_id") == tb for i in items) and rid not in
          {i.get("id") for i in items},
          f"{len(items)} items")

    # unknown id is also 404, so existence is not confirmed
    st, body = call("GET",
                    f"{studio}/reports/00000000-0000-0000-0000-000000000000",
                    tok_analyst)
    check("unknown report id returns 404", st == 404, f"got {st}")

    # ---- 7. entitlement removal -----------------------------------------
    section("7. ENTITLEMENT REMOVAL (403 + hidden template + hidden nav)")
    import psycopg2
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
    cur = conn.cursor()
    cur.execute("SELECT plan_id, entitlements FROM platform.plans WHERE tier='enterprise'")
    pid, saved = cur.fetchone()

    # an executive report, which requires advanced_reporting
    st, body = call("POST", f"{studio}/templates/instantiate", tok_analyst,
                    {"template_key": "executive_status", "title": "E2E Exec"})
    exec_rid = body.get("data", {}).get("id")
    call("PATCH", f"{studio}/reports/{exec_rid}/status", tok_analyst,
         {"status": "published"})
    st, body = call("GET", f"{studio}/reports/{exec_rid}/data", tok_analyst)
    check("executive report reads while entitled", st == 200, str(st))

    from psycopg2.extras import Json
    cur.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
                (Json({k: v for k, v in saved.items() if k != "advanced_reporting"}), pid))
    st, body = call("GET", f"{studio}/reports/{exec_rid}/data", tok_analyst)
    check("removing advanced_reporting makes the read 403", st == 403, f"got {st}")
    check("403 names advanced_reporting",
          "advanced_reporting" in json.dumps(body), json.dumps(body)[:200])

    st, body = call("GET", f"{studio}/reports/{rid}/data", tok_analyst)
    check("the operational report is unaffected (per-requirement gating)",
          st == 200, f"got {st}")

    st, body = call("GET", f"{studio}/templates", tok_analyst)
    keys2 = sorted(t["template_key"] for t in body.get("data", {}).get("items", []))
    check("executive_status disappears from the gallery",
          "executive_status" not in keys2, str(keys2))
    check("other templates remain visible",
          "migration_health_weekly" in keys2, str(keys2))
    print(f"  templates without advanced_reporting: {keys2}")

    cur.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
                (Json(saved), pid))
    st, body = call("GET", f"{studio}/templates", tok_analyst)
    keys3 = sorted(t["template_key"] for t in body.get("data", {}).get("items", []))
    check("restoring the entitlement brings the template back",
          "executive_status" in keys3, str(keys3))

    # removing the add-on itself removes the whole nav entry
    cur.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
                (Json({k: v for k, v in saved.items() if k != "report_studio"}), pid))
    st, body = call("GET", f"{studio}/catalog", tok_analyst)
    check("catalog returns 403 without report_studio", st == 403, f"got {st}")
    st, body = call("GET", f"{studio}/templates", tok_analyst)
    check("templates return 403 without report_studio", st == 403, f"got {st}")
    cur.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
                (Json(saved), pid))
    conn.close()

    # professional tenant must never have had it
    conn = psycopg2.connect(
        host=os.environ["ENGINE_DB_HOST"], port=os.environ["ENGINE_DB_PORT"],
        dbname=os.environ["ENGINE_DB_NAME"], user=os.environ["ENGINE_DB_USER"],
        password=os.environ["ENGINE_DB_PASS"])
    cur = conn.cursor()
    cur.execute("""SELECT count(*) FROM platform.subscriptions s
                   JOIN platform.plans p ON s.plan_id=p.plan_id
                   WHERE p.tier='professional' AND p.entitlements ? 'report_studio'""")
    check("professional plan still has NO report_studio", cur.fetchone()[0] == 0)
    conn.close()

    # ---- report suite untouched -----------------------------------------
    section("8. CURATED REPORT SUITE UNTOUCHED")
    # the existing suite router is prefixed /api/v1/reports, so its endpoints are
    # /api/v1/reports/batches and /api/v1/reports/suite — there is no
    # /api/v1/reports/suite/batches. Studio is a sibling, not a child.
    st, _ = call("GET", f"{base}/api/v1/reports/batches", tok_analyst)
    check("GET /api/v1/reports/batches still responds", st in (200, 403), f"got {st}")
    st, _ = call("GET", f"{base}/api/v1/reports/suite", tok_analyst)
    check("GET /api/v1/reports/suite still responds", st in (200, 403), f"got {st}")
    st, _ = call("GET", f"{base}/api/v1/reports/studio/reports", tok_viewer)
    check("Viewer can list studio reports (reports:read)", st == 200, f"got {st}")
    st, _ = call("POST", f"{studio}/reports", tok_viewer,
                 body={"title": "should be refused", "definition": {
                     "schema_version": 1, "data_source_key": "migration.batch",
                     "sections": [{"id": "s", "type": "kpi",
                                   "bindings": {"aggregation": "count"}}]}})
    check("Viewer cannot CREATE (lacks reports:create) -> 403", st == 403, f"got {st}")

    # ---- summary ---------------------------------------------------------
    print(f"\n{'='*70}\nHTTP END-TO-END RESULT: {len(PASS)} passed, {len(FAIL)} failed\n{'='*70}")
    for name, detail in FAIL:
        print(f"  FAILED: {name}  {detail}")
    return 1 if FAIL else 0


if __name__ == "__main__":
    sys.exit(main())
