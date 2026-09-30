"""OC-REPORT-001 — report template service.

Templates are first-class governed metadata, not hard-coded pages. The central
rule is that instantiating a template COPIES the full definition into a new
user-owned report. The template itself is never mutated, and the user's copy is
independently editable, so a user can never be surprised by a template changing
underneath them.

The user's report records `derived_from_template_key` and
`derived_from_template_version` for provenance, and `template_state`
('pinned' | 'diverged') for update semantics. Template updates are OFFERED with
a diff and never applied automatically.
"""
import json
from typing import Any, Dict, List, Optional

from app.services.report_authorization import ReportAccessDenied, ReportAuthorization
from app.services.report_definition_service import ReportDefinitionService


class ReportTemplateService:
    def __init__(self, definition_service: Optional[ReportDefinitionService] = None,
                 resolver=None):
        self.definitions = definition_service or ReportDefinitionService(
            resolver=resolver)

    @property
    def db(self):
        return self.definitions.db

    # -- listing (entitlement-filtered) ------------------------------------

    def list_templates(self, principal: Dict[str, Any],
                       tenant_id: str) -> List[Dict[str, Any]]:
        """Templates the caller may actually instantiate.

        Entitlement filtering happens HERE, server-side, against the template's
        declared required entitlement. A template the tenant is not entitled to is
        NOT returned at all — not returned greyed-out — because showing a
        capability a customer cannot buy is a commercial and security tell.

        One card per template_key: only the newest active version is listed.
        Without that, publishing a new version of a template makes every tenant's
        gallery show the same template twice (once per active version), which is
        what the template-update banner's "newer version available" flow makes
        reachable. `get_template` already resolved to the max version, so the
        gallery now agrees with it.
        """
        auth = self.definitions._auth(principal, tenant_id)
        auth.require_permission("reports:read")
        auth.require_entitlement("report_studio")

        rows = self.db.execute("""
            SELECT DISTINCT ON (template_key)
                   template_key, version, display_name, description, category,
                   required_data_sources, required_entitlements, thumbnail_spec
            FROM platform.report_templates
            WHERE is_active IS TRUE
            ORDER BY template_key, version DESC, sort_order
        """)

        entitled = auth.entitlements
        out = []
        for r in rows:
            required_e = set(r[6] or [])
            if not required_e.issubset(entitled):
                continue          # not entitled -> not shown
            out.append({
                "template_key": r[0],
                "version": r[1],
                "display_name": r[2],
                "description": r[3],
                "category": r[4],
                "data_sources": r[5] or [],
                "required_entitlements": sorted(required_e),
                "thumbnail_spec": r[7] or {},
                "available": True,
            })
        return out

    def get_template(self, template_key: str) -> Dict[str, Any]:
        rows = self.db.execute("""
            SELECT template_key, version, display_name, description, category,
                   definition, required_data_sources, required_entitlements
            FROM platform.report_templates
            WHERE template_key = %s AND version = (
                SELECT max(version) FROM platform.report_templates
                WHERE template_key = %s AND is_active IS TRUE)
        """, (template_key, template_key))
        if not rows:
            raise ReportAccessDenied(f"Unknown template {template_key!r}")
        return {
            "template_key": rows[0][0], "version": rows[0][1],
            "display_name": rows[0][2], "description": rows[0][3],
            "category": rows[0][4], "definition": rows[0][5],
            "data_sources": rows[0][6] or [],
            "required_entitlements": rows[0][7] or [],
        }

    # -- instantiation -----------------------------------------------------

    def instantiate(self, principal: Dict[str, Any], tenant_id: str,
                    template_key: str, title: Optional[str] = None,
                    overrides: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Create a NEW user-owned report from a template.

        Steps, in this order, because each one can legitimately refuse:
          1. verify the template exists and is active
          2. verify the caller is ENTITLED to it
          3. verify the caller may use the template's data sources
          4. copy the definition, applying only allowlisted overrides
          5. create the report as a draft, owned by the caller
        """
        auth = self.definitions._auth(principal, tenant_id)
        template = self.get_template(template_key)

        required_e = set(template.get("required_entitlements") or [])
        if not required_e.issubset(auth.entitlements):
            raise ReportAccessDenied(
                f"Template {template_key!r} requires entitlements "
                f"{sorted(required_e - auth.entitlements)}")

        definition = json.loads(json.dumps(template["definition"]))  # deep copy
        if overrides:
            definition = self._apply_overrides(definition, overrides)

        return self.definitions.create_report(
            principal, tenant_id,
            title or template["display_name"],
            definition,
            description=template.get("description"),
            status="draft",
            origin="template",
            derived_from_template_key=template["template_key"],
            derived_from_template_version=template["version"],
            extra_entitlements=required_e,
            allowed_sources=auth.visible_data_sources(),
        )

    @staticmethod
    def _apply_overrides(definition: Dict[str, Any],
                         overrides: Dict[str, Any]) -> Dict[str, Any]:
        """Apply only allowlisted overrides to a template copy.

        A template is not a privileged object: an override cannot introduce a
        data source, a field, or an operator. Anything unrecognised is ignored
        rather than honoured.
        """
        out = json.loads(json.dumps(definition))
        allowed = {"filters", "sections", "max_rows"}

        for k, v in (overrides or {}).items():
            if k not in allowed:
                continue
            if k == "sections" and isinstance(v, list):
                for sec in v:
                    if not isinstance(sec, dict):
                        continue
                    for target in out.get("sections", []):
                        if target.get("id") == sec.get("id"):
                            for sk, sv in sec.items():
                                if sk in {"id", "type", "title", "bindings",
                                          "config", "sort"}:
                                    target[sk] = sv
            elif k == "filters" and isinstance(v, list):
                out["filters"] = v
            elif k == "max_rows" and isinstance(v, int):
                out["max_rows"] = v
        return out

    # -- updates -----------------------------------------------------------

    @staticmethod
    def _section_diff(current: Dict[str, Any],
                      incoming: Dict[str, Any]) -> Dict[str, Any]:
        """Section-level comparison of the report's definition against a template.

        Deliberately coarse. The plan asks for a *preview* before a user accepts
        an update, not a merge tool - the report stays authoritative and adopting
        creates a new immutable version, so nothing is ever silently rewritten.
        Reporting added / removed / changed sections by id is what a reviewer
        actually needs in order to decide.
        """
        def index(defn: Any) -> Dict[str, Dict[str, Any]]:
            out: Dict[str, Dict[str, Any]] = {}
            for sec in ((defn or {}).get("sections") or []):
                if isinstance(sec, dict) and sec.get("id"):
                    out[str(sec["id"])] = sec
            return out

        cur = index(current)
        inc = index(incoming)
        added, removed, changed = [], [], []

        for sid, sec in inc.items():
            if sid not in cur:
                added.append({"id": sid, "type": sec.get("type"),
                              "title": sec.get("title")})
                continue
            fields = []
            mine = cur[sid]
            for field in ("type", "title"):
                if (mine.get(field) or None) != (sec.get(field) or None):
                    fields.append({"field": field,
                                   "from": mine.get(field),
                                   "to": sec.get(field)})
            mb = mine.get("bindings") or {}
            sb = sec.get("bindings") or {}
            for field in ("measure", "aggregation", "time_axis"):
                if (mb.get(field) or None) != (sb.get(field) or None):
                    fields.append({"field": f"bindings.{field}",
                                   "from": mb.get(field),
                                   "to": sb.get(field)})
            if (mb.get("dimensions") or []) != (sb.get("dimensions") or []):
                fields.append({"field": "bindings.dimensions",
                               "from": mb.get("dimensions"),
                               "to": sb.get("dimensions")})
            if fields:
                changed.append({"id": sid, "type": sec.get("type"),
                                "title": sec.get("title"),
                                "changes": fields})

        for sid, sec in cur.items():
            if sid not in inc:
                removed.append({"id": sid, "type": sec.get("type"),
                                "title": sec.get("title")})

        source_change = None
        cs = (current or {}).get("data_source_key")
        ins = (incoming or {}).get("data_source_key")
        if (cs or None) != (ins or None):
            source_change = {"from": cs, "to": ins}

        return {"added": added, "removed": removed, "changed": changed,
                "data_source_change": source_change}

    def check_for_update(self, principal: Dict[str, Any], report_id: str,
                         tenant_id: str) -> Dict[str, Any]:
        """Report whether a newer template version exists for a pinned report.

        Never applies anything. Returns the version numbers, the template's own
        changelog and a section-level diff so the UI can offer a preview; the
        user must then call adopt_template_version to accept it as a NEW report
        version.

        The changelog and diff are read from the SAME canonical
        platform.report_templates row and the report's own current definition
        that adopt_template_version would consume. Nothing here is a second
        source of template truth, and no update is ever applied implicitly.
        """
        auth = self.definitions._auth(principal, tenant_id)
        report = self.definitions.get_report(report_id)
        # Layer 1 before layer 2, as everywhere else: require_object_access has
        # no tenant check of its own, so without this a cross-tenant caller could
        # learn a published report's template provenance and version gap.
        auth.assert_tenant(report, tenant_id)
        auth.require_object_access(report, db=None)

        key = report.get("derived_from_template_key")
        if not key:
            return {"has_update": False, "reason": "not derived from a template"}
        if report.get("template_state") != "pinned":
            return {"has_update": False, "reason": "report has diverged",
                    "template_key": key,
                    "report_template_version": report.get(
                        "derived_from_template_version")}

        rows = self.db.execute("""
            SELECT max(version) FROM platform.report_templates
            WHERE template_key = %s AND is_active IS TRUE
        """, (key,))
        latest = rows[0][0] if rows and rows[0][0] is not None else None
        current = report.get("derived_from_template_version")
        has_update = bool(latest and current and int(latest) > int(current))

        out = {
            "has_update": has_update,
            "template_key": key,
            "report_template_version": current,
            "latest_template_version": latest,
        }
        if not has_update:
            return out

        # enrich only when there is genuinely something to accept
        trow = self.db.execute("""
            SELECT display_name, changelog, definition
            FROM platform.report_templates
            WHERE template_key = %s AND version = %s AND is_active IS TRUE
        """, (key, latest))
        if trow:
            out["template_display_name"] = trow[0][0]
            out["changelog"] = trow[0][1]
            incoming = trow[0][2]
            if isinstance(incoming, str):
                incoming = json.loads(incoming)
            definition_row = self.definitions.get_definition(report_id)
            out["diff"] = self._section_diff(
                definition_row.get("definition"), incoming)
        return out

    def adopt_template_version(self, principal: Dict[str, Any], report_id: str,
                               tenant_id: str) -> Dict[str, Any]:
        """Accept a template update AS A NEW REPORT VERSION.

        The saved report definition stays authoritative throughout: the report
        gains a new immutable version, it does not become a live view of the
        template. This is the 'no live inheritance' rule from the plan.
        """
        auth = self.definitions._auth(principal, tenant_id)
        report = self.definitions.get_report(report_id)
        auth.authorize_write(report, "update", tenant_id)
        key = report.get("derived_from_template_key")
        if not key:
            raise ReportAccessDenied("Report is not derived from a template")

        template = self.get_template(key)
        definition = json.loads(json.dumps(template["definition"]))
        # Provenance moves to the new template version. This must be written as
        # part of the same write, otherwise the report keeps claiming the OLD
        # template version and check_for_update keeps offering the very update
        # the user just accepted.
        return self.definitions.update_definition(
            principal, report_id, definition, tenant_id,
            mark_diverged=False,
            allowed_sources=auth.visible_data_sources(),
            derived_from_template_version=int(template["version"]),
        )
