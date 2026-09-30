"""OC-REPORT-001 — the single report authorisation authority.

Every Studio read and write passes through this module. There is deliberately no
second authorisation path: if a new endpoint needs a check, it calls here rather
than re-implementing, because the existing codebase already demonstrates the
cost of three competing patterns (see the export leak fixed in Phase 0).

Reuses existing MAP Nexus primitives rather than creating new ones:

    Identity -> Role -> Permission   app/api/core/auth/rbac.py
                                     fetch_effective_permissions / is_super_admin
    Entitlement                     app/middleware/entitlement_middleware.py
                                     get_tenant_entitlements
    Tenant scope                    app/api/core/auth/dependencies.py
                                     resolve_tenant (applied by the route)
    Object ownership                this module, over platform.reports

The four layers, all of which must hold:

    1. TENANT     the report belongs to the caller's effective tenant
    2. OBJECT     owner, an explicit access grant, or published to the tenant
    3. CAPABILITY the reports:* permission for the operation
    4. SOURCE     the DataSource's permission AND entitlement

Layer 4 is the one that is easy to omit and is the reason sharing is safe:
sharing grants visibility of a result, never the ability to read, re-derive or
export the underlying data. It is re-evaluated on EVERY read, so removing a
DataSource permission or an entitlement immediately blocks access.
"""
from typing import Any, Dict, List, Optional, Sequence, Set, Tuple

from app.api.core.auth.rbac import fetch_effective_permissions, is_super_admin
from app.middleware.entitlement_middleware import get_tenant_entitlements
from app.services.report_datasource_resolver import DataSourceResolver


class ReportAccessDenied(Exception):
    """Authorisation failure. `status_code` is 404 for a cross-tenant report so
    the API does not confirm that a foreign report exists."""

    def __init__(self, reason: str, status_code: int = 403):
        self.reason = reason
        self.status_code = status_code
        super().__init__(reason)


class ReportNotFound(ReportAccessDenied):
    def __init__(self, reason: str = "Report not found"):
        super().__init__(reason, status_code=404)


