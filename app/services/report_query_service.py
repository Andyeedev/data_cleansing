"""OC-REPORT-001 — report query service (the read path).

Every read and every export passes through `read()`. The four authorisation
layers are re-evaluated on each call, which is what makes entitlement removal
and DataSource-permission removal take effect immediately rather than at share
time.

The other load-bearing rule here is that RUNTIME FILTERS CAN ONLY NARROW.
A caller-supplied filter is intersected with the saved filters rather than
replacing them, so a request equivalent to `status=all` cannot escape a saved
`status = FAILED` restriction. The service never widens.
"""
from typing import Any, Dict, List, Optional, Tuple

from app.services.report_aggregation_engine import AggregationEngine
from app.services.report_authorization import ReportAuthorization
from app.services.report_definition_service import ReportDefinitionService

# Runtime operators permitted from a caller. Deliberately a strict subset of the
# saved-filter operator set: no `ne`/`nin`, because those are the operators that
# make it easy to express "everything except", which is how a narrowing filter
# becomes a widening one in disguise.
RUNTIME_OPERATORS = frozenset({"eq", "gt", "gte", "lt", "lte", "in", "like"})

# Hard ceiling on caller-supplied filter count and value size, independent of
# the definition's own limits.
MAX_RUNTIME_FILTERS = 10
MAX_RUNTIME_VALUES = 50


