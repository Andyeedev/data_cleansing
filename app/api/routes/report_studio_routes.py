"""OC-REPORT-001 — Report Studio API.

Mounted under /api/v1/reports/studio, which is a SIBLING of the existing
/api/v1/reports/suite. The curated Report Suite is untouched.

Every handler delegates to a service. None of them performs its own
authorisation: the four layers live in app/services/report_authorization.py and
are reached through the service layer, so there is exactly one authorisation
path.

Tenant resolution reuses the existing primitives:
  * get_current_user_with_tenant  — identity
  * resolve_tenant                — Super Admin may pass ?tenant_id=
  * require_permissions           — the reports:* capability gate

The frontend gate is never the boundary; each endpoint re-checks independently.
"""
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from pydantic import BaseModel, Field

from app.api.core.auth.dependencies import get_current_user_with_tenant, resolve_tenant
from app.api.core.auth.rbac import require_permissions
from app.api.models.responses import APIResponse
from app.services.report_authorization import ReportAccessDenied, ReportAuthorization
from app.services.report_assistant_service import AssistantError, ReportAssistant
from app.services.report_definition_service import ReportDefinitionService
from app.services.report_datasource_resolver import DataSourceResolver
from app.services.report_query_service import ReportQueryService
from app.services.report_template_service import ReportTemplateService

router = APIRouter(prefix="/api/v1/reports/studio", tags=["Report Studio"])


def _svc():
    return {
        "definitions": ReportDefinitionService(),
        "queries": ReportQueryService(),
        "templates": ReportTemplateService(),
        "assistant": ReportAssistant(),
    }


def _guard(exc: ReportAccessDenied) -> HTTPException:
    """Map a service authorisation failure to its HTTP status.

    404 is used for cross-tenant and non-object-access cases so the API never
    confirms that a report in another tenant exists.
    """
    return HTTPException(status_code=exc.status_code, detail=exc.reason)


def _principal(current_user: Dict[str, Any]) -> Dict[str, Any]:
    return current_user


# ---------------------------------------------------------------------------
# Discovery
# ---------------------------------------------------------------------------