class ReportAuthorization:
    """Resolves the caller's effective capabilities once, then answers the
    authorisation questions against a report or a data source.

    `permissions_loader` and `entitlements_loader` exist as a testability seam.
    In production both are None and the CANONICAL MAP Nexus functions are used
    (fetch_effective_permissions, get_tenant_entitlements) — there is no
    alternative runtime path. They are injectable only so a test can exercise
    entitlement removal and permission revocation atomically, without mutating
    live data that a rollback would not cleanly restore.
    """

    def __init__(self, principal: Dict[str, Any],
                 resolver: Optional[DataSourceResolver] = None,
                 permissions_loader=None, entitlements_loader=None,
                 effective_tenant_id: Optional[str] = None):
        """`effective_tenant_id` is the tenant the ROUTE settled on via
        `resolve_tenant` - the JWT tenant for everyone, or a Super Admin's
        `?tenant_id=` override.

        It is what capability and entitlement lookups must use, because that is
        the tenant whose subscription and roles are in force. Reading them from
        `jwt_tenant` instead made the override partially inert: `?tenant_id=`
        correctly re-scoped the rows a Super Admin could see, but the entitlement
        gate still consulted their own tenant's plan, so every entitlement-gated
        Studio route returned 403 no matter which tenant was selected.

        Defaults to the JWT tenant, so a caller that does not pass it behaves
        exactly as before. For any non-Super-Admin the two are identical, which
        is why this cannot change another role's access.
        """
        self.principal = principal or {}
        self.user_id = self.principal.get("sub")
        self.jwt_tenant = self.principal.get("tenant_id")
        self.effective_tenant_id = effective_tenant_id or self.jwt_tenant
        self.roles = set(self.principal.get("roles") or [])
        self._permissions: Optional[Set[Tuple[str, str]]] = None
        self._entitlements: Optional[Set[str]] = None
        self._permissions_loader = permissions_loader
        self._entitlements_loader = entitlements_loader
        self.resolver = resolver or DataSourceResolver()

    # -- effective capability ---------------------------------------------

    @property
    def permissions(self) -> Set[Tuple[str, str]]:
        """(resource, action) pairs from the canonical RBAC store."""
        if self._permissions is None:
            if not self.user_id:
                self._permissions = set()
            elif self._permissions_loader is not None:
                self._permissions = set(self._permissions_loader(
                    self.user_id, self.effective_tenant_id))
            else:
                # fetch_effective_permissions already scopes by the tenant's
                # roles and honours granted=TRUE and role expiry.
                self._permissions = set(
                    fetch_effective_permissions(self.user_id, self.effective_tenant_id))
        return self._permissions

    def has_permission(self, permission: str) -> bool:
        resource, _, action = permission.partition(":")
        if not action:
            return False
        return (resource, action) in self.permissions

    def require_permission(self, permission: str) -> None:
        if not self.has_permission(permission):
            raise ReportAccessDenied(
                f"Missing permission: {permission}")

    @property
    def entitlements(self) -> Set[str]:
        """Effective entitlements for the effective tenant.

        Read through get_tenant_entitlements, the canonical runtime source. It
        is deliberately NOT reconstructed here. The tenant consulted is
        `effective_tenant_id` - the one resolve_tenant settled on - because a
        tenant's plan is what grants entitlements, and a Super Admin scoping
        into a subscribed tenant must be judged on THAT tenant's plan.
        """
        if self._entitlements is None:
            if not self.effective_tenant_id:
                self._entitlements = set()
            elif self._entitlements_loader is not None:
                self._entitlements = set(self._entitlements_loader(
                    self.effective_tenant_id))
            else:
                self._entitlements = set(
                    get_tenant_entitlements(self.effective_tenant_id))
        return self._entitlements

    def has_entitlement(self, key: str) -> bool:
        return key in self.entitlements

    def require_entitlement(self, key: str) -> None:
        if not self.has_entitlement(key):
            raise ReportAccessDenied(
                f"Feature '{key}' is not available on this subscription")

    @property
    def is_platform_admin(self) -> bool:
        return is_super_admin(self.principal)

    @property
    def is_tenant_admin(self) -> bool:
        return "Tenant Admin" in self.roles

    # -- Super Admin tenant oversight --------------------------------------

    @property
    def oversight_tenant_id(self) -> Optional[str]:
        """The tenant a Super Admin has EXPLICITLY selected for oversight, else None.

        Super Admin tenant oversight access is permitted only within an
        explicitly selected tenant scope.

        "Explicitly selected" is observed from the two tenant values the class
        already holds, rather than by adding a second tenant-resolution path:
        `resolve_tenant` returns the Super Admin's `?tenant_id=` override as
        `effective_tenant_id` and otherwise falls back to `jwt_tenant`. So the
        two differing is exactly the signal that an override was supplied.

        Deliberately narrow:
          * no tenant selected / no override -> None, and no oversight at all.
            The JWT tenant is NOT used as an implicit oversight grant, because
            that would make "no selection" indistinguishable from "selected my
            own tenant" and silently widen the role.
          * a non-Super-Admin can never reach this: `resolve_tenant` only honours
            the override for Super Admin, so for every other role the two values
            are identical and the property is None.
        """
        if not self.is_platform_admin:
            return None
        effective = self.effective_tenant_id
        if not effective or not self.jwt_tenant:
            return None
        if str(effective) == str(self.jwt_tenant):
            return None
        return effective

    def has_tenant_oversight(self, report: Dict[str, Any]) -> bool:
        """True when this report is inside the Super Admin's selected scope.

        The tenant check is not optional decoration: it is what stops a Super
        Admin scoped to tenant A from reading a tenant B report by holding its
        id. `assert_tenant` already rejects the cross-tenant case with a 404 on
        the by-id routes, and this second, independent check keeps the guarantee
        even if a caller reaches object access without going through the route.
        """
        scoped = self.oversight_tenant_id
        if not scoped:
            return False
        return str(report.get("tenant_id")) == str(scoped)

    # -- layer 1: tenant ---------------------------------------------------

    def assert_tenant(self, report: Dict[str, Any], tenant_id: str) -> None:
        """Cross-tenant reads return 404, not 403, so the API never confirms
        that a report in another tenant exists."""
        if str(report.get("tenant_id")) != str(tenant_id):
            raise ReportNotFound()

    # -- layer 2: object access -------------------------------------------

    def has_object_access(self, report: Dict[str, Any], db=None) -> bool:
        # Super Admin tenant oversight, bounded to the explicitly selected
        # tenant. This is an administrative inspection view of ONE chosen tenant,
        # not a global bypass: it grants drafts and private reports *within*
        # that tenant and grants nothing outside it.
        if self.has_tenant_oversight(report):
            return True
        if str(report.get("owner_user_id")) == str(self.user_id):
            return True
        if report.get("status") == "published" \
                and report.get("visibility") == "tenant":
            return True
        return self._has_explicit_grant(report.get("id"), db)

    def _has_explicit_grant(self, report_id: Any, db=None) -> bool:
        if not report_id or not self.user_id:
            return False
        sql = """
            SELECT 1 FROM platform.report_access ra
            WHERE ra.report_id = %s
              AND (
                    ra.grantee_user_id = %s
                 OR ra.grantee_role_id IN (
                        SELECT role_id FROM platform.user_roles WHERE user_id = %s
                    )
              )
            LIMIT 1
        """
        if db is not None:
            rows = db.execute(sql, (report_id, self.user_id, self.user_id))
        else:
            from app.db.connection import get_db_connection
            with get_db_connection() as conn:
                with conn.conn.cursor() as cur:
                    cur.execute(sql, (report_id, self.user_id, self.user_id))
                    rows = cur.fetchall()
        return bool(rows)

    def require_object_access(self, report: Dict[str, Any], db=None) -> None:
        # Super Admin tenant oversight, checked FIRST because the draft
        # short-circuit below returns before `has_object_access` is ever
        # reached. Still bound to the explicitly selected tenant via
        # `has_tenant_oversight`, so it cannot be used to reach another tenant.
        if self.has_tenant_oversight(report):
            return
        if report.get("status") == "draft":
            # a draft is private to its owner by construction
            if str(report.get("owner_user_id")) != str(self.user_id):
                raise ReportNotFound()
            return
        if not self.has_object_access(report, db):
            raise ReportNotFound()

    # -- layer 4: data source ---------------------------------------------

    def source_spec(self, data_source_key: str) -> Dict[str, Any]:
        return self.resolver.get_spec(data_source_key)

    def require_source_access(self, data_source_key: str) -> Dict[str, Any]:
        """A source requires BOTH its permission and its entitlement.

        This is the check that stops a shared report from becoming a channel for
        data the recipient could not otherwise read.
        """
        spec = self.source_spec(data_source_key)
        self.require_permission(spec["required_permission"])
        self.require_entitlement(spec["required_entitlement"])
        return spec

    def require_definition_sources(self, definition: Dict[str, Any]) -> List[Dict[str, Any]]:
        specs = []
        for key in self._definition_source_keys(definition):
            specs.append(self.require_source_access(key))
        return specs

    @staticmethod
    def _definition_source_keys(definition: Dict[str, Any]) -> List[str]:
        """Every data source a definition depends on.

        V1 definitions are single-source, but the signature is list-shaped so a
        multi-source V2 definition cannot silently skip per-source checks.
        """
        keys = []
        if isinstance(definition, dict):
            if definition.get("data_source_key"):
                keys.append(definition["data_source_key"])
            for comp in definition.get("components") or []:
                if isinstance(comp, dict) and comp.get("data_source_key"):
                    if comp["data_source_key"] not in keys:
                        keys.append(comp["data_source_key"])
        return keys

    # -- composite checks --------------------------------------------------

    def require_report_requirements(self, report: Dict[str, Any]) -> None:
        """Re-check the report's OWN snapshotted requirements on every read.

        The DataSource check alone is not sufficient. A template may require a
        capability tier the source does not — Executive Status needs
        advanced_reporting while its source only needs report_studio — so a
        report created while entitled would otherwise keep resolving after the
        entitlement was withdrawn.
        """
        for perm in report.get("required_permissions") or []:
            self.require_permission(perm)
        for ent in report.get("required_entitlements") or []:
            self.require_entitlement(ent)

    def authorize_read(self, report: Dict[str, Any], definition: Dict[str, Any],
                       tenant_id: str, db=None) -> None:
        """The full four-layer read check. Called on EVERY read and export."""
        self.assert_tenant(report, tenant_id)              # 1
        self.require_permission("reports:read")             # 3
        self.require_object_access(report, db)              # 2
        self.require_report_requirements(report)            # 3 + entitlement
        self.require_definition_sources(definition)         # 4

    def authorize_write(self, report: Dict[str, Any], action: str,
                        tenant_id: str, db=None) -> None:
        """Authorise a lifecycle or definition write.

        `reports:delete` is NECESSARY BUT NOT SUFFICIENT. Ownership is enforced
        on top of it, as recorded in the Phase 0 role-grant migration:

          * delete-own      allowed for any holder of reports:delete
          * delete-any      Super Admin / Tenant Admin only

        A user holding reports:delete can therefore never remove another user's
        report, and deleting your own report does not require being an admin.
        """
        self.assert_tenant(report, tenant_id)              # 1

        permission = f"reports:{action}"
        self.require_permission(permission)                 # 3

        is_owner = str(report.get("owner_user_id")) == str(self.user_id)

        if action == "delete":
            if is_owner:
                return                                      # delete-own
            if self.is_platform_admin or self.is_tenant_admin:
                return                                      # delete-any
            # 404, not 403: a caller who may not delete a report they do not own
            # must not be able to distinguish "exists but not yours" from "does
            # not exist", which a 403 would reveal.
            raise ReportNotFound()

        # every other write is owner-or-admin
        if is_owner or self.is_platform_admin or self.is_tenant_admin:
            return
        raise ReportNotFound()

    def authorize_create(self, definition: Dict[str, Any], tenant_id: str) -> None:
        self.require_permission("reports:create")
        self.require_definition_sources(definition)

    def authorize_share(self, report: Dict[str, Any], tenant_id: str,
                        grantee_permissions: Optional[Set[str]] = None,
                        grantee_entitlements: Optional[Set[str]] = None) -> Dict[str, Any]:
        """Sharing grants visibility, never capability.

        The recipient is checked against the SOURCE before a grant is created, so
        a report cannot be shared with someone who could not have read its
        underlying data. Their reports:export position is returned to the caller
        so the UI can show that they can view but not export.
        """
        self.assert_tenant(report, tenant_id)
        self.require_permission("reports:share")
        is_owner = str(report.get("owner_user_id")) == str(self.user_id)
        if not (is_owner or self.is_platform_admin or self.is_tenant_admin):
            raise ReportNotFound()

        definition = report.get("_definition") or {}
        specs = self.require_definition_sources(definition)

        if grantee_permissions is not None:
            required = {s["required_permission"] for s in specs}
            missing = [p for p in required if p not in grantee_permissions]
            if missing:
                raise ReportAccessDenied(
                    "cannot share with a user lacking "
                    f"{sorted(missing)} on the underlying data source")
        if grantee_entitlements is not None:
            required_e = {s["required_entitlement"] for s in specs}
            missing_e = [e for e in required_e if e not in grantee_entitlements]
            if missing_e:
                raise ReportAccessDenied(
                    "cannot share with a user lacking entitlements "
                    f"{sorted(missing_e)}")

        return {
            "required_permissions": sorted({s["required_permission"] for s in specs}),
            "required_entitlements": sorted({s["required_entitlement"] for s in specs}),
            "grantee_can_export": bool(grantee_permissions
                                       and "reports:export" in grantee_permissions),
        }

    def authorize_export(self, report: Dict[str, Any], definition: Dict[str, Any],
                         tenant_id: str, db=None) -> None:
        """Export is the operation most likely to be used for exfiltration, so it
        re-runs the FULL read check plus the export capability. A user may view a
        report without being able to export it."""
        self.assert_tenant(report, tenant_id)
        self.require_permission("reports:export")
        self.require_object_access(report, db)
        self.require_report_requirements(report)
        self.require_definition_sources(definition)

    # -- discovery ---------------------------------------------------------

    def visible_data_sources(self) -> List[Dict[str, Any]]:
        """Sources this caller may use, for the builder's field picker."""
        return self.resolver.list_sources_for_principal(
            [f"{r}:{a}" for r, a in self.permissions], self.entitlements)
