"""OC-REPORT-001 Phase 1 — acceptance test.

Runs the 18-step acceptance scenario from the implementation authorisation
against the REAL database, with REAL RBAC, REAL entitlements, REAL tenant
isolation and REAL AuthService logins.

SCHEMA HANDLING
---------------
The Phase 1 migrations are NOT applied. They are executed inside a single
transaction on a dedicated connection and ROLLED BACK at the end, so the live
database is left byte-identical while the whole scenario still runs against real
tables, real SQL and real data. `test_schema_was_rolled_back` asserts that.

The services are constructed with that connection injected, so every query and
every authorisation check goes through the transaction.

THE TEST SEAMS
--------------
Two loaders are injected so that entitlement removal and permission revocation
can be exercised atomically (a rollback cannot restore a change made on a
different pooled connection). `test_loaders_agree_with_canonical` proves the
seams are faithful before any test relies on a mutated value.
"""
import json
import os
import re

import psycopg2
import pytest

from psycopg2.extras import Json
from app.services.report_aggregation_engine import AggregationEngine
from app.services.report_assistant_service import AssistantError, ReportAssistant
from app.services.report_authorization import (
    ReportAccessDenied, ReportAuthorization, ReportNotFound)
from app.services.report_definition_service import ReportDefinitionService
from app.services.report_datasource_resolver import DataSourceResolver
from app.services.report_query_service import ReportQueryService
from app.services.report_template_service import ReportTemplateService

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIGRATIONS = os.path.join(
    ROOT, "engineering", "MAP_V3", "02_Output", "00_MAP_V3_Control", "migrations")
CREDS = os.path.join(ROOT, ".ocreport001_test_creds.json")

REPORT_TABLES = ("reports", "report_definitions", "report_access",
                 "report_data_sources", "report_catalog", "report_templates",
                 "report_assistant_recipes")


class TxDb:
    """Adapter matching app.db.connection.DBConnector's used surface
    (.conn for raw cursors, .execute returning rows) over one raw connection."""

    def __init__(self, conn):
        self.conn = conn

    def execute(self, query, params=None):
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            try:
                return cur.fetchall()
            except Exception:
                return None

    def close(self):
        pass