@router.get("/catalog", response_model=APIResponse)
def get_catalog(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    """Catalogue-driven discovery. Drives the Studio nav, the template gallery
    and the builder's field picker from ONE source, so nav and backend cannot
    disagree about what a tenant may see."""
    try:
        auth = ReportAuthorization(current_user, effective_tenant_id=tenant_id)
        auth.require_entitlement("report_studio")
        templates = ReportTemplateService().list_templates(current_user, tenant_id)
        return APIResponse(success=True, data={
            "entitlements": sorted(auth.entitlements),
            "permissions": sorted(f"{r}:{a}" for r, a in auth.permissions
                                  if r == "reports"),
            "templates": templates,
            "data_sources": [
                {"data_source_key": s["data_source_key"],
                 "display_name": s["display_name"],
                 "grain": s["grain"],
                 "scope_family": s["scope_family"],
                 "required_permission": s["required_permission"],
                 "required_entitlements": s["required_entitlement"],
                 "fields": s["fields"]}
                for s in auth.visible_data_sources()
            ],
        })
    except ReportAccessDenied as exc:
        raise _guard(exc)


@router.get("/datasources/{key}/fields", response_model=APIResponse)
def get_datasource_fields(
    key: str,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    try:
        auth = ReportAuthorization(current_user, effective_tenant_id=tenant_id)
        auth.require_source_access(key)
        return APIResponse(success=True, data={
            "data_source_key": key,
            "fields": auth.resolver.declared_fields(key),
        })
    except ReportAccessDenied as exc:
        raise _guard(exc)


# ---------------------------------------------------------------------------
# Reports: lifecycle
# ---------------------------------------------------------------------------

class CreateReportRequest(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    definition: Dict[str, Any]
    status: str = "draft"


@router.get("/reports", response_model=APIResponse)
def list_reports(
    scope: str = Query("all", pattern="^(all|mine|shared)$"),
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    try:
        return APIResponse(success=True, data={
            "items": ReportDefinitionService().list_reports(
                tenant_id, current_user, scope),
        })
    except ReportAccessDenied as exc:
        raise _guard(exc)


@router.post("/reports", response_model=APIResponse)
def create_report(
    payload: CreateReportRequest,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:create")),
):
    try:
        report = ReportDefinitionService().create_report(
            current_user, tenant_id, payload.title, payload.definition,
            description=payload.description, status=payload.status)
        return APIResponse(success=True, data=report)
    except ReportAccessDenied as exc:
        raise _guard(exc)


@router.get("/reports/{report_id}", response_model=APIResponse)
def get_report(
    report_id: str,
    version: Optional[int] = Query(
        None, ge=1, description="Specific version; omit for the current one"),
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    try:
        s = ReportDefinitionService()
        auth = ReportAuthorization(current_user, effective_tenant_id=tenant_id)
        # `auth` is passed so `is_owner` is populated here exactly as the list
        # and /data endpoints populate it. Without it the detail response omitted
        # the flag entirely, so the editor could not tell an owner from a
        # share-recipient from this endpoint alone.
        report = s.get_report(report_id, auth=auth)
        auth.assert_tenant(report, tenant_id)
        auth.require_object_access(report, db=None)
        return APIResponse(success=True, data={
            "report": report,
            # `version` is honoured, not ignored. Without it a saved report's own
            # history could be listed but never opened, which makes the
            # immutability guarantee unobservable to the user.
            "definition": s.get_definition(report_id, version),
        })
    except ReportAccessDenied as exc:
        raise _guard(exc)


class UpdateDefinitionRequest(BaseModel):
    definition: Dict[str, Any]
    mark_diverged: bool = False


@router.put("/reports/{report_id}/definition", response_model=APIResponse)
def put_definition(
    report_id: str,
    payload: UpdateDefinitionRequest,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:update")),
):
    try:
        report = ReportDefinitionService().update_definition(
            current_user, report_id, payload.definition, tenant_id,
            mark_diverged=payload.mark_diverged)
        return APIResponse(success=True, data=report)
    except ReportAccessDenied as exc:
        raise _guard(exc)


class StatusRequest(BaseModel):
    status: str


@router.patch("/reports/{report_id}/status", response_model=APIResponse)
def patch_status(
    report_id: str,
    payload: StatusRequest,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    """Status transitions including delete.

    The delete-ownership contract is enforced in the service, not here, so this
    handler cannot become a bypass. The route-level permission is only
    reports:read because the service applies the precise per-action check.
    """
    try:
        return APIResponse(success=True, data=ReportDefinitionService().set_status(
            current_user, report_id, payload.status, tenant_id))
    except ReportAccessDenied as exc:
        raise _guard(exc)


@router.get("/reports/{report_id}/versions", response_model=APIResponse)
def list_versions(
    report_id: str,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    try:
        s = ReportDefinitionService()
        report = s.get_report(report_id)
        auth = ReportAuthorization(current_user, effective_tenant_id=tenant_id)
        auth.assert_tenant(report, tenant_id)
        auth.require_object_access(report, db=None)
        return APIResponse(success=True, data={"items": s.list_versions(report_id)})
    except ReportAccessDenied as exc:
        raise _guard(exc)


@router.post("/reports/{report_id}/duplicate", response_model=APIResponse)
def duplicate_report(
    report_id: str,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:create")),
):
    try:
        return APIResponse(success=True, data=ReportDefinitionService().duplicate(
            current_user, report_id, tenant_id))
    except ReportAccessDenied as exc:
        raise _guard(exc)


# ---------------------------------------------------------------------------
# Read path
# ---------------------------------------------------------------------------

@router.get("/reports/{report_id}/data", response_model=APIResponse)
def read_report_data(
    report_id: str,
    version: Optional[int] = Query(None),
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    """The core read. All four authorisation layers are re-evaluated here, on
    every call, which is what makes entitlement removal and DataSource-permission
    removal take effect immediately."""
    try:
        return APIResponse(success=True, data=ReportQueryService().read(
            current_user, tenant_id, report_id, version=version))
    except ReportAccessDenied as exc:
        raise _guard(exc)


class ValidateCandidateRequest(BaseModel):
    definition: Dict[str, Any]


@router.post("/validate", response_model=APIResponse)
def validate_candidate(
    payload: ValidateCandidateRequest,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    """Validate a definition the builder has not saved yet.

    Read-only: nothing is executed and nothing is persisted. It exists so the
    builder can show the SINGLE validator's full problem list while the user is
    still editing, instead of only discovering errors on save.
    """
    return APIResponse(success=True, data=ReportQueryService().validate_candidate(
        current_user, tenant_id, payload.definition))


@router.post("/reports/{report_id}/query", response_model=APIResponse)
def query_report_data(
    report_id: str,
    payload: Dict[str, Any],
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    """Read with runtime filters, or preview an unsaved candidate.

    Runtime filters are INTERSECTED with the saved filters, never substituted,
    so a caller cannot widen a saved restriction.

    When `definition` is supplied it is an UNSAVED candidate used for the
    builder's live preview. Nothing is persisted and no version is created; the
    full four-layer read check runs against the candidate's own data sources.
    """
    try:
        service = ReportQueryService()
        candidate = payload.get("definition")
        if candidate is not None:
            return APIResponse(success=True, data=service.preview_candidate(
                current_user, tenant_id, report_id, candidate,
                max_rows=payload.get("max_rows"),
            ))
        return APIResponse(success=True, data=service.read(
            current_user, tenant_id, report_id,
            version=payload.get("version"),
            runtime_filters=payload.get("filters"),
            max_rows=payload.get("max_rows"),
        ))
    except ReportAccessDenied as exc:
        raise _guard(exc)


# ---------------------------------------------------------------------------
# Export — independently gated on reports:export
# ---------------------------------------------------------------------------

def _export_filename(title: str, version_no: Any, ext: str) -> str:
    """Build a Content-Disposition value that is safe to put in a header.

    HTTP headers are latin-1. A report title is free text, and the seeded V1
    templates use typographic characters (e.g. the em-dash in
    "Migration Health - Weekly"), so interpolating the raw title produced a
    UnicodeEncodeError and turned every export of such a report into a 500.

    The name is therefore normalised to ASCII, stripped of anything that is not
    filename-safe, and quoted. The body still carries the real title.
    """
    import re
    import unicodedata

    base = unicodedata.normalize("NFKD", title or "report")
    base = base.encode("ascii", "ignore").decode("ascii")
    base = re.sub(r"[^A-Za-z0-9._-]+", "_", base).strip("_") or "report"
    return f'attachment; filename="{base}_v{version_no}.{ext}"'


@router.get("/reports/{report_id}/export")
def export_report(
    report_id: str,
    format: str = Query("csv", pattern="^(csv|xlsx)$"),
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:export")),
):
    """Export requires reports:export at the route AND the full four-layer check
    in the service. A user who can view but not export receives 403 here, not a
    file."""
    try:
        payload = ReportQueryService().export(current_user, tenant_id, report_id)
    except ReportAccessDenied as exc:
        raise _guard(exc)

    report_title = payload["report"].get("title") or "report"
    version_no = payload["version"]["version_no"]
    if format == "csv":
        return Response(
            content=ReportQueryService.to_csv(payload),
            media_type="text/csv",
            headers={"Content-Disposition":
                     _export_filename(report_title, version_no, "csv")},
        )

    import io
    from openpyxl import Workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "Report"
    meta = payload["meta"]
    ws.append(["MAP Nexus report export"])
    for label, value in (("Report", payload["report"].get("title")),
                         ("Version", payload["version"].get("version_no")),
                         ("Data source", meta.get("data_source_key")),
                         ("Scope family", meta.get("scope_family")),
                         ("Row count", meta.get("row_count")),
                         ("Truncated", "YES - RESULTS ARE INCOMPLETE"
                          if meta.get("truncated") else "no")):
        ws.append([label, value])
    ws.append([])
    for comp in payload["components"]:
        ws.append([f"# {comp.get('title') or comp.get('id')} ({comp.get('row_count')} rows)"])
        ws.append(comp.get("columns") or ["value"])
        for row in comp.get("rows") or []:
            ws.append(list(row))
        ws.append([])
    buf = io.BytesIO()
    wb.save(buf)
    return Response(
        content=buf.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition":
                 _export_filename(report_title, version_no, "xlsx")},
    )


# ---------------------------------------------------------------------------
# Sharing
# ---------------------------------------------------------------------------

class ShareRequest(BaseModel):
    grantee_user_id: str


@router.get("/reports/{report_id}/access", response_model=APIResponse)
def list_access(
    report_id: str,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    try:
        return APIResponse(success=True, data={
            "items": ReportDefinitionService().list_access(
                current_user, report_id, tenant_id)})
    except ReportAccessDenied as exc:
        raise _guard(exc)


@router.post("/reports/{report_id}/access", response_model=APIResponse)
def grant_access(
    report_id: str,
    payload: ShareRequest,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:share")),
):
    """Sharing grants VISIBILITY, never capability. The service checks the
    recipient against the report's DataSource before the grant is created."""
    try:
        return APIResponse(success=True, data=ReportDefinitionService().grant_access(
            current_user, report_id, tenant_id, payload.grantee_user_id))
    except ReportAccessDenied as exc:
        raise _guard(exc)


@router.delete("/reports/{report_id}/access/{grantee_user_id}", response_model=APIResponse)
def revoke_access(
    report_id: str,
    grantee_user_id: str,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:share")),
):
    try:
        return APIResponse(success=True, data=ReportDefinitionService().revoke_access(
            current_user, report_id, tenant_id, grantee_user_id))
    except ReportAccessDenied as exc:
        raise _guard(exc)


# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------

@router.get("/templates", response_model=APIResponse)
def list_templates(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    try:
        return APIResponse(success=True, data={
            "items": ReportTemplateService().list_templates(current_user, tenant_id)})
    except ReportAccessDenied as exc:
        raise _guard(exc)


class InstantiateRequest(BaseModel):
    template_key: str
    title: Optional[str] = None
    overrides: Optional[Dict[str, Any]] = None


@router.post("/templates/instantiate", response_model=APIResponse)
def instantiate_template(
    payload: InstantiateRequest,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:create")),
):
    try:
        return APIResponse(success=True, data=ReportTemplateService().instantiate(
            current_user, tenant_id, payload.template_key,
            payload.title, payload.overrides))
    except ReportAccessDenied as exc:
        raise _guard(exc)


@router.get("/reports/{report_id}/template-update", response_model=APIResponse)
def template_update(
    report_id: str,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    """Reports whether an update is available. Applies nothing."""
    try:
        return APIResponse(success=True, data=ReportTemplateService().check_for_update(
            current_user, report_id, tenant_id))
    except ReportAccessDenied as exc:
        raise _guard(exc)


@router.post("/reports/{report_id}/adopt-template", response_model=APIResponse)
def adopt_template(
    report_id: str,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:update")),
):
    """Accepts a template update AS A NEW REPORT VERSION. There is no live
    inheritance: the saved definition stays authoritative."""
    try:
        return APIResponse(success=True, data=ReportTemplateService().adopt_template_version(
            current_user, report_id, tenant_id))
    except ReportAccessDenied as exc:
        raise _guard(exc)


# ---------------------------------------------------------------------------
# Report Assistant — deterministic, not AI
# ---------------------------------------------------------------------------

@router.get("/assistant/recipes", response_model=APIResponse)
def list_recipes(
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    try:
        return APIResponse(success=True, data={
            "items": ReportAssistant().list_recipes(current_user, tenant_id)})
    except (AssistantError, ReportAccessDenied) as exc:
        raise HTTPException(status_code=403, detail=str(exc))


class MatchRequest(BaseModel):
    request: str = Field(..., max_length=500)


@router.post("/assistant/match", response_model=APIResponse)
def assistant_match(
    payload: MatchRequest,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:read")),
):
    """Step 1. The matched recipe AND the keywords that matched are always
    returned, so nothing is inferred silently."""
    try:
        return APIResponse(success=True, data=ReportAssistant().match_recipe(
            current_user, tenant_id, payload.request))
    except (AssistantError, ReportAccessDenied) as exc:
        raise HTTPException(status_code=403, detail=str(exc))


class AssistRequest(BaseModel):
    recipe_key: str
    answers: Dict[str, Any] = Field(default_factory=dict)
    title: Optional[str] = None
    save: bool = False


@router.post("/assistant/candidate", response_model=APIResponse)
def assistant_candidate(
    payload: AssistRequest,
    current_user=Depends(get_current_user_with_tenant),
    tenant_id: str = Depends(resolve_tenant),
    _perm=Depends(require_permissions("reports:create")),
):
    """Steps 2-3. Produces a CANDIDATE definition without saving it, so the user
    can review before anything is written. With save=true the definition goes
    through the ordinary validate -> authorise -> create path."""
    try:
        assistant = ReportAssistant()
        if payload.save:
            return APIResponse(success=True, data=assistant.create_from_assistant(
                current_user, tenant_id, payload.recipe_key,
                payload.answers, payload.title))
        return APIResponse(success=True, data=assistant.build_candidate(
            current_user, tenant_id, payload.recipe_key,
            payload.answers, payload.title))
    except (AssistantError, ReportAccessDenied) as exc:
        status = exc.status_code if isinstance(exc, ReportAccessDenied) else 400
        raise HTTPException(status_code=status, detail=str(exc))
