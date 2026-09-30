"""OC-REPORT-001 — built-in Report Assistant.

THIS IS NOT AN AI SYSTEM. There is no model, no LLM SDK, no inference, no
external API call, no model hosting and no API cost. It is:

    curated recipes  +  weighted keyword matching  +  constrained questions

Three consequences, and all three are the point:

  * DETERMINISTIC. The same request always produces the same recipe match, the
    same questions and the same definition. Fully unit-testable, diffable and
    reproducible, which is why it is safe to ship in a governed, regulated
    product.
  * VENDOR-NEUTRAL. No external service, so nothing to procure or audit and no
    data leaves the platform.
  * ZERO MARGINAL COST. No API calls means no per-report, per-seat or per-tenant
    cost.

THE INVARIANT (also required for the V3 AI Analyst, which will be a *different
client of this same API* rather than a new trust boundary):

    the assistant never queries the database, never bypasses
    DataSourceResolver, never bypasses the entitlement or permission checks,
    never writes directly to the report tables, never touches another tenant,
    and never generates SQL.

It produces a CANDIDATE DEFINITION, which then goes through exactly the same
validate -> authorise -> save path as a manually authored one. Every report it
produces records origin = 'assistant' plus the recipe key and the user's answers.
"""
import json
import re
from typing import Any, Dict, List, Optional, Tuple

from app.services.report_authorization import ReportAccessDenied, ReportAuthorization
from app.services.report_definition_service import ReportDefinitionService
from app.services.report_template_service import ReportTemplateService


class AssistantError(Exception):
    pass