class ReportQueryService:
    def __init__(self, definition_service: Optional[ReportDefinitionService] = None,
                 engine: Optional[AggregationEngine] = None,
                 resolver=None):
        self.definitions = definition_service or ReportDefinitionService(
            resolver=resolver)
        self.resolver = self.definitions.resolver
        # the engine MUST share the resolver, so the compiled queries and the
        # authorisation checks read the same allowlist through the same connection
        self.engine = engine or AggregationEngine(resolver=self.resolver)

    # -- runtime filter narrowing -----------------------------------------

    @staticmethod
    def _apply_runtime_filters(definition: Dict[str, Any],
                               runtime_filters: Optional[List[Dict[str, Any]]]
                               ) -> Tuple[Dict[str, Any], List[str]]:
        """Intersect runtime filters with the saved ones. Never replaces.

        The result is a NEW definition object; the persisted definition is not
        mutated, so a runtime request can never persist a widening.
        """
        if not runtime_filters:
            return definition, []

        errors: List[str] = []
        if len(runtime_filters) > MAX_RUNTIME_FILTERS:
            errors.append(f"too many runtime filters (max {MAX_RUNTIME_FILTERS})")

        normalised: List[Dict[str, Any]] = []
        for f in runtime_filters:
            if not isinstance(f, dict):
                errors.append("runtime filter must be an object")
                continue
            op = f.get("op")
            if op not in RUNTIME_OPERATORS:
                errors.append(
                    f"runtime operator {op!r} is not permitted "
                    f"({sorted(RUNTIME_OPERATORS)})")
                continue
            val = f.get("value")
            if op == "in":
                if not isinstance(val, list) or not val:
                    errors.append("runtime 'in' needs a non-empty list")
                    continue
                if len(val) > MAX_RUNTIME_VALUES:
                    errors.append(
                        f"too many runtime values (max {MAX_RUNTIME_VALUES})")
                    continue
            normalised.append({"field": f.get("field"), "op": op, "value": val})

        if errors:
            return definition, errors

        # intersect: saved filters are kept, runtime filters are ANDed on top.
        # Because they are combined with AND, adding a runtime filter can only
        # remove rows. That is the whole guarantee.
        merged = list(definition.get("filters") or []) + normalised
        out = dict(definition)
        out["filters"] = merged
        return out, []

    # -- read --------------------------------------------------------------

    def read(
        self,
        principal: Dict[str, Any],
        tenant_id: str,
        report_id: str,
        *,
        version: Optional[int] = None,
        runtime_filters: Optional[List[Dict[str, Any]]] = None,
        max_rows: Optional[int] = None,
    ) -> Dict[str, Any]:
        auth = self.definitions._auth(principal, tenant_id)
        report = self.definitions.get_report(report_id)
        definition_row = self.definitions.get_definition(report_id, version)
        definition = definition_row["definition"]

        # 1 tenant, 3 capability, 2 object, 4 source — in that order
        auth.authorize_read(report, definition, tenant_id)

        effective, errors = self._apply_runtime_filters(definition, runtime_filters)
        if errors:
            from app.services.report_authorization import ReportAccessDenied
            raise ReportAccessDenied("; ".join(errors))

        if max_rows is not None:
            effective = dict(effective)
            effective.setdefault("max_rows", max_rows)

        visible = auth.visible_data_sources()
        result = self.engine.execute(effective, tenant_id, visible)

        meta = result.get("meta", {})
        return {
            "report": {
                "id": str(report["id"]),
                "title": report.get("title"),
                "description": report.get("description"),
                "status": report.get("status"),
                "visibility": report.get("visibility"),
                "template_state": report.get("template_state"),
                "origin": report.get("origin"),
                "derived_from_template_key": report.get(
                    "derived_from_template_key"),
                "derived_from_template_version": report.get(
                    "derived_from_template_version"),
                "is_owner": str(report.get("owner_user_id")) == str(auth.user_id),
            },
            "version": {
                "version_no": definition_row.get("version_no"),
                "schema_version": definition_row.get("schema_version"),
                "created_at": definition_row.get("created_at"),
            },
            "meta": {
                "ok": meta.get("ok", False),
                "data_source_key": meta.get("data_source_key"),
                "scope_family": meta.get("scope_family"),
                "row_count": meta.get("row_count"),
                "max_rows": meta.get("max_rows"),
                "truncated": meta.get("truncated", False),
                "runtime_filters_applied": len(runtime_filters or []),
            },
            "components": result.get("components", []),
            "errors": result.get("errors", []),
        }

    def preview_candidate(
        self,
        principal: Dict[str, Any],
        tenant_id: str,
        report_id: str,
        candidate: Dict[str, Any],
        *,
        max_rows: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Execute an UNSAVED candidate definition, for the builder's live preview.

        Nothing is persisted and no version is created: the report's current
        version is untouched. This is a read of someone else's report through
        someone else's draft, so the SAME four-layer check runs, with the
        candidate supplying the definition whose sources are checked:

            auth.authorize_read(report, candidate, tenant_id)

        That matters. Without passing the candidate, a builder user could point a
        preview at a DataSource they are not entitled to and see its shape, which
        would turn preview into a side channel around `require_source_access`.

        The candidate is validated by the single validator, exactly as a save
        would be, so the builder can never preview something it could not save.
        """
        from app.services.report_definition_validator import validate_definition
        from app.services.report_authorization import ReportAccessDenied

        auth = self.definitions._auth(principal, tenant_id)
        report = self.definitions.get_report(report_id)
        definition_row = self.definitions.get_definition(report_id)

        # Validate first so a malformed candidate produces the validator's own
        # list of problems rather than an opaque authorization failure.
        errors, _norm = validate_definition(
            candidate, auth.visible_data_sources())
        if errors:
            raise ReportAccessDenied(
                "Invalid report definition: " + "; ".join(errors))

        # Full four-layer read check, against the CANDIDATE's sources.
        auth.authorize_read(report, candidate, tenant_id)

        effective = candidate
        if max_rows is not None:
            effective = dict(candidate)
            effective.setdefault("max_rows", max_rows)

        result = self.engine.execute(
            effective, tenant_id, auth.visible_data_sources())
        meta = result.get("meta", {})

        return {
            "report": {
                "id": str(report["id"]),
                "title": report.get("title"),
                "description": report.get("description"),
                "status": report.get("status"),
                "visibility": report.get("visibility"),
                "template_state": report.get("template_state"),
                "origin": report.get("origin"),
                "derived_from_template_key": report.get(
                    "derived_from_template_key"),
                "derived_from_template_version": report.get(
                    "derived_from_template_version"),
                "is_owner": str(report.get("owner_user_id")) == str(auth.user_id),
            },
            "version": {
                "version_no": definition_row.get("version_no"),
                "schema_version": definition_row.get("schema_version"),
                "created_at": definition_row.get("created_at"),
            },
            "meta": {
                "ok": meta.get("ok", False),
                "data_source_key": meta.get("data_source_key"),
                "scope_family": meta.get("scope_family"),
                "row_count": meta.get("row_count"),
                "max_rows": meta.get("max_rows"),
                "truncated": meta.get("truncated", False),
                # a candidate is not a runtime narrowing, so this is 0 by
                # definition rather than misreported
                "runtime_filters_applied": 0,
            },
            "components": result.get("components", []),
            "errors": result.get("errors", []),
            # lets the UI label a preview as unsaved rather than implying the
            # version shown is what a reader would see
            "preview": True,
        }

    def validate_candidate(
        self,
        principal: Dict[str, Any],
        tenant_id: str,
        candidate: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Validate a candidate definition without executing or persisting it.

        Returns the validator's own problem list so the builder can show every
        error at once. This is a convenience wrapper, not a second validator:
        it calls the same `validate_definition` the save path calls, over the
        caller's own visible sources, so it cannot be used to discover anything
        the caller could not already read.

        `tenant_id` is the effective tenant from the route, for the same reason
        the read path takes it: entitlements belong to that tenant's plan.
        """
        from app.services.report_definition_validator import validate_definition

        auth = self.definitions._auth(principal, tenant_id)
        auth.require_permission("reports:read")
        visible = auth.visible_data_sources()
        errors, norm = validate_definition(candidate, visible)
        return {
            "valid": not errors,
            "errors": errors,
            "data_source_key": (norm or {}).get("data_source_key"),
            "max_rows": (norm or {}).get("max_rows"),
            "section_count": len((norm or {}).get("sections", [])),
            "filter_count": len((norm or {}).get("filters", [])),
        }

    def export(
        self,
        principal: Dict[str, Any],
        tenant_id: str,
        report_id: str,
        *,
        version: Optional[int] = None,
        runtime_filters: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Export. Re-runs the FULL read check plus reports:export, so a user who
        can view but not export gets a 403 rather than a file."""
        auth = self.definitions._auth(principal, tenant_id)
        report = self.definitions.get_report(report_id)
        definition_row = self.definitions.get_definition(report_id, version)
        definition = definition_row["definition"]
        auth.authorize_export(report, definition, tenant_id)

        payload = self.read(
            principal, tenant_id, report_id, version=version,
            runtime_filters=runtime_filters)

        return {
            "report": payload["report"],
            "version": payload["version"],
            "meta": payload["meta"],
            "components": payload["components"],
        }

    # -- export formatting -------------------------------------------------

    @staticmethod
    def to_csv(payload: Dict[str, Any]) -> str:
        """CSV serialisation of the exported report.

        Every component is emitted, with its columns as the header when it is a
        row query. The provenance preamble is written FIRST and includes the
        truncation flag, so a capped export can never be mistaken for a complete
        one — which was the correctness defect in the existing
        `export_service.export_csv`, which had no row limit at all.
        """
        import csv
        import io

        out = io.StringIO()
        writer = csv.writer(out)
        meta = payload.get("meta", {})
        report = payload.get("report", {})
        version = payload.get("version", {})

        writer.writerow(["# MAP Nexus report export"])
        writer.writerow(["# report", report.get("title")])
        writer.writerow(["# report_id", report.get("id")])
        writer.writerow(["# version", version.get("version_no")])
        writer.writerow(["# data_source", meta.get("data_source_key")])
        writer.writerow(["# scope_family", meta.get("scope_family")])
        writer.writerow(["# max_rows", meta.get("max_rows")])
        writer.writerow(["# row_count", meta.get("row_count")])
        writer.writerow(["# truncated",
                         "YES - RESULTS ARE INCOMPLETE"
                         if meta.get("truncated") else "no"])
        writer.writerow([])

        for comp in payload.get("components", []):
            writer.writerow([f"# component: {comp.get('title') or comp.get('id')} "
                             f"({comp.get('type')}, {comp.get('row_count')} rows)"])
            rows = comp.get("rows") or []
            if comp.get("is_row_query") and rows:
                writer.writerow(comp.get("columns") or [])
                for row in rows:
                    writer.writerow(list(row))
            else:
                writer.writerow(comp.get("columns") or ["value"])
                for row in rows:
                    writer.writerow(list(row))
            writer.writerow([])
        return out.getvalue()
