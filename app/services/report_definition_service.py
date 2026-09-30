"""OC-REPORT-001 — report definition service.

Owns the report lifecycle and version history.

Two rules shape the design:

  1. A DEFINITION IS IMMUTABLE. Editing creates a new row in
     platform.report_definitions with the next version number. Nothing ever
     UPDATEs a definition, so any version stays reproducible and auditable.

  2. THE DELETE-OWNERSHIP CONTRACT IS MANDATORY AND ENFORCED HERE, not left
     to the route. reports:delete is necessary but not sufficient: a holder may
     delete their OWN report, while deleting another user's report additionally
     requires Super Admin or Tenant Admin. The contract is recorded in
     OC-REPORT-001_phase0_role_grants.sql and this service is where it is
     implemented. Every delete and soft-delete routes through
     ReportAuthorization.authorize_write(..., "delete").
"""
import json
import uuid

# psycopg2 does not adapt dicts to jsonb by default and this project's connector
# registers no adapter, so JSONB parameters must be wrapped explicitly. Passing
# json.dumps(...) as a string raises "invalid input syntax for type json".
from psycopg2.extras import Json
from typing import Any, Dict, List, Optional, Tuple

from app.db.connection import get_db_connection
from app.services.report_authorization import (
    ReportAccessDenied,
    ReportAuthorization,
    ReportNotFound,
)
from app.services.report_datasource_resolver import DataSourceResolver
from app.services.report_definition_validator import SCHEMA_VERSION, validate_definition

VALID_STATUS = ("draft", "published", "archived", "deleted")

# Allowed lifecycle transitions. A report cannot jump draft -> archived, etc.
_TRANSITIONS = {
    "draft":     {"published", "archived"},
    "published": {"archived", "draft"},
    "archived":  {"draft", "deleted"},
    "deleted":   set(),
}

# Writes that create an immutable new version rather than mutating.
_VERSIONED_ACTIONS = ("update_definition",)