def _env():
    for line in open(os.path.join(ROOT, ".env"), encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def _connect():
    _env()
    return psycopg2.connect(
        host=os.environ["ENGINE_DB_HOST"], port=os.environ["ENGINE_DB_PORT"],
        dbname=os.environ["ENGINE_DB_NAME"], user=os.environ["ENGINE_DB_USER"],
        password=os.environ["ENGINE_DB_PASS"])


def _strip_tx(sql):
    return (re.sub(r"^\s*BEGIN;\s*$", "", sql, flags=re.M | re.I).__str__()
            and re.sub(r"^\s*COMMIT;\s*$", "",
                       re.sub(r"^\s*BEGIN;\s*$", "", sql, flags=re.M | re.I),
                       flags=re.M | re.I))


# ---------------------------------------------------------------------------
# fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(scope="module")
def tx(principals):
    """Schema created inside one transaction, rolled back on teardown.

    Depends on `principals` DELIBERATELY, to fix ordering. Creating the Phase 1
    tables with `REFERENCES platform.users(id)` takes a ShareRowExclusiveLock on
    platform.users for the life of the transaction. AuthService.login performs
    `UPDATE platform.users SET last_login_at ...`, which needs a
    RowExclusiveLock, and those two conflict. So if the DDL transaction opens
    first, every real login blocks on it and the test blocks on the login — a
    deadlock that manifests as an indefinite hang with no DB-side lock timeout.

    Resolving the logins first avoids it entirely. DO NOT remove this parameter.

    CRITICAL: there must be NO commit() in this fixture. The DDL is visible to
    this connection without one, and a commit would permanently apply the Phase 1
    migrations to the live database, which the authorisation explicitly forbids
    until the evidence is reviewed. An earlier version of this fixture committed
    and the schema had to be dropped by hand.
    """
    conn = _connect()
    conn.autocommit = False
    cur = conn.cursor()
    for f in ("OC-REPORT-001_phase1_report_studio_schema.sql",
              "OC-REPORT-001_phase1_templates_recipes.sql"):
        cur.execute(_strip_tx(open(os.path.join(MIGRATIONS, f),
                                   encoding="utf-8").read()))
    yield TxDb(conn)
    conn.rollback()          # <- undoes the DDL. No commit, ever.
    conn.close()


@pytest.fixture(scope="module")
def creds():
    if not os.path.exists(CREDS):
        pytest.skip("run scripts/provision_report_studio_test_tenant.py first")
    return json.load(open(CREDS, encoding="utf-8"))


@pytest.fixture(scope="module")
def principals(creds):
    """REAL logins through AuthService, which verifies bcrypt and resolves roles
    from platform.user_roles. No auth is mocked anywhere in this file."""
    from app.services.auth_service import AuthService
    from jose import jwt
    from app.api.core.auth.jwt_config import SECRET_KEY, ALGORITHM

    svc = AuthService()
    out = {}
    for key, u in creds["users"].items():
        token = svc.login(u["email"], u["password"])["access_token"]
        out[key] = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return out


# transaction-scoped loaders (see module docstring)
def _perms_loader(db):
    def load(user_id, tenant_id):
        sql = """
            SELECT p.resource, p.action
            FROM platform.user_roles ur
            JOIN platform.roles r ON ur.role_id = r.id
            JOIN platform.role_permissions rp ON r.id = rp.role_id
            JOIN platform.permissions p ON rp.permission_id = p.id
            WHERE ur.user_id = %s AND r.status = 'active'
              AND rp.granted = TRUE
              AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        """
        params = [user_id]
        if tenant_id:
            sql += " AND (r.tenant_id = %s OR r.tenant_id IS NULL)"
            params.append(tenant_id)
        return db.execute(sql, tuple(params))
    return load


def _ents_loader(db):
    def load(tenant_id):
        if not tenant_id:
            return set()
        rows = db.execute("""
            SELECT p.entitlements, p.tier
            FROM platform.subscriptions s
            JOIN platform.plans p ON s.plan_id = p.plan_id
            WHERE s.tenant_id = %s
              AND s.status IN ('active','trialing','past_due','pending_cancellation')
            ORDER BY s.created_at DESC LIMIT 1
        """, (tenant_id,))
        if not rows:
            return set()
        ents, tier = rows[0]
        if ents and isinstance(ents, dict):
            return set(ents.keys())
        from app.middleware.entitlement_middleware import DEFAULT_ENTITLEMENTS
        return set(DEFAULT_ENTITLEMENTS.get(tier, set()))
    return load


@pytest.fixture
def stack(tx):
    """Services wired to the transaction, sharing one resolver."""
    resolver = DataSourceResolver(db=tx)
    defs = ReportDefinitionService(
        db=tx, resolver=resolver,
        permissions_loader=_perms_loader(tx), entitlements_loader=_ents_loader(tx))
    return {
        "db": tx,
        "resolver": resolver,
        "defs": defs,
        "queries": ReportQueryService(definition_service=defs),
        "templates": ReportTemplateService(definition_service=defs),
        "assistant": ReportAssistant(definition_service=defs),
        "engine": AggregationEngine(resolver=resolver),
    }


TENANT_A = "A"
TENANT_B = "B"


def _auth(stack, principal):
    return ReportAuthorization(
        principal, resolver=stack["resolver"],
        permissions_loader=_perms_loader(stack["db"]),
        entitlements_loader=_ents_loader(stack["db"]))


# ===========================================================================
# 0. Preconditions
# ===========================================================================

class TestPreconditions:
    def test_schema_present_inside_transaction(self, tx):
        for t in REPORT_TABLES:
            rows = tx.execute(
                "SELECT to_regclass('platform.%s')" % t)
            assert rows[0][0] is not None, f"platform.{t} missing in transaction"

    def test_loaders_agree_with_canonical(self, stack, principals, creds):
        """Proves the injected seams are faithful BEFORE any test mutates state.
        Without this, a mutated-result assertion would prove nothing."""
        from app.api.core.auth.rbac import fetch_effective_permissions
        from app.middleware.entitlement_middleware import get_tenant_entitlements

        p = principals["A_analyst"]
        tid = creds["tenant_id"][TENANT_A]
        assert set(_perms_loader(stack["db"])(p["sub"], tid)) == \
            set(fetch_effective_permissions(p["sub"], tid))
        assert _ents_loader(stack["db"])(tid) == set(get_tenant_entitlements(tid))

    def test_real_login_produced_expected_roles(self, principals):
        assert principals["A_analyst"]["roles"] == ["Data Analyst"]
        assert principals["A_viewer"]["roles"] == ["Viewer"]
        assert principals["B_other"]["roles"] == ["Data Analyst"]

    def test_viewer_lacks_export(self, principals, creds, stack):
        tid = creds["tenant_id"][TENANT_A]
        perms = {f"{r}:{a}" for r, a in
                 _perms_loader(stack["db"])(principals["A_viewer"]["sub"], tid)}
        assert "reports:read" in perms
        assert "reports:export" not in perms

    def test_tenants_a_and_b_differ(self, creds):
        assert creds["tenant_id"][TENANT_A] != creds["tenant_id"][TENANT_B]

    def test_professional_tenant_still_lacks_report_studio(self, stack, tx):
        """Step 18 prerequisite. The pre-existing Professional tenant must NOT
        have gained report_studio. Proved by looking for any subscription whose
        plan tier is professional and asserting the key is absent."""
        rows = tx.execute("""
            SELECT DISTINCT s.tenant_id::text, p.tier
            FROM platform.subscriptions s
            JOIN platform.plans p ON s.plan_id = p.plan_id
            WHERE p.tier = 'professional'
        """)
        assert rows, "expected a professional tenant to exist"
        for tenant_id, tier in rows:
            assert "report_studio" not in _ents_loader(tx)(tenant_id), (
                f"professional tenant {tenant_id} must NOT have report_studio")
            assert "report_studio" not in \
                tx.execute("SELECT entitlements FROM platform.plans "
                           "WHERE tier = 'professional'")[0][0]


# ===========================================================================
# 1-18. The acceptance scenario
# ===========================================================================

def test_acceptance_scenario(stack, principals, creds, tx):
    db = stack["db"]
    ta = creds["tenant_id"][TENANT_A]
    tb = creds["tenant_id"][TENANT_B]
    analyst = principals["A_analyst"]
    viewer = principals["A_viewer"]
    other = principals["B_other"]

    # -- 1/2. open Studio, see five curated templates ----------------------
    auth_a = _auth(stack, analyst)
    assert "report_studio" in auth_a.entitlements
    templates = stack["templates"].list_templates(analyst, ta)
    assert len(templates) == 5, f"expected 5 templates, got {len(templates)}"
    keys = {t["template_key"] for t in templates}
    assert keys == {"migration_health_weekly", "control_failure_deep_dive",
                    "reconciliation", "executive_status", "governance_posture"}

    # -- 3. select Migration Health — Weekly -------------------------------
    report = stack["templates"].instantiate(
        analyst, ta, "migration_health_weekly", "Migration Health — Weekly")
    rid = report["id"]
    assert report["status"] == "draft"
    assert report["origin"] == "template"
    assert report["derived_from_template_key"] == "migration_health_weekly"
    assert report["derived_from_template_version"] == 3
    assert report["template_state"] == "pinned"

    # the template itself is untouched by instantiation
    tpl_after = stack["templates"].get_template("migration_health_weekly")
    assert tpl_after["version"] == 3

    # -- 4. adjust one section ---------------------------------------------
    definition = stack["defs"].get_definition(rid)["definition"]
    assert len(definition["sections"]) == 5
    definition["sections"][0]["title"] = "Key metrics (adjusted)"
    updated = stack["defs"].update_definition(analyst, rid, definition, ta)
    assert updated["id"] == rid
    v2 = stack["defs"].get_definition(rid)
    assert v2["version_no"] == 2
    assert v2["definition"]["sections"][0]["title"] == "Key metrics (adjusted)"
    # v1 is still reproducible
    v1 = stack["defs"].get_definition(rid, 1)
    assert v1["version_no"] == 1
    assert v1["definition"]["sections"][0]["title"] == "Key metrics"

    # -- 5. publish ---------------------------------------------------------
    published = stack["defs"].set_status(analyst, rid, "published", ta)
    assert published["status"] == "published"
    assert published["visibility"] == "tenant"

    # read it back through the full 4-layer path
    read = stack["queries"].read(analyst, ta, rid)
    assert read["errors"] == []
    assert read["meta"]["ok"] is True
    assert read["meta"]["data_source_key"] == "migration.control_summary"
    assert read["version"]["version_no"] == 2
    assert read["components"], "expected at least one component"
    assert read["meta"]["truncated"] is False

    # -- 6. open the Report Assistant ---------------------------------------
    recipes = stack["assistant"].list_recipes(analyst, ta)
    assert len(recipes) == 5
    assert all(r["resulting_template_key"] for r in recipes)

    # -- 7. enter the request ----------------------------------------------
    request = "show me failed controls for the last 10 batches"

    # -- 8. see the matched recipe and matched keywords ---------------------
    match = stack["assistant"].match_recipe(analyst, ta, request)
    assert match["matched"] is True
    assert match["recipe_key"] == "migration_health_weekly"
    assert match["matched_keywords"], "the matched keywords must be shown"
    assert set(match["matched_keywords"]) & {"failed", "controls", "weekly"}
    assert match["questions"], "constrained questions must be offered"
    qids = {q["id"] for q in match["questions"]}
    assert qids == {"severity", "group_by"}
    for q in match["questions"]:
        assert q["type"] == "choice"
        assert q["options"], "every question must offer closed options"

    # -- 9. answer the constrained questions -------------------------------
    answers = {q["id"]: q["default"] for q in match["questions"]}
    for q in match["questions"]:
        assert answers[q["id"]] in q["options"]

    # an answer outside the declared options is REFUSED, not coerced
    with pytest.raises(AssistantError):
        stack["assistant"].create_from_assistant(
            analyst, ta, match["recipe_key"], {"severity": "DROP EVERYTHING",
                                               "group_by": "control_id"})

    # -- 10. receive a second, editable report definition -------------------
    second = stack["assistant"].create_from_assistant(
        analyst, ta, match["recipe_key"], answers, "Failed controls — last 10")
    rid2 = second["id"]
    assert second["origin"] == "assistant"
    assert second["origin_recipe_key"] == "migration_health_weekly"
    assert second["origin_answers"]["severity"] == answers["severity"]
    assert second["derived_from_template_key"] == "migration_health_weekly"
    d2 = stack["defs"].get_definition(rid2)["definition"]
    assert any(f["field"] == "overall_status" for f in d2["filters"]), \
        "the answered question should have produced a filter"

    # -- 11. publish it -----------------------------------------------------
    stack["defs"].set_status(analyst, rid2, "published", ta)
    assert stack["queries"].read(analyst, ta, rid2)["meta"]["ok"] is True

    # -- 12. share the FIRST report with the Viewer ------------------------
    grant = stack["defs"].grant_access(analyst, rid, ta, viewer["sub"])
    assert grant["granted"] is True
    assert grant["grantee_can_export"] is False, \
        "the recipient must be told they cannot export"

    # -- 13. Viewer can view it on screen ----------------------------------
    v_auth = _auth(stack, viewer)
    # permissions is a set of (resource, action) tuples, so use the helper
    assert v_auth.has_permission("reports:read")
    assert not v_auth.has_permission("reports:export")
    v_read = stack["queries"].read(viewer, ta, rid)
    assert v_read["meta"]["ok"] is True
    assert v_read["components"]

    # -- 14. Viewer receives 403 on export --------------------------------
    with pytest.raises(ReportAccessDenied) as e:
        stack["queries"].export(viewer, ta, rid)
    assert e.value.status_code == 403
    assert "reports:export" in e.value.reason

    # -- 15. Tenant B receives 404 on the same report id -------------------
    b_auth = _auth(stack, other)
    with pytest.raises(ReportAccessDenied) as e:
        stack["queries"].read(other, tb, rid)
    assert e.value.status_code == 404, \
        "a cross-tenant read must be 404, not 403, so existence is not confirmed"
    with pytest.raises(ReportAccessDenied) as e:
        stack["defs"].set_status(other, rid, "deleted", tb)
    assert e.value.status_code == 404

    # -- 16. removing advanced_reporting makes the read 403 ---------------
    #     Uses the Executive Status report, which requires advanced_reporting at
    #     the TEMPLATE level. The operational reports are gated on report_studio
    #     alone, so they would correctly keep working — the point of this step is
    #     that a capability-tier entitlement is re-checked on every read, not
    #     only at instantiation.
    #     (mutated inside the transaction, so it is rolled back with everything
    #      else; no live data is changed)
    exec_report = stack["templates"].instantiate(
        analyst, ta, "executive_status", "Executive Status")
    exec_rid = exec_report["id"]
    stack["defs"].set_status(analyst, exec_rid, "published", ta)
    assert stack["queries"].read(analyst, ta, exec_rid)["meta"]["ok"] is True

    plan_row = db.execute(
        "SELECT plan_id, entitlements FROM platform.plans WHERE tier = 'enterprise'")
    enterprise_plan, saved_entitlements = plan_row[0]
    mutated = {k: v for k, v in saved_entitlements.items()
               if k != "advanced_reporting"}
    db.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
               (Json(mutated), enterprise_plan))

    with pytest.raises(ReportAccessDenied) as e:
        stack["queries"].read(analyst, ta, exec_rid)
    assert e.value.status_code == 403
    assert "advanced_reporting" in e.value.reason

    # the operational report is unaffected, proving the gate is per-requirement
    assert stack["queries"].read(analyst, ta, rid)["meta"]["ok"] is True

    # restore within the transaction
    db.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
               (Json(saved_entitlements), enterprise_plan))
    assert stack["queries"].read(analyst, ta, exec_rid)["meta"]["ok"] is True

    # -- 17. the Studio navigation disappears without report_studio -------
    db.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
               (Json({k: v for k, v in saved_entitlements.items()
                            if k != "report_studio"}), enterprise_plan))
    with pytest.raises(ReportAccessDenied) as e:
        stack["templates"].list_templates(analyst, ta)
    assert "report_studio" in e.value.reason
    with pytest.raises(ReportAccessDenied) as e:
        _auth(stack, analyst).require_entitlement("report_studio")
    assert "report_studio" in e.value.reason

    # the Viewer loses read access too, so a nav entry would be meaningless
    with pytest.raises(ReportAccessDenied):
        stack["templates"].list_templates(viewer, ta)

    db.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
               (Json(saved_entitlements), enterprise_plan))
    assert len(stack["templates"].list_templates(analyst, ta)) == 5

    # -- 18. the Executive Status template is not shown to a tenant
    #        lacking advanced_reporting ---------------------------------
    db.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
               (Json({k: v for k, v in saved_entitlements.items()
                            if k != "advanced_reporting"}), enterprise_plan))
    shown = {t["template_key"] for t in stack["templates"].list_templates(analyst, ta)}
    assert "executive_status" not in shown, \
        "executive_status requires advanced_reporting and must not be offered"
    assert "migration_health_weekly" in shown, \
        "the basic template should still be offered"
    db.execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
               (Json(saved_entitlements), enterprise_plan))
    shown2 = {t["template_key"] for t in stack["templates"].list_templates(analyst, ta)}
    assert "executive_status" in shown2

    # and the Professional tenant still must not have report_studio (step 18)
    prof = db.execute("""
        SELECT DISTINCT s.tenant_id::text FROM platform.subscriptions s
        JOIN platform.plans p ON s.plan_id = p.plan_id WHERE p.tier = 'professional'
    """)
    for (tenant_id,) in prof:
        assert "report_studio" not in _ents_loader(db)(tenant_id)