class ReportAssistant:
    """Deterministic recipe-based assistant. See module docstring."""

    def __init__(self, definition_service: Optional[ReportDefinitionService] = None,
                 template_service: Optional[ReportTemplateService] = None,
                 resolver=None):
        self.definitions = definition_service or ReportDefinitionService(
            resolver=resolver)
        self.templates = template_service or ReportTemplateService(self.definitions)

    @property
    def db(self):
        return self.definitions.db

    # -- recipe catalogue ---------------------------------------------------

    def list_recipes(self, principal: Dict[str, Any],
                     tenant_id: str) -> List[Dict[str, Any]]:
        """Recipes the caller may use, entitlement-filtered like templates."""
        auth = self.definitions._auth(principal, tenant_id)
        auth.require_permission("reports:read")
        auth.require_entitlement("report_studio")

        rows = self.db.execute("""
            SELECT recipe_key, display_name, description, keywords,
                   questions, resulting_template_key,
                   required_data_sources, required_entitlements
            FROM platform.report_assistant_recipes
            WHERE is_active IS TRUE
            ORDER BY priority, recipe_key
        """)
        entitled = auth.entitlements
        out = []
        for r in rows:
            required_e = set(r[7] or [])
            if not required_e.issubset(entitled):
                continue
            out.append({
                "recipe_key": r[0], "display_name": r[1], "description": r[2],
                "keywords": r[3] or [],
                "questions": r[4] or [],
                "resulting_template_key": r[5],
                "data_sources": r[6] or [],
                "required_entitlements": sorted(required_e),
            })
        return out

    # -- step 1: match -----------------------------------------------------

    @staticmethod
    def _tokenise(text: str) -> List[str]:
        return [t for t in re.split(r"[^a-z0-9_]+", (text or "").lower()) if t]

    def match_recipe(self, principal: Dict[str, Any], tenant_id: str,
                     request: str) -> Dict[str, Any]:
        """Weighted keyword match. The match is ALWAYS returned, never applied
        silently, so the user can see which recipe was chosen and why."""
        recipes = self.list_recipes(principal, tenant_id)
        if not recipes:
            raise AssistantError("No assistant recipes are available to you")

        tokens = set(self._tokenise(request))

        scored: List[Tuple[int, Dict[str, Any], List[str]]] = []
        for recipe in recipes:
            score = 0
            hits: List[str] = []
            for kw in recipe.get("keywords") or []:
                keyword = str(kw).lower()
                # multi-word keywords match as a phrase
                if " " in keyword:
                    if keyword in (request or "").lower():
                        score += 2
                        hits.append(keyword)
                elif keyword in tokens:
                    score += 1
                    hits.append(keyword)
            if score:
                scored.append((score, recipe, hits))

        if not scored:
            return {
                "matched": False,
                "reason": "no recipe matched; choose a template instead",
                "available_recipes": [
                    {"recipe_key": r["recipe_key"], "display_name": r["display_name"]}
                    for r in recipes
                ],
            }

        scored.sort(key=lambda x: (-x[0], x[1]["recipe_key"]))
        score, recipe, hits = scored[0]
        return {
            "matched": True,
            "recipe_key": recipe["recipe_key"],
            "display_name": recipe["display_name"],
            "score": score,
            "matched_keywords": hits,
            "questions": recipe.get("questions") or [],
            "resulting_template_key": recipe.get("resulting_template_key"),
            "other_matches": [
                {"recipe_key": r["recipe_key"], "score": s, "matched_keywords": h}
                for s, r, h in scored[1:3]
            ],
        }

    # -- step 2: constrained questions -------------------------------------

    @staticmethod
    def answer_questions(questions: List[Dict[str, Any]],
                         answers: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], List[str]]:
        """Validate answers against the recipe's declared questions.

        Only declared options are accepted. An answer that is not one of the
        options is REFUSED rather than coerced, because this is the boundary that
        stops a free-text value becoming a filter.
        """
        errors: List[str] = []
        resolved: List[Dict[str, Any]] = []

        declared = {
            q.get("id") for q in (questions or []) if isinstance(q, dict)
        }
        # An answer to a question the recipe never declared is REFUSED, not
        # silently ignored. Ignoring it would look like the assistant accepted
        # the input while doing nothing with it, which is exactly the kind of
        # quiet no-op that later looks like a security gap.
        unknown = sorted(set((answers or {}).keys()) - declared - {None})
        if unknown:
            errors.append(
                f"answer for undeclared question(s) {unknown}; "
                f"declared questions are {sorted(x for x in declared if x)}")

        for q in questions or []:
            if not isinstance(q, dict):
                continue
            qid = q.get("id")
            options = q.get("options") or []
            default = q.get("default")
            raw = (answers or {}).get(qid, default)
            if raw is None:
                errors.append(f"question {qid!r} requires an answer")
                continue
            if options and raw not in options:
                errors.append(
                    f"answer for {qid!r} must be one of {options}, got {raw!r}")
                continue
            resolved.append({"id": qid, "answer": raw, "prompt": q.get("prompt")})
        return resolved, errors

    # -- step 3: materialise ------------------------------------------------

    def build_candidate(self, principal: Dict[str, Any], tenant_id: str,
                        recipe_key: str, answers: Dict[str, Any],
                        title: Optional[str] = None) -> Dict[str, Any]:
        """Produce a candidate definition from a recipe + answers.

        This function does NOT save anything. It returns a definition that the
        caller can preview, and that will be written only through
        ReportDefinitionService.create_report, which validates and authorises it
        like any hand-authored definition.
        """
        auth = self.definitions._auth(principal, tenant_id)
        auth.require_permission("reports:create")
        auth.require_entitlement("report_studio")

        rows = self.db.execute("""
            SELECT questions, resulting_template_key, required_data_sources
            FROM platform.report_assistant_recipes
            WHERE recipe_key = %s AND is_active IS TRUE
        """, (recipe_key,))
        if not rows:
            raise AssistantError(f"Unknown recipe {recipe_key!r}")
        questions, template_key, data_sources = rows[0]

        resolved, errors = self.answer_questions(questions or [], answers)
        if errors:
            raise AssistantError("; ".join(errors))

        if not template_key:
            raise AssistantError(
                f"recipe {recipe_key!r} does not resolve to a template")

        template = self.templates.get_template(template_key)
        required_e = set(template.get("required_entitlements") or [])
        if not required_e.issubset(auth.entitlements):
            raise ReportAccessDenied(
                f"the resulting template requires entitlements "
                f"{sorted(required_e - auth.entitlements)}")

        definition = json.loads(json.dumps(template["definition"]))

        # Answers only ever REFINE a filter that the recipe declared. An answer
        # cannot introduce a new field, operator or source.
        mapping = {}
        for q in (questions or []):
            if isinstance(q, dict) and q.get("filter_field"):
                mapping[q["id"]] = (q["filter_field"], q.get("filter_op") or "eq")

        for item in resolved:
            pair = mapping.get(item["id"])
            if not pair:
                continue
            field, op = pair
            definition.setdefault("filters", [])
            definition["filters"] = [
                f for f in definition["filters"] if f.get("field") != field]
            definition["filters"].append(
                {"field": field, "op": op, "value": item["answer"]})

        return {
            "candidate": {
                "title": title or template["display_name"],
                "description": template.get("description"),
                "definition": definition,
                "origin": "assistant",
                "origin_recipe_key": recipe_key,
                "origin_answers": {i["id"]: i["answer"] for i in resolved},
                "derived_from_template_key": template_key,
                "derived_from_template_version": template["version"],
            }
        }

    def create_from_assistant(self, principal: Dict[str, Any], tenant_id: str,
                              recipe_key: str, answers: Dict[str, Any],
                              title: Optional[str] = None) -> Dict[str, Any]:
        """Materialise AND save, through the ordinary authorised path."""
        built = self.build_candidate(
            principal, tenant_id, recipe_key, answers, title)["candidate"]

        # The resulting template's entitlements become part of the report's own
        # snapshotted requirements, so withdrawing one later blocks the read even
        # though the report already exists.
        required_e: List[str] = []
        template_key = built.get("derived_from_template_key")
        if template_key:
            required_e = list(
                self.templates.get_template(template_key)
                .get("required_entitlements") or [])

        return self.definitions.create_report(
            principal, tenant_id,
            built["title"], built["definition"],
            description=built["description"],
            status="draft",
            origin="assistant",
            origin_recipe_key=built["origin_recipe_key"],
            origin_answers=built["origin_answers"],
            derived_from_template_key=built["derived_from_template_key"],
            derived_from_template_version=built["derived_from_template_version"],
            extra_entitlements=required_e,
        )