class ReportDefinitionService:
    def __init__(self, db=None, resolver=None,
                 permissions_loader=None, entitlements_loader=None):
        self._db = db
        self._permissions_loader = permissions_loader
        self._entitlements_loader = entitlements_loader
        # One resolver, bound to the same connection as the service. Sharing it
        # guarantees every authorisation check and every query sees the SAME
        # view of the DataSource allowlist, rather than each component opening
        # its own pool and potentially seeing a different one.
        self.resolver = resolver or DataSourceResolver(db=db)

    @property
    def db(self):
        if self._db is None:
            self._db = get_db_connection()
        return self._db

    def _auth(self, principal: Dict[str, Any],
              effective_tenant_id: Optional[str] = None) -> ReportAuthorization:
        """Build the authorization context for a principal.

        `effective_tenant_id` is the tenant resolve_tenant() already settled on.
        Callers that have it MUST pass it, otherwise capability and entitlement
        are read from the principal's own JWT tenant and a Super Admin scoping
        into another tenant is judged on the wrong subscription.
        """
        return ReportAuthorization(
            principal, resolver=self.resolver,
            permissions_loader=self._permissions_loader,
            entitlements_loader=self._entitlements_loader,
            effective_tenant_id=effective_tenant_id)

    # -- loading -----------------------------------------------------------

    def get_report(self, report_id: str, *, include_deleted: bool = False,
                   auth: Optional[ReportAuthorization] = None
                   ) -> Dict[str, Any]:
        """Load one report.

        `auth` is optional purely so internal callers that already have a row in
        hand are unaffected. When a principal is supplied, `is_owner` is
        populated using the SAME comparison the list endpoint uses, so the three
        read surfaces (list, detail, /data) agree on ownership instead of one of
        them silently omitting it.
        """
        sql = """
            SELECT id, tenant_id, owner_user_id, catalog_report_key, title,
                   description, status, visibility, current_version_id,
                   derived_from_template_key, derived_from_template_version,
                   origin, origin_recipe_key, origin_answers, template_state,
                   required_permissions, required_entitlements,
                   created_at, updated_at, deleted_at
            FROM platform.reports
            WHERE id = %s
        """
        if not include_deleted:
            sql += " AND deleted_at IS NULL"
        rows = self.db.execute(sql, (report_id,))
        if not rows:
            raise ReportNotFound()
        report = self._report_from_row(rows[0])
        if auth is not None:
            report["is_owner"] = (
                str(report.get("owner_user_id")) == str(auth.user_id))
        return report

    def get_definition(self, report_id: str, version: Optional[int] = None
                       ) -> Dict[str, Any]:
        """The current definition, or a specific historical version."""
        if version is None:
            rows = self.db.execute("""
                SELECT d.id, d.version_no, d.schema_version, d.definition,
                       d.created_by, d.created_at
                FROM platform.report_definitions d
                JOIN platform.reports r ON r.current_version_id = d.id
                WHERE r.id = %s
            """, (report_id,))
        else:
            rows = self.db.execute("""
                SELECT id, version_no, schema_version, definition,
                       created_by, created_at
                FROM platform.report_definitions
                WHERE report_id = %s AND version_no = %s
            """, (report_id, version))
        if not rows:
            raise ReportNotFound("Report version not found")
        return self._definition_from_row(rows[0])

    def list_versions(self, report_id: str) -> List[Dict[str, Any]]:
        rows = self.db.execute("""
            SELECT id, version_no, schema_version, definition,
                   created_by, created_at
            FROM platform.report_definitions
            WHERE report_id = %s
            ORDER BY version_no DESC
        """, (report_id,))
        return [self._definition_from_row(r) for r in rows]

    def list_reports(self, tenant_id: str, principal: Dict[str, Any],
                     scope: str = "all") -> List[Dict[str, Any]]:
        """Catalogue listing. Tenant-scoped by construction; the scope filter is
        a convenience, never an authorisation mechanism."""
        auth = self._auth(principal, tenant_id)
        clauses = ["r.tenant_id = %s", "r.deleted_at IS NULL"]
        params: List[Any] = [str(tenant_id)]

        if scope == "mine":
            clauses.append("r.owner_user_id = %s")
            params.append(auth.user_id)
        elif scope == "shared":
            # NOTE ON PARENTHESES: this clause previously ended with an extra
            # `)`, so `scope=shared` produced invalid SQL and the Studio's
            # "Shared" tab failed at runtime. Nothing exercised the scope filter
            # before, which is why it survived; TestSavedReportsScopeFilter now
            # does.
            clauses.append("""
                (r.owner_user_id <> %s AND EXISTS (
                    SELECT 1 FROM platform.report_access ra
                    WHERE ra.report_id = r.id
                      AND (ra.grantee_user_id = %s
                        OR ra.grantee_role_id IN (
                             SELECT role_id FROM platform.user_roles
                             WHERE user_id = %s)))
                )
            """)
            params.extend([auth.user_id, auth.user_id, auth.user_id])

        sql = f"""
            SELECT r.id, r.tenant_id, r.owner_user_id, r.title, r.description,
                   r.status, r.visibility, r.current_version_id,
                   r.derived_from_template_key, r.derived_from_template_version,
                   r.origin, r.origin_recipe_key, r.template_state,
                   r.created_at, r.updated_at,
                   d.version_no
            FROM platform.reports r
            LEFT JOIN platform.report_definitions d ON d.id = r.current_version_id
            WHERE {' AND '.join(clauses)}
            ORDER BY r.updated_at DESC
        """
        out = []
        for row in self.db.execute(sql, tuple(params)):
            item = self._listing_from_row(row)
            item["is_owner"] = str(item.get("owner_user_id")) == str(auth.user_id)
            # object access still decides visibility
            if not auth.has_object_access(item, db=None):
                continue
            out.append(item)
        return out

    # -- creation ----------------------------------------------------------

    def create_report(
        self,
        principal: Dict[str, Any],
        tenant_id: str,
        title: str,
        definition: Dict[str, Any],
        *,
        description: Optional[str] = None,
        status: str = "draft",
        origin: str = "manual",
        origin_recipe_key: Optional[str] = None,
        origin_answers: Optional[Dict[str, Any]] = None,
        derived_from_template_key: Optional[str] = None,
        derived_from_template_version: Optional[int] = None,
        extra_entitlements: Optional[List[str]] = None,
        allowed_sources: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Create a report and its first immutable version.

        Validating BEFORE insert matters: a definition referencing fields or
        sources the caller cannot read must never be persisted, or the stored
        definition becomes a disclosure channel in its own right.
        """
        auth = self._auth(principal, tenant_id)
        if not title or not str(title).strip():
            raise ReportAccessDenied("Title is required")
        if len(title) > 200:
            raise ReportAccessDenied("Title too long (max 200)")
        if status not in VALID_STATUS:
            raise ReportAccessDenied(f"Invalid status {status!r}")
        if origin not in ("manual", "template", "assistant"):
            raise ReportAccessDenied(f"Invalid origin {origin!r}")

        # validate then authorise, so an unauthorised definition is never written
        errors, norm = validate_definition(
            definition, allowed_sources or auth.visible_data_sources())
        if errors:
            raise ReportAccessDenied(
                "Invalid report definition: " + "; ".join(errors))
        auth.authorize_create(norm and definition, tenant_id)

        # Snapshot the report's own capability requirements: the union of its
        # DataSources' requirements plus, when template-derived, the template's.
        # These are re-checked on EVERY read, so withdrawing an entitlement stops
        # an already-created report from resolving.
        source_specs = [self.resolver.get_spec(k) for k in
                        ReportAuthorization._definition_source_keys(definition)]
        req_perms = sorted({s["required_permission"] for s in source_specs})
        req_ents = sorted({s["required_entitlement"] for s in source_specs})
        if extra_entitlements:
            req_ents = sorted(set(req_ents) | set(extra_entitlements))

        report_id = str(uuid.uuid4())
        self.db.execute("""
            INSERT INTO platform.reports
                (id, tenant_id, owner_user_id, title, description, status,
                 origin, origin_recipe_key, origin_answers,
                 derived_from_template_key, derived_from_template_version,
                 required_permissions, required_entitlements)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (report_id, tenant_id, auth.user_id, title, description, status,
              origin, origin_recipe_key,
              Json(origin_answers) if origin_answers else None,
              derived_from_template_key, derived_from_template_version,
              req_perms, req_ents))

        self._insert_version(report_id, 1, definition, auth.user_id)
        self.db.execute("""
            UPDATE platform.reports SET current_version_id = (
                SELECT id FROM platform.report_definitions
                WHERE report_id = %s AND version_no = 1)
            WHERE id = %s
        """, (report_id, report_id))
        return self.get_report(str(report_id))

    def _insert_version(self, report_id, version_no: int, definition: Dict[str, Any],
                        created_by: str) -> str:
        definition_id = str(uuid.uuid4())
        self.db.execute("""
            INSERT INTO platform.report_definitions
                (id, report_id, version_no, schema_version, definition, created_by)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (definition_id, report_id, version_no, SCHEMA_VERSION,
              Json(definition), created_by))
        return str(definition_id)

    # -- versioned write ---------------------------------------------------

    def update_definition(self, principal: Dict[str, Any], report_id: str,
                          definition: Dict[str, Any], tenant_id: str,
                          *, mark_diverged: bool = False,
                          allowed_sources: Optional[List[Dict[str, Any]]] = None,
                          derived_from_template_version: Optional[int] = None
                          ) -> Dict[str, Any]:
        """Create the NEXT immutable version. Never mutates an existing one.

        `derived_from_template_version` is written in the SAME UPDATE that moves
        current_version_id, so adopting a template update advances the report's
        provenance atomically with the definition it came from. Updating the
        definition without it left the report claiming an old template version
        forever, which made the update banner keep re-offering an update the
        user had already accepted.
        """
        auth = self._auth(principal, tenant_id)
        report = self.get_report(report_id)
        auth.authorize_write(report, "update", tenant_id)

        errors, _norm = validate_definition(
            definition, allowed_sources or auth.visible_data_sources())
        if errors:
            raise ReportAccessDenied(
                "Invalid report definition: " + "; ".join(errors))

        current = self.get_definition(report_id)
        next_version = int(current["version_no"]) + 1
        self._insert_version(report_id, next_version, definition, auth.user_id)
        if derived_from_template_version is not None:
            self.db.execute("""
                UPDATE platform.reports
                SET current_version_id = (
                        SELECT id FROM platform.report_definitions
                        WHERE report_id = %s AND version_no = %s),
                    derived_from_template_version = %s,
                    updated_at = now()
                WHERE id = %s
            """, (report_id, next_version, derived_from_template_version, report_id))
        else:
            self.db.execute("""
                UPDATE platform.reports
                SET current_version_id = (
                        SELECT id FROM platform.report_definitions
                        WHERE report_id = %s AND version_no = %s),
                    updated_at = now()
                WHERE id = %s
            """, (report_id, next_version, report_id))

        if mark_diverged:
            self.db.execute(
                "UPDATE platform.reports SET template_state = 'diverged' WHERE id = %s",
                (report_id,))
        return self.get_report(report_id)

    # -- lifecycle ---------------------------------------------------------

    def set_status(self, principal: Dict[str, Any], report_id: str, new_status: str,
                   tenant_id: str) -> Dict[str, Any]:
        if new_status not in VALID_STATUS:
            raise ReportAccessDenied(f"Invalid status {new_status!r}")
        auth = self._auth(principal, tenant_id)
        report = self.get_report(report_id)

        if new_status == "deleted":
            # THE DELETE-OWNERSHIP CONTRACT, enforced here.
            auth.authorize_write(report, "delete", tenant_id)
            self.db.execute("""
                UPDATE platform.reports
                SET status = 'deleted', deleted_at = now(), updated_at = now()
                WHERE id = %s
            """, (report_id,))
            return self.get_report(report_id, include_deleted=True)

        auth.authorize_write(report, "update", tenant_id)

        if new_status == "published":
            # publishing is a read-advertising act, so the source check applies
            definition = self.get_definition(report_id)
            auth.require_definition_sources(definition)

        current = report["status"]
        if new_status != current and new_status not in _TRANSITIONS.get(current, set()):
            raise ReportAccessDenied(
                f"Cannot move a report from {current!r} to {new_status!r}")

        if new_status == "published":
            self.db.execute(
                "UPDATE platform.reports SET visibility = 'tenant' WHERE id = %s",
                (report_id,))
        self.db.execute(
            "UPDATE platform.reports SET status = %s, updated_at = now() WHERE id = %s",
            (new_status, report_id))
        return self.get_report(report_id)

    def update_shell(self, principal: Dict[str, Any], report_id: str,
                     tenant_id: str, *, title: Optional[str] = None,
                     description: Optional[str] = None) -> Dict[str, Any]:
        """Shell-only edit (name/description). Does NOT create a version, because
        the definition did not change."""
        auth = self._auth(principal, tenant_id)
        report = self.get_report(report_id)
        auth.authorize_write(report, "update", tenant_id)
        if title is not None:
            if not str(title).strip() or len(title) > 200:
                raise ReportAccessDenied("Title must be 1..200 characters")
        self.db.execute("""
            UPDATE platform.reports
            SET title = COALESCE(%s, title),
                description = COALESCE(%s, description),
                updated_at = now()
            WHERE id = %s
        """, (title, description, report_id))
        return self.get_report(report_id)

    def delete_report(self, principal: Dict[str, Any], report_id: str,
                      tenant_id: str) -> Dict[str, Any]:
        """Explicit delete entry point. Delegates to set_status so the ownership
        contract cannot be bypassed by calling a different method."""
        return self.set_status(principal, report_id, "deleted", tenant_id)

    def duplicate(self, principal: Dict[str, Any], report_id: str,
                  tenant_id: str, new_title: Optional[str] = None) -> Dict[str, Any]:
        auth = self._auth(principal, tenant_id)
        report = self.get_report(report_id)
        # Layer 1 (tenant) AND layer 2 (object access) are both required.
        # Layer 2 alone is not enough: it defers to has_object_access, which for a
        # non-draft resolves grants/published visibility and carries no tenant
        # check of its own. Without layer 1, a caller from another tenant could
        # duplicate a PUBLISHED tenant-visible report, and the copy is owned by
        # the caller and therefore readable by them - the same escalation the
        # tenant scope exists to prevent.
        auth.assert_tenant(report, tenant_id)
        auth.require_permission("reports:create")
        # A draft is private to its owner by construction, so duplicating one you
        # cannot read is refused exactly as reading it is.
        auth.require_object_access(report, db=None)
        definition = self.get_definition(report_id)
        return self.create_report(
            auth.principal, tenant_id,
            new_title or f"{report['title']} (copy)",
            definition["definition"],
            description=report.get("description"),
            origin=report.get("origin") or "manual",
            origin_recipe_key=report.get("origin_recipe_key"),
            derived_from_template_key=report.get("derived_from_template_key"),
            derived_from_template_version=report.get(
                "derived_from_template_version"),
            allowed_sources=auth.visible_data_sources(),
        )

    # -- sharing -----------------------------------------------------------

    def grant_access(self, principal: Dict[str, Any], report_id: str,
                     tenant_id: str, grantee_user_id: str) -> Dict[str, Any]:
        auth = self._auth(principal, tenant_id)
        report = self.get_report(report_id)
        definition = self.get_definition(report_id)
        report_with_def = dict(report)
        report_with_def["_definition"] = definition["definition"]

        # Resolve the grantee's effective capability BEFORE granting.
        #
        # This uses a ReportAuthorization built over the SAME resolver and the
        # SAME permission/entitlement loaders as the caller, rather than calling
        # fetch_effective_permissions / get_tenant_entitlements directly. Two
        # reasons: it keeps a single code path for capability resolution, and it
        # means the grantee is evaluated on the same view of the RBAC store as
        # everything else in this request.
        grantee_rows = self.db.execute(
            "SELECT tenant_id::text FROM platform.users WHERE id = %s",
            (grantee_user_id,))
        if not grantee_rows:
            raise ReportNotFound("User not found")
        grantee_tenant = grantee_rows[0][0]
        if str(grantee_tenant) != str(tenant_id):
            raise ReportAccessDenied(
                "cannot share a report outside its tenant")

        grantee_auth = self._auth({
            "sub": str(grantee_user_id),
            "tenant_id": grantee_tenant,
            "roles": [],
        })
        grantee_perms = {f"{r}:{a}" for r, a in grantee_auth.permissions}
        grantee_ents = set(grantee_auth.entitlements)

        info = auth.authorize_share(
            report_with_def, tenant_id, grantee_perms, grantee_ents)

        # An explicit NOT EXISTS rather than ON CONFLICT: the unique index on
        # (report_id, grantee_user_id) is PARTIAL (grantee_user_id IS NOT NULL),
        # and PostgreSQL cannot infer a partial index as an ON CONFLICT arbiter
        # without a matching predicate in the statement.
        self.db.execute("""
            INSERT INTO platform.report_access
                (report_id, grantee_user_id, access_level, granted_by)
            SELECT %s, %s, 'view', %s
            WHERE NOT EXISTS (
                SELECT 1 FROM platform.report_access
                WHERE report_id = %s AND grantee_user_id = %s
            )
        """, (report_id, grantee_user_id, auth.user_id,
              report_id, grantee_user_id))
        return {"granted": True, "grantee_user_id": grantee_user_id, **info}

    def revoke_access(self, principal: Dict[str, Any], report_id: str,
                      tenant_id: str, grantee_user_id: str) -> Dict[str, Any]:
        auth = self._auth(principal, tenant_id)
        report = self.get_report(report_id)
        auth.require_permission("reports:share")
        is_owner = str(report.get("owner_user_id")) == str(auth.user_id)
        if not (is_owner or auth.is_platform_admin or auth.is_tenant_admin):
            raise ReportNotFound()
        self.db.execute("""
            DELETE FROM platform.report_access
            WHERE report_id = %s AND grantee_user_id = %s
        """, (report_id, grantee_user_id))
        return {"revoked": True, "grantee_user_id": grantee_user_id}

    def list_access(self, principal: Dict[str, Any], report_id: str,
                    tenant_id: str) -> List[Dict[str, Any]]:
        auth = self._auth(principal, tenant_id)
        report = self.get_report(report_id)
        # Layer 1 before layer 2: require_object_access defers to
        # has_object_access, which resolves grants/published visibility and has
        # no tenant check of its own. Without the tenant assertion a caller in
        # another tenant could enumerate who a published report is shared with.
        auth.assert_tenant(report, tenant_id)
        auth.require_object_access(report, db=None)
        rows = self.db.execute("""
            SELECT ra.grantee_user_id, u.email, ra.access_level, ra.granted_at
            FROM platform.report_access ra
            JOIN platform.users u ON u.id = ra.grantee_user_id
            WHERE ra.report_id = %s
            ORDER BY ra.granted_at
        """, (report_id,))
        return [{"user_id": str(r[0]), "email": r[1], "access_level": r[2],
                 "granted_at": r[3]} for r in rows]

    # -- helpers -----------------------------------------------------------
    #
    # Each query has its OWN explicit column map. An earlier version shared one
    # positional key list across get_report and get_definition, which silently
    # mislabelled created_at/updated_at/deleted_at and produced no 'definition'
    # key at all. Positional mapping across two different SELECT shapes is not
    # safe, so it is not used anywhere.

    @staticmethod
    def _report_from_row(row) -> Dict[str, Any]:
        keys = ("id", "tenant_id", "owner_user_id", "catalog_report_key",
                "title", "description", "status", "visibility",
                "current_version_id", "derived_from_template_key",
                "derived_from_template_version", "origin", "origin_recipe_key",
                "origin_answers", "template_state", "required_permissions",
                "required_entitlements", "created_at", "updated_at",
                "deleted_at")
        out = {k: row[i] for i, k in enumerate(keys) if i < len(row)}
        for k in ("id", "tenant_id", "owner_user_id", "current_version_id"):
            if out.get(k) is not None:
                out[k] = str(out[k])
        return out

    @staticmethod
    def _definition_from_row(row) -> Dict[str, Any]:
        keys = ("id", "version_no", "schema_version", "definition",
                "created_by", "created_at")
        out = {k: row[i] for i, k in enumerate(keys) if i < len(row)}
        for k in ("id", "created_by"):
            if out.get(k) is not None:
                out[k] = str(out[k])
        return out

    @staticmethod
    def _listing_from_row(row) -> Dict[str, Any]:
        keys = ("id", "tenant_id", "owner_user_id", "title", "description",
                "status", "visibility", "current_version_id",
                "derived_from_template_key", "derived_from_template_version",
                "origin", "origin_recipe_key", "template_state",
                "created_at", "updated_at", "version_no")
        out = {k: row[i] for i, k in enumerate(keys) if i < len(row)}
        for k in ("id", "tenant_id", "owner_user_id", "current_version_id"):
            if out.get(k) is not None:
                out[k] = str(out[k])
        return out