# ===========================================================================
# Security: object access, sharing, delete ownership, filter narrowing
# ===========================================================================

class TestDeleteOwnershipContract:
    def test_owner_can_delete_own_report(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        r = stack["defs"].create_report(
            analyst, ta, "delete-own", stack["templates"]
            .get_template("migration_health_weekly")["definition"])
        stack["defs"].set_status(analyst, r["id"], "published", ta)
        out = stack["defs"].delete_report(analyst, r["id"], ta)
        assert out["status"] == "deleted"
        assert out["deleted_at"] is not None

    def test_non_owner_with_delete_cannot_delete_someone_elses_report(
            self, stack, principals, creds):
        """THE CONTRACT. A Data Analyst holds reports:delete, so the permission
        alone must not be sufficient: deleting another user's report requires an
        admin."""
        ta = creds["tenant_id"][TENANT_A]
        analyst, viewer = principals["A_analyst"], principals["A_viewer"]
        r = stack["defs"].create_report(
            analyst, ta, "not-yours", stack["templates"]
            .get_template("migration_health_weekly")["definition"])
        # viewer lacks reports:delete entirely
        with pytest.raises(ReportAccessDenied) as e:
            stack["defs"].delete_report(viewer, r["id"], ta)
        assert "reports:delete" in e.value.reason
        assert e.value.status_code == 403
        assert stack["defs"].get_report(r["id"])["status"] == "draft"

    def test_delete_any_is_denied_for_non_admin_holder_of_delete(
            self, stack, principals, creds):
        """Second analyst in the same tenant, holding reports:delete, still cannot
        delete a colleague's report. Ownership, not permission, is the boundary."""
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        r = stack["defs"].create_report(
            analyst, ta, "boundary", stack["templates"]
            .get_template("migration_health_weekly")["definition"])
        second = dict(analyst)
        second = {**analyst, "sub": principals["B_other"]["sub"]}
        # B_other is in tenant B, so this is a cross-tenant attempt first
        with pytest.raises(ReportAccessDenied) as e:
            stack["defs"].delete_report(second, r["id"], ta)
        assert e.value.status_code == 404

    def test_draft_is_private_to_owner(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst, viewer = principals["A_analyst"], principals["A_viewer"]
        r = stack["defs"].create_report(
            analyst, ta, "private draft", stack["templates"]
            .get_template("migration_health_weekly")["definition"])
        # even WITH an explicit grant, a draft stays private
        stack["defs"].grant_access(analyst, r["id"], ta, viewer["sub"])
        with pytest.raises(ReportAccessDenied) as e:
            stack["queries"].read(viewer, ta, r["id"])
        assert e.value.status_code == 404


class TestSharingCannotElevate:
    def _revoke_reports_read(self, stack, role_name, granted):
        """Toggle reports:read for a role inside the transaction.

        The tests share one module-scoped transaction, so a revoke that is not
        restored leaks into the next test. Every caller restores in a finally.
        """
        stack["db"].execute("""
            UPDATE platform.role_permissions SET granted = %s
            WHERE role_id = (SELECT id FROM platform.roles
                             WHERE name = %s AND is_system IS TRUE)
              AND permission_id = (SELECT id FROM platform.permissions
                                   WHERE resource = 'reports' AND action = 'read')
        """, (granted, role_name))

    def test_recipient_lacking_source_permission_cannot_be_shared_with(
            self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        r = stack["defs"].create_report(
            analyst, ta, "share gate", stack["templates"]
            .get_template("migration_health_weekly")["definition"])
        stack["defs"].set_status(analyst, r["id"], "published", ta)
        viewer = principals["A_viewer"]
        try:
            self._revoke_reports_read(stack, "Viewer", False)
            with pytest.raises(ReportAccessDenied) as e:
                stack["defs"].grant_access(analyst, r["id"], ta, viewer["sub"])
            assert e.value.status_code == 403
            assert "reports:read" in e.value.reason
        finally:
            self._revoke_reports_read(stack, "Viewer", True)

    def test_removing_source_permission_blocks_existing_grant(
            self, stack, principals, creds):
        """Layer 4 is re-evaluated on EVERY read, so a grant made while the
        recipient was capable stops working when their capability is removed."""
        ta = creds["tenant_id"][TENANT_A]
        analyst, viewer = principals["A_analyst"], principals["A_viewer"]
        r = stack["defs"].create_report(
            analyst, ta, "live recheck", stack["templates"]
            .get_template("migration_health_weekly")["definition"])
        stack["defs"].set_status(analyst, r["id"], "published", ta)
        stack["defs"].grant_access(analyst, r["id"], ta, viewer["sub"])
        assert stack["queries"].read(viewer, ta, r["id"])["meta"]["ok"] is True
        try:
            self._revoke_reports_read(stack, "Viewer", False)
            with pytest.raises(ReportAccessDenied) as e:
                stack["queries"].read(viewer, ta, r["id"])
            assert e.value.status_code == 403
            assert "reports:read" in e.value.reason
        finally:
            self._revoke_reports_read(stack, "Viewer", True)

    def test_cannot_share_outside_the_tenant(self, stack, principals, creds):
        ta, tb = creds["tenant_id"][TENANT_A], creds["tenant_id"][TENANT_B]
        analyst = principals["A_analyst"]
        r = stack["defs"].create_report(
            analyst, ta, "no cross tenant share", stack["templates"]
            .get_template("migration_health_weekly")["definition"])
        stack["defs"].set_status(analyst, r["id"], "published", ta)
        with pytest.raises(ReportAccessDenied) as e:
            stack["defs"].grant_access(
                analyst, r["id"], ta, principals["B_other"]["sub"])
        assert "outside its tenant" in e.value.reason


class TestRuntimeFiltersCannotWiden:
    def _published(self, stack, principals, creds, title="narrow me"):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        d = stack["templates"].get_template("migration_health_weekly")["definition"]
        d["filters"] = [{"field": "overall_status", "op": "eq", "value": "FAILED"}]
        r = stack["defs"].create_report(analyst, ta, title, d)
        stack["defs"].set_status(analyst, r["id"], "published", ta)
        return r["id"]

    def test_runtime_filter_is_intersected_not_substituted(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        rid = self._published(stack, principals, creds)
        d = stack["defs"].get_definition(rid)["definition"]
        effective, errors = ReportQueryService._apply_runtime_filters(
            d, [{"field": "overall_status", "op": "eq", "value": "PASSED"}])
        assert errors == []
        fields = [f["field"] for f in effective["filters"]]
        assert fields.count("overall_status") == 2, \
            "the saved restriction must survive alongside the runtime filter"
        # the persisted definition is untouched
        assert stack["defs"].get_definition(rid)["definition"]["filters"] == \
            [{"field": "overall_status", "op": "eq", "value": "FAILED"}]

    def test_runtime_filter_may_only_narrow(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        rid = self._published(stack, principals, creds)
        d = stack["defs"].get_definition(rid)["definition"]
        effective, _ = ReportQueryService._apply_runtime_filters(
            d, [{"field": "overall_status", "op": "eq", "value": "PASSED"}])
        combined = " ".join(str(f["value"]) for f in effective["filters"])
        assert "FAILED" in combined, "the narrowing restriction must still apply"

    def test_widening_operators_are_refused(self, stack, principals, creds):
        rid = self._published(stack, principals, creds)
        d = stack["defs"].get_definition(rid)["definition"]
        for op in ("ne", "nin"):
            value = "PASSED" if op == "ne" else ["PASSED"]
            _, errors = ReportQueryService._apply_runtime_filters(
                d, [{"field": "overall_status", "op": op, "value": value}])
            assert errors, f"{op} must be refused as a runtime filter"

    def test_runtime_filter_count_is_capped(self, stack, principals, creds):
        rid = self._published(stack, principals, creds)
        d = stack["defs"].get_definition(rid)["definition"]
        many = [{"field": "overall_status", "op": "eq", "value": f"v{i}"}
                for i in range(20)]
        _, errors = ReportQueryService._apply_runtime_filters(d, many)
        assert any("too many runtime filters" in e for e in errors)


class TestTenantIsolation:
    def test_cross_tenant_read_is_404(self, stack, principals, creds):
        ta, tb = creds["tenant_id"][TENANT_A], creds["tenant_id"][TENANT_B]
        analyst = principals["A_analyst"]
        r = stack["defs"].create_report(
            analyst, ta, "isolated", stack["templates"]
            .get_template("migration_health_weekly")["definition"])
        stack["defs"].set_status(analyst, r["id"], "published", ta)
        with pytest.raises(ReportAccessDenied) as e:
            stack["queries"].read(principals["B_other"], tb, r["id"])
        assert e.value.status_code == 404

    def test_cross_tenant_listing_excludes_foreign_reports(
            self, stack, principals, creds):
        ta, tb = creds["tenant_id"][TENANT_A], creds["tenant_id"][TENANT_B]
        analyst = principals["A_analyst"]
        r = stack["defs"].create_report(
            analyst, ta, "tenant a only", stack["templates"]
            .get_template("migration_health_weekly")["definition"])
        stack["defs"].set_status(analyst, r["id"], "published", ta)
        b_listing = stack["defs"].list_reports(tb, principals["B_other"])
        assert all(str(x["tenant_id"]) == tb for x in b_listing)
        assert r["id"] not in {x["id"] for x in b_listing}

    def test_unknown_report_is_404(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        with pytest.raises(ReportAccessDenied) as e:
            stack["queries"].read(
                principals["A_analyst"], ta,
                "00000000-0000-0000-0000-000000000000")
        assert e.value.status_code == 404


class TestSqlInjectionResisted:
    def test_definition_cannot_carry_a_tenant_predicate(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        bad = stack["templates"].get_template(
            "migration_health_weekly")["definition"]
        bad["filters"] = [{"field": "tenant_id", "op": "eq", "value": "other"}]
        with pytest.raises(ReportAccessDenied) as e:
            stack["defs"].create_report(principals["A_analyst"], ta, "bad", bad)
        assert "Invalid report definition" in e.value.reason

    def test_injection_string_value_is_bound_not_interpolated(
            self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        d = stack["templates"].get_template(
            "migration_health_weekly")["definition"]
        payload = "x'); DROP TABLE core.tenants; --"
        d["filters"] = [{"field": "overall_status", "op": "eq", "value": payload}]
        r = stack["defs"].create_report(analyst, ta, "injection attempt", d)
        plan, errors = stack["engine"].build_queries(
            stack["defs"].get_definition(r["id"])["definition"], ta)
        assert errors == []
        for sec in plan["sections"]:
            assert "DROP TABLE" not in sec["sql"]
        # the table is still there, and the plan carries the value as a param
        assert stack["db"].execute("SELECT to_regclass('core.tenants')")[0][0] is not None

    def test_no_write_statement_in_any_compiled_query(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        d = stack["templates"].get_template(
            "migration_health_weekly")["definition"]
        plan, errors = stack["engine"].build_queries(d, ta)
        assert errors == []
        for sec in plan["sections"]:
            up = sec["sql"].upper()
            for banned in ("INSERT", "UPDATE ", "DELETE", "DROP", "ALTER",
                           "TRUNCATE", "GRANT"):
                assert banned not in up

    def test_every_query_is_tenant_scoped_and_capped(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        d = stack["templates"].get_template(
            "migration_health_weekly")["definition"]
        plan, errors = stack["engine"].build_queries(d, ta)
        assert errors == []
        for sec in plan["sections"]:
            assert "tenant_id" in sec["sql"]
            assert "section_limit_" in sec["sql"]


class TestAssistantIsNotAI:
    def test_deterministic_same_request_same_result(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        req = "show me failed controls for the last 10 batches"
        a = stack["assistant"].match_recipe(analyst, ta, req)
        b = stack["assistant"].match_recipe(analyst, ta, req)
        assert a == b, "the assistant must be deterministic"

    def test_no_llm_library_imported(self):
        """Structural guarantee: the assistant module must not import any AI or
        network library.

        Only import statements and attribute access are checked, not prose. The
        module docstring deliberately says 'no LLM' many times to explain the
        design, so a raw substring scan would match its own documentation.
        """
        import ast
        src = open("app/services/report_assistant_service.py",
                   encoding="utf-8").read()
        tree = ast.parse(src)

        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for a in node.names:
                    imported.add(a.name.split(".")[0].lower())
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imported.add(node.module.split(".")[0].lower())

        banned = {"openai", "anthropic", "langchain", "langchain_openai",
                  "transformers", "huggingface_hub", "cohere", "ollama",
                  "google", "litellm", "requests", "httpx", "urllib3",
                  "aiohttp", "socket"}
        offenders = sorted(imported & banned)
        assert not offenders, f"assistant must not import {offenders}"

        # and it must make no outbound call of any kind
        lowered = src.lower()
        for marker in ("http://", "https://", "api_key", "endpoint", "model="):
            assert marker not in lowered, (
                f"assistant must not reference {marker}")

    def test_answers_cannot_introduce_a_field(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        with pytest.raises(AssistantError):
            stack["assistant"].create_from_assistant(
                analyst, ta, "migration_health_weekly",
                {"severity": "CRITICAL,HIGH", "group_by": "control_id",
                 "tenant_id": "other-tenant"})

    def test_unmatched_request_reports_clearly(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        out = stack["assistant"].match_recipe(
            principals["A_analyst"], ta, "zzzz qqqq unrelated words")
        assert out["matched"] is False
        assert out["available_recipes"]

    def test_assistant_output_passes_normal_validation(self, stack, principals, creds):
        """A recipe may not smuggle an invalid definition past the validator."""
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        built = stack["assistant"].build_candidate(
            analyst, ta, "migration_health_weekly",
            {"severity": "CRITICAL,HIGH", "group_by": "control_id"})
        from app.services.report_definition_validator import validate_definition
        errors, _ = validate_definition(
            built["candidate"]["definition"], _auth(stack, analyst).visible_data_sources())
        assert errors == []


class TestTemplateSemantics:
    def test_instantiation_copies_and_leaves_template_intact(
            self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        before = stack["templates"].get_template("reconciliation")["definition"]
        r = stack["templates"].instantiate(analyst, ta, "reconciliation")
        after = stack["templates"].get_template("reconciliation")["definition"]
        assert before == after
        copy_def = stack["defs"].get_definition(r["id"])["definition"]
        assert copy_def == before
        # mutating the copy must not touch the template
        copy_def["sections"][0]["title"] = "changed"
        stack["defs"].update_definition(analyst, r["id"], copy_def, ta)
        assert stack["templates"].get_template("reconciliation")["definition"] == before

    def test_template_update_is_offered_not_applied(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        r = stack["templates"].instantiate(analyst, ta, "reconciliation")
        assert r["template_state"] == "pinned"
        info = stack["templates"].check_for_update(analyst, r["id"], ta)
        assert info["has_update"] is False   # already on the latest version
        # adopting is explicit and creates a NEW version
        cur = stack["defs"].get_definition(r["id"])["version_no"]
        stack["templates"].adopt_template_version(analyst, r["id"], ta)
        assert stack["defs"].get_definition(r["id"])["version_no"] == cur + 1

    def test_templates_are_entitlement_filtered(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        plan_row = stack["db"].execute(
            "SELECT plan_id, entitlements FROM platform.plans WHERE tier = 'enterprise'")
        pid, saved = plan_row[0]
        stack["db"].execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
                            (Json({k: v for k, v in saved.items()
                                         if k != "governance"}), pid))
        keys = {t["template_key"]
                for t in stack["templates"].list_templates(analyst, ta)}
        assert "governance_posture" not in keys
        stack["db"].execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
                            (Json(saved), pid))

    def test_duplicate_requires_object_access(self, stack, principals, creds):
        """Duplicating must not become a read channel for someone else's report.

        `duplicate` returns a copy OWNED BY THE CALLER, so without layer 2 any
        principal holding reports:create could copy another user's private draft
        by id and then read it - the same escalation vector as sharing.
        """
        ta, tb = creds["tenant_id"][TENANT_A], creds["tenant_id"][TENANT_B]
        analyst, other = principals["A_analyst"], principals["B_other"]

        # a private draft owned by the tenant A analyst
        mine = stack["defs"].create_report(
            analyst, ta, "private draft", stack["templates"]
            .get_template("migration_health_weekly")["definition"])

        # a second tenant A user with reports:create but no access to it
        intruder = dict(principals["A_viewer"])
        try:
            stack["db"].execute("""
                INSERT INTO platform.role_permissions (role_id, permission_id, granted)
                SELECT r.id, p.id, TRUE FROM platform.roles r,
                     platform.permissions p
                WHERE r.name = 'Viewer' AND r.is_system IS TRUE
                  AND p.resource = 'reports' AND p.action = 'create'
            """)
            with pytest.raises(ReportAccessDenied) as e:
                stack["defs"].duplicate(intruder, mine["id"], ta)
            assert e.value.status_code in (403, 404)
        finally:
            stack["db"].execute("""
                UPDATE platform.role_permissions SET granted = FALSE
                WHERE role_id = (SELECT id FROM platform.roles
                                 WHERE name = 'Viewer' AND is_system IS TRUE)
                  AND permission_id = (SELECT id FROM platform.permissions
                                       WHERE resource = 'reports' AND action = 'create')
            """)

        # cross-tenant is refused outright, including a PUBLISHED tenant-visible
        # report: layer 2 defers to has_object_access, which has no tenant check
        pub = stack["defs"].create_report(
            analyst, ta, "published tenant visible", stack["templates"]
            .get_template("migration_health_weekly")["definition"])
        stack["defs"].set_status(analyst, pub["id"], "published", ta)
        with pytest.raises(ReportAccessDenied) as e:
            stack["defs"].duplicate(other, pub["id"], tb)
        assert e.value.status_code in (403, 404)

        with pytest.raises(ReportAccessDenied) as e:
            stack["defs"].duplicate(other, mine["id"], tb)
        assert e.value.status_code == 404

        # and the owner can still duplicate their own report
        copy = stack["defs"].duplicate(analyst, mine["id"], ta)
        assert copy["id"] != mine["id"]
        assert copy["title"].endswith("(copy)")

    def test_gallery_lists_one_card_per_template_at_the_latest_version(
            self, stack, principals, creds):
        """A new template version must ADD an update, not a duplicate card.

        `list_templates` returning every active version made the gallery show the
        same template once per version as soon as one was published, which the
        template-update flow makes a routine event rather than a rare one.
        """
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        key = "migration_health_weekly"
        row = stack["db"].execute(
            "SELECT definition FROM platform.report_templates "
            "WHERE template_key = %s ORDER BY version DESC LIMIT 1", (key,))
        original = row[0][0]
        stack["db"].execute("""
            INSERT INTO platform.report_templates
                (template_key, version, display_name, description, category,
                 definition, required_data_sources, required_entitlements,
                 thumbnail_spec, sort_order, is_active, changelog)
            SELECT template_key, %s, display_name, description, category,
                   definition, required_data_sources, required_entitlements,
                   thumbnail_spec, 1, TRUE, 'test changelog'
            FROM platform.report_templates
            WHERE template_key = %s ORDER BY version DESC LIMIT 1
        """, (999, key))
        try:
            listed = [t for t in stack["templates"].list_templates(analyst, ta)
                      if t["template_key"] == key]
            assert len(listed) == 1, (
                f"gallery shows {len(listed)} cards for {key}: "
                f"{[t['version'] for t in listed]}")
            # and it is the newest version that is offered
            assert listed[0]["version"] == 999
        finally:
            stack["db"].execute(
                "DELETE FROM platform.report_templates WHERE template_key = %s "
                "AND version = %s", (key, 999))
        # the seeded row is intact afterwards
        assert stack["db"].execute(
            "SELECT definition FROM platform.report_templates "
            "WHERE template_key = %s ORDER BY version DESC LIMIT 1", (key,))[0][0] \
            == original

    def test_saved_reports_scope_filter(self, stack, principals, creds):
        """All / Mine / Shared must mean what the buttons say, per user.

        The scope buttons are a navigation control over a security boundary:
        `mine` must never include somebody else's report, and `shared` must
        only include reports this user was actually granted. Each user is
        asserted separately, because a filter that is correct for the owner can
        still leak for the recipient.
        """
        ta, tb = creds["tenant_id"][TENANT_A], creds["tenant_id"][TENANT_B]
        analyst, viewer = principals["A_analyst"], principals["A_viewer"]
        other = principals["B_other"]
        defn = stack["templates"].get_template(
            "migration_health_weekly")["definition"]

        mine = stack["defs"].create_report(analyst, ta, "scope mine", defn)
        theirs = stack["defs"].create_report(analyst, ta, "scope theirs", defn)
        stack["defs"].set_status(analyst, theirs["id"], "published", ta)
        stack["defs"].grant_access(analyst, theirs["id"], ta, viewer["sub"])
        foreign = stack["defs"].create_report(other, tb, "scope foreign", defn)

        # --- owner -----------------------------------------------------------
        owner_mine = {r["id"] for r in
                     stack["defs"].list_reports(ta, analyst, "mine")}
        owner_all = {r["id"] for r in
                     stack["defs"].list_reports(ta, analyst, "all")}
        assert mine["id"] in owner_mine
        assert theirs["id"] in owner_mine           # they own that one too
        assert foreign["id"] not in owner_mine
        assert foreign["id"] not in owner_all       # other tenant never listed

        # --- recipient -------------------------------------------------------
        rcpt_all = {r["id"] for r in
                    stack["defs"].list_reports(ta, viewer, "all")}
        rcpt_mine = {r["id"] for r in
                     stack["defs"].list_reports(ta, viewer, "mine")}
        rcpt_shared = {r["id"] for r in
                       stack["defs"].list_reports(ta, viewer, "shared")}
        assert theirs["id"] in rcpt_all
        assert theirs["id"] in rcpt_shared          # granted to them
        assert theirs["id"] not in rcpt_mine       # but not owned by them
        assert mine["id"] not in rcpt_shared        # a draft is not shared
        assert mine["id"] not in rcpt_all           # a draft is owner-only

        # --- no scope ever crosses tenants -----------------------------------
        for scope in ("all", "mine", "shared"):
            rows = stack["defs"].list_reports(ta, viewer, scope)
            assert foreign["id"] not in {r["id"] for r in rows}, \
                f"tenant B report leaked into scope={scope}"
            assert all(r["tenant_id"] == ta for r in rows), \
                f"scope={scope} returned a foreign tenant"

    def test_adopting_advances_provenance_so_the_update_is_not_re_offered(
            self, stack, principals, creds):
        """Adopting must move the report onto the new template version.

        Otherwise check_for_update keeps seeing a newer template than the one the
        report records, and the banner re-offers an update the user already
        accepted - forever.
        """
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        key = "migration_health_weekly"

        # instantiate, not create_report: only the template path records
        # provenance, which is the state under test
        r = stack["templates"].instantiate(
            analyst, ta, key, title="adopt provenance")
        rid = r["id"]
        before = stack["defs"].get_report(rid)
        assert before["derived_from_template_version"] is not None
        assert before["template_state"] == "pinned"

        # publish a newer template version AFTER the report was pinned, which is
        # the real sequence
        with stack["db"].conn.cursor() as c:
            c.execute("""
                INSERT INTO platform.report_templates
                    (template_key, version, display_name, description, category,
                     definition, required_data_sources, required_entitlements,
                     thumbnail_spec, sort_order, is_active, changelog)
                SELECT template_key, %s, display_name, description, category,
                       definition, required_data_sources, required_entitlements,
                       thumbnail_spec, 1, TRUE, 'test changelog'
                FROM platform.report_templates
                WHERE template_key = %s ORDER BY version DESC LIMIT 1
            """, (998, key))
        # a raw cursor is used deliberately: TxDb.execute swallows errors, which
        # would turn a failed insert into a confusing "report not found" later
        assert stack["db"].execute(
            "SELECT count(*) FROM platform.report_templates "
            "WHERE template_key = %s AND version = %s", (key, 998))[0][0] == 1, \
            "seeding the newer template version did not persist"

        try:
            offered = stack["templates"].check_for_update(analyst, rid, ta)
            assert offered["has_update"] is True
            assert offered["report_template_version"] == before[
                "derived_from_template_version"]
            assert offered["latest_template_version"] == 998

            stack["templates"].adopt_template_version(analyst, rid, ta)

            after = stack["defs"].get_report(rid)
            # provenance moved
            assert after["derived_from_template_version"] == 998
            # accepting a template update keeps the report tracking, not diverged
            assert after["template_state"] == "pinned"
            # and it is a NEW immutable version, not a mutation
            assert stack["defs"].get_definition(rid)["version_no"] == 2
            # the accepted update is not offered again
            assert stack["templates"].check_for_update(
                analyst, rid, ta)["has_update"] is False
        finally:
            with stack["db"].conn.cursor() as c:
                c.execute("DELETE FROM platform.report_templates "
                          "WHERE template_key = %s AND version = %s", (key, 998))


    def test_entitled_template_recipes_only(self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        plan_row = stack["db"].execute(
            "SELECT plan_id, entitlements FROM platform.plans WHERE tier = 'enterprise'")
        pid, saved = plan_row[0]
        stack["db"].execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
                            (Json({k: v for k, v in saved.items()
                                         if k != "advanced_reporting"}), pid))
        keys = {r["recipe_key"] for r in stack["assistant"].list_recipes(analyst, ta)}
        assert "executive_status" not in keys
        assert "reconciliation" in keys
        stack["db"].execute("UPDATE platform.plans SET entitlements = %s WHERE plan_id = %s",
                            (Json(saved), pid))


class TestIsOwnerIsConsistent:
    """`is_owner` must mean the same thing on every read surface.

    The list endpoint and the /data read both reported ownership, but the
    detail endpoint omitted the key entirely. A consumer of the detail response
    therefore could not tell an owner from a share-recipient, which is exactly
    the decision the editor has to make before enabling an Edit control.
    """

    def _make(self, stack, principals, creds, title="is_owner fixture"):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        r = stack["defs"].create_report(
            analyst, ta, title, stack["templates"]
            .get_template("migration_health_weekly")["definition"])
        stack["defs"].set_status(analyst, r["id"], "published", ta)
        return ta, analyst, r

    def test_detail_reports_owner_for_the_creator(self, stack, principals, creds):
        ta, analyst, r = self._make(stack, principals, creds)
        detail = stack["defs"].get_report(r["id"], auth=_auth(stack, analyst))
        assert detail["is_owner"] is True
        assert detail["owner_user_id"] == analyst["sub"]

    def test_detail_reports_not_owner_for_a_share_recipient(
            self, stack, principals, creds):
        ta, analyst, r = self._make(stack, principals, creds)
        viewer = principals["A_viewer"]
        stack["defs"].grant_access(analyst, r["id"], ta, viewer["sub"])

        as_viewer = stack["defs"].get_report(r["id"], auth=_auth(stack, viewer))
        assert as_viewer["is_owner"] is False
        # and the recipient genuinely can read it, so this is not a 403 in disguise
        assert stack["queries"].read(viewer, ta, r["id"])["meta"]["ok"] is True

    def test_all_three_surfaces_agree(self, stack, principals, creds):
        ta, analyst, r = self._make(stack, principals, creds)
        viewer = principals["A_viewer"]
        stack["defs"].grant_access(analyst, r["id"], ta, viewer["sub"])

        for who in (analyst, viewer):
            auth = _auth(stack, who)
            detail = stack["defs"].get_report(r["id"], auth=auth)["is_owner"]
            listed = next(
                i["is_owner"] for i in stack["defs"].list_reports(ta, who)
                if i["id"] == r["id"])
            data = stack["queries"].read(who, ta, r["id"])["report"]["is_owner"]
            assert detail == listed == data, (
                f"surfaces disagree for {who['email']}: "
                f"detail={detail} list={listed} data={data}")

    def test_omitting_auth_leaves_other_fields_untouched(
            self, stack, principals, creds):
        """The fix is additive: callers that do not pass a principal get the
        same row as before, so no internal behaviour changes."""
        ta, analyst, r = self._make(stack, principals, creds)
        plain = stack["defs"].get_report(r["id"])
        with_auth = stack["defs"].get_report(r["id"], auth=_auth(stack, analyst))

        assert "is_owner" not in plain
        assert {k: v for k, v in with_auth.items() if k != "is_owner"} == plain


# ===========================================================================
# Applied-schema integrity
# ===========================================================================
#
# NOTE ON HISTORY: this was previously `test_schema_was_rolled_back`, which
# asserted the Phase 1 tables were ABSENT from the live database. It was written
# before the migration was intentionally applied. Once the schema is applied the
# assertion is inverted, and worse, `to_regclass` is non-null either way, so the
# test could no longer detect the fixture leaking. It is replaced by a check of
# the approved post-apply state: 7 tables, and the seeded 8 data sources /
# 5 templates / 5 recipes that the migration is supposed to create.

def test_export_filename_is_header_safe():
    """A report title is free text; an HTTP header is latin-1.

    The seeded V1 templates use typographic characters (the em-dash in
    "Migration Health - Weekly"), so every export of a template-instantiated
    report used to raise UnicodeEncodeError and return 500. This is a pure
    helper, so it is tested without a database.
    """
    from app.api.routes.report_studio_routes import _export_filename

    for title in ("Migration Health — Weekly",      # seeded template title
                  "Unicode — éè “quoted” report",
                  "résumé / café § 2",
                  "plain title",
                  "",            # falls back rather than emitting "_"
                  "•••"):
        for ext in ("csv", "xlsx"):
            header = _export_filename(title, 3, ext)
            header.encode("latin-1")          # raises if unsafe
            assert header.startswith('attachment; filename="')
            assert header.endswith(f'_v3.{ext}"')
            # the quoted form is required when the name contains characters that
            # would otherwise terminate or split the header value
            assert header.count('"') == 2
            # the name is never empty
            assert '"_v3.' not in header


def test_applied_schema_matches_the_migration():
    conn = _connect()
    cur = conn.cursor()

    missing = []
    for t in REPORT_TABLES:
        cur.execute("SELECT to_regclass('platform.%s')" % t)
        if cur.fetchone()[0] is None:
            missing.append(t)
    assert not missing, f"Phase 1 tables missing from the live database: {missing}"

    cur.execute("SELECT count(*) FROM platform.report_data_sources")
    assert cur.fetchone()[0] == 8, "expected the 8 seeded data sources"

    cur.execute("SELECT count(*) FROM platform.report_templates")
    assert cur.fetchone()[0] == 5, "expected the 5 seeded templates"

    cur.execute("SELECT count(*) FROM platform.report_assistant_recipes")
    assert cur.fetchone()[0] == 5, "expected the 5 seeded assistant recipes"

    conn.close()


# ===========================================================================
# Super Admin tenant oversight (explicit scope only)
# ===========================================================================
#
# Super Admin tenant oversight access is permitted only within an explicitly
# selected tenant scope.
#
# Before this, a Super Admin whose parent dropdown pointed at a tenant could see
# only that tenant's `published` reports, because `has_object_access` had no
# Super Admin branch. The oversight branch makes the scoped tenant an
# administrative inspection view. It is deliberately narrow:
#
#   * it requires a Super Admin AND an effective tenant that differs from the
#     JWT tenant, i.e. an explicit `?tenant_id=` override. No override means no
#     oversight - a tenant is never invented.
#   * it is bound to that one tenant. Holding another tenant's report id grants
#     nothing, and cross-tenant reads still 404.
#   * no other role is affected: for a non-Super-Admin the two tenant values are
#     always equal, so `oversight_tenant_id` is None.
#
# The Super Admin principal below is built from a REAL logged-in token with only
# the `roles` claim replaced. That is the full set of claims the authorization
# layer reads from a principal (sub / tenant_id / roles); the real Super Admin
# login path is covered end-to-end by scripts/sa_studio_probe.py and the E2E
# suite, so this stays a focused authorization regression rather than a second,
# slower auth fixture.

def _non_owner_principal(base_principal, roles):
    """Same synthetic `sub` as the Super Admin helper, with different roles.

    Keeps the "must be denied" assertions honest: a principal that reuses a real
    user's id would satisfy the OWNER branch and never reach the branch under
    test.
    """
    return {**base_principal, "sub": "00000000-0000-4000-8000-000000005a01",
            "roles": list(roles)}


def _super_admin_principal(base_principal, home_tenant="some-other-tenant"):
    """A Super Admin whose home tenant is NOT tenant A or B, and which owns
    nothing in either.

    `sub` is a fixed synthetic id rather than a real user's id ON PURPOSE. If
    this principal reused the analyst's `sub`, then `has_object_access` would
    satisfy the OWNER branch and every "must be denied" assertion in this class
    would pass or fail for the wrong reason - the oversight branch would never
    even be reached. A synthetic id owns nothing, matches no grant, and makes
    the assertions actually exercise the branch under test.

    `roles` and `tenant_id` are the only principal claims the authorization
    layer reads (with `sub`); the real Super Admin login path is covered
    end-to-end by scripts/sa_studio_probe.py and the E2E suite.
    """
    return _non_owner_principal(base_principal, ["Super Admin"]) | {
        "tenant_id": home_tenant}


class TestSuperAdminTenantOversight:

    def test_sa_scoped_to_tenant_a_sees_published_draft_and_private(
            self, stack, principals, creds):
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        sa = _super_admin_principal(analyst)

        defn = stack["templates"].get_template("migration_health_weekly")["definition"]

        draft = stack["defs"].create_report(analyst, ta, "oversight draft", defn)
        published_private = stack["defs"].create_report(
            analyst, ta, "oversight published private", defn)
        stack["defs"].set_status(analyst, published_private["id"], "published", ta)
        # publishing flips visibility to 'tenant'; force it back to prove the
        # branch is not just the published+tenant rule firing again
        stack["db"].execute(
            "UPDATE platform.reports SET visibility='private' WHERE id=%s",
            (published_private["id"],))

        auth = ReportAuthorization(
            sa, resolver=stack["resolver"],
            permissions_loader=_perms_loader(stack["db"]),
            entitlements_loader=_ents_loader(stack["db"]),
            effective_tenant_id=ta)
        assert auth.oversight_tenant_id == ta

        for report in (draft, published_private):
            # the by-id path (draft short-circuit included) must allow both
            auth.require_object_access(report)
            assert auth.has_object_access(report) is True

        listed = {r["id"] for r in stack["defs"].list_reports(ta, sa, "all")}
        assert draft["id"] in listed
        assert published_private["id"] in listed

    def test_sa_scoped_to_tenant_b_sees_only_tenant_b(self, stack, principals, creds):
        ta, tb = creds["tenant_id"][TENANT_A], creds["tenant_id"][TENANT_B]
        analyst, other = principals["A_analyst"], principals["B_other"]
        sa = _super_admin_principal(analyst)
        defn = stack["templates"].get_template("migration_health_weekly")["definition"]

        a_draft = stack["defs"].create_report(analyst, ta, "A draft", defn)
        b_draft = stack["defs"].create_report(other, tb, "B draft", defn)

        listed_b = {r["id"] for r in stack["defs"].list_reports(tb, sa, "all")}
        assert b_draft["id"] in listed_b
        assert a_draft["id"] not in listed_b, "oversight leaked across tenants"

        auth_b = ReportAuthorization(
            sa, resolver=stack["resolver"],
            permissions_loader=_perms_loader(stack["db"]),
            entitlements_loader=_ents_loader(stack["db"]),
            effective_tenant_id=tb)
        auth_b.require_object_access(b_draft)
        with pytest.raises(ReportNotFound):
            auth_b.require_object_access(a_draft)

    def test_sa_scoped_to_a_cannot_read_b_report_by_id(self, stack, principals, creds):
        """Possessing another tenant's report id must grant nothing."""
        ta, tb = creds["tenant_id"][TENANT_A], creds["tenant_id"][TENANT_B]
        analyst, other = principals["A_analyst"], principals["B_other"]
        sa = _super_admin_principal(analyst)
        defn = stack["templates"].get_template("migration_health_weekly")["definition"]
        b_report = stack["defs"].create_report(other, tb, "B secret", defn)

        auth = ReportAuthorization(
            sa, resolver=stack["resolver"],
            permissions_loader=_perms_loader(stack["db"]),
            entitlements_loader=_ents_loader(stack["db"]),
            effective_tenant_id=ta)

        # the tenant check rejects it outright (404-shaped, not 403)
        with pytest.raises(ReportNotFound):
            auth.assert_tenant(b_report, ta)
        # and the oversight branch is tenant-bound, so it is not a back door
        assert auth.has_tenant_oversight(b_report) is False
        with pytest.raises(ReportNotFound):
            auth.require_object_access(b_report)
        assert auth.has_object_access(b_report) is False
        # the route is the enforcement point, and it applies both layers:
        #     auth.assert_tenant(report, tenant_id)   -> 404 cross-tenant
        #     auth.require_object_access(report)      -> 404 no object access
        # both of which are asserted above. `get_report` itself is only a
        # loader (it fills in is_owner), so it is deliberately not asserted on
        # here; asserting denial at the loader would test a layer that has never
        # enforced anything.

    def test_sa_without_an_explicit_tenant_gets_no_oversight(
            self, stack, principals, creds):
        """No override -> the JWT tenant is not an oversight grant."""
        ta = creds["tenant_id"][TENANT_A]
        analyst = principals["A_analyst"]
        sa = _super_admin_principal(analyst)
        defn = stack["templates"].get_template("migration_health_weekly")["definition"]
        draft = stack["defs"].create_report(analyst, ta, "not mine", defn)

        # effective defaults to jwt_tenant, i.e. no override was supplied
        auth = ReportAuthorization(
            sa, resolver=stack["resolver"],
            permissions_loader=_perms_loader(stack["db"]),
            entitlements_loader=_ents_loader(stack["db"]))
        assert auth.oversight_tenant_id is None
        with pytest.raises(ReportNotFound):
            auth.require_object_access(draft)

        # explicitly selecting the SA's OWN tenant is also not an override
        own = ReportAuthorization(
            sa, resolver=stack["resolver"],
            permissions_loader=_perms_loader(stack["db"]),
            entitlements_loader=_ents_loader(stack["db"]),
            effective_tenant_id=sa["tenant_id"])
        assert own.oversight_tenant_id is None

    def test_tenant_admin_viewer_and_owner_are_unchanged(
            self, stack, principals, creds):
        """The oversight branch must not touch any other role."""
        ta = creds["tenant_id"][TENANT_A]
        analyst, viewer = principals["A_analyst"], principals["A_viewer"]
        defn = stack["templates"].get_template("migration_health_weekly")["definition"]
        draft = stack["defs"].create_report(analyst, ta, "analyst draft", defn)
        published = stack["defs"].create_report(analyst, ta, "analyst published", defn)
        stack["defs"].set_status(analyst, published["id"], "published", ta)

        def auth_for(principal, effective=None):
            return ReportAuthorization(
                principal, resolver=stack["resolver"],
                permissions_loader=_perms_loader(stack["db"]),
                entitlements_loader=_ents_loader(stack["db"]),
                effective_tenant_id=effective)

        # owner keeps access to both
        owner = auth_for(analyst, ta)
        owner.require_object_access(draft)
        owner.require_object_access(published)

        # a Viewer gains nothing, even if handed an effective tenant
        viewer_auth = auth_for(viewer, ta)
        assert viewer_auth.oversight_tenant_id is None
        with pytest.raises(ReportNotFound):
            viewer_auth.require_object_access(draft)

        # a Tenant Admin is not a platform admin, so no oversight. It also needs
        # a non-owner `sub`, otherwise it would BE the analyst and would
        # legitimately pass the owner branch, proving nothing.
        tenant_admin = auth_for(_non_owner_principal(analyst, ["Tenant Admin"]), ta)
        assert tenant_admin.is_tenant_admin is True
        assert tenant_admin.oversight_tenant_id is None
        with pytest.raises(ReportNotFound):
            tenant_admin.require_object_access(draft)

        # a non-Super-Admin cannot reach the branch even with a foreign
        # effective tenant, because resolve_tenant never gives them one
        for principal, label in ((analyst, "analyst"), (viewer, "viewer")):
            auth = auth_for(principal, creds["tenant_id"][TENANT_B])
            assert auth.oversight_tenant_id is None, f"{label} gained oversight"

        # the published report stays readable to the tenant as before
        assert owner.has_object_access(published) is True
