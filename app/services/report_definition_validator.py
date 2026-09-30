"""OC-REPORT-001 — report definition validator.

The single authority for whether a report definition is well-formed. Called
identically by the builder UI, the save API, the template instantiator and the
Report Assistant. There is deliberately no privileged path: a definition that
cannot be produced by a human in the builder cannot be produced by the assistant
either, because both go through this function.

Pure by design — it takes the DataSource specs as an argument rather than
reading the database — so the security rules are unit-testable without a
database, and so the caller cannot smuggle in a spec that was never registered.

The three rules that matter most:

  1. NO TENANT PREDICATE. Any attempt to reference tenant_id, or to name a
     relation in a filter, is rejected. Tenant scope is injected by
     DataSourceResolver and can never originate from a definition.
  2. FIELDS MUST BE DECLARED. A field is usable only if the DataSource's
     registered field list contains it. This is what stops a definition being
     used to probe for the existence of columns.
  3. AGGREGATIONS AND OPERATORS ARE ALLOWLISTED. Only the enumerated tokens are
     emitted into SQL, so there is no place for an expression to be injected.
"""
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple

SCHEMA_VERSION = 1

# V1 component types. Scatter/matrix/pivot are V2 and are rejected here so they
# cannot be smuggled in early.
SECTION_TYPES = frozenset({
    "kpi", "table", "bar", "line", "donut", "scorebar", "barlist",
})

# Allowlisted aggregations. No SQL expressions, no user functions.
AGGREGATIONS = frozenset({
    "count", "sum", "avg", "min", "max", "count_distinct",
})

# Allowlisted filter operators. Each maps to exactly one emitted SQL fragment in
# the AggregationEngine; none accept a raw expression.
FILTER_OPERATORS = frozenset({
    "eq", "ne", "gt", "gte", "lt", "lte", "in", "nin", "between", "like",
})

# Types that may be used as a measure.
MEASURE_TYPES = frozenset({"integer", "numeric", "bigint", "double precision"})

# Identifiers that must never appear anywhere in a definition. A definition is
# JSON, so a field name is the only place SQL could be smuggled; these are
# refused outright rather than merely unused.
FORBIDDEN_IDENTIFIERS = frozenset({
    "tenant_id", "tenantid", "x_tenant_id",
    "sql", "query", "raw_sql", "statement",
})

MAX_SECTIONS = 25
MAX_FILTERS = 25
MAX_VALUES_PER_FILTER = 200
HARD_MAX_ROWS = 1000

# Fields the resolver supplies rather than the base relation. Usable in a
# definition, but they are not raw columns.
DERIVED_FIELDS = frozenset({"control_name", "control_severity"})


class DefinitionError(Exception):
    """Raised with a list of human-readable problems."""

    def __init__(self, errors: List[str]):
        self.errors = errors
        super().__init__("; ".join(errors))


def _field_map(spec: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    return {f["name"]: f for f in spec.get("fields", {}).get("fields", [])}


def _is_reserved(value: Any) -> bool:
    return isinstance(value, str) and value.strip().lower() in FORBIDDEN_IDENTIFIERS


def validate_definition(
    definition: Any,
    data_sources: Iterable[Dict[str, Any]],
    *,
    max_rows: int = 200,
) -> Tuple[List[str], Optional[Dict[str, Any]]]:
    """Validate a report definition.

    Args:
        definition: the candidate definition (any JSON-able value).
        data_sources: registered DataSource specs, as returned by
            DataSourceResolver.list_specs(). Only registered sources resolve.
        max_rows: row cap to record on the result. Clamped to HARD_MAX_ROWS.

    Returns:
        (errors, normalized). ``errors`` is empty when the definition is valid.
        ``normalized`` carries the resolved spec and the effective row cap, and
        is None when validation failed.

    Raises:
        DefinitionError: never — errors are returned, not raised, so a caller
            can surface all problems at once.
    """
    errors: List[str] = []

    specs = {s["data_source_key"]: s for s in data_sources}

    if not isinstance(definition, dict):
        return (["definition must be a JSON object"], None)

    # -- schema version ----------------------------------------------------
    version = definition.get("schema_version")
    if version != SCHEMA_VERSION:
        errors.append(
            f"schema_version must be {SCHEMA_VERSION}, got {version!r}")

    # -- data source -------------------------------------------------------
    key = definition.get("data_source_key")
    if not isinstance(key, str) or not key:
        errors.append("data_source_key is required")
        return (errors, None)
    if _is_reserved(key):
        errors.append(f"illegal data_source_key {key!r}")
        return (errors, None)
    spec = specs.get(key)
    if spec is None:
        errors.append(
            f"unknown data_source_key {key!r} — not in the allowlist")
        return (errors, None)

    allowed = _field_map(spec)
    allowed_names: Set[str] = set(allowed) | DERIVED_FIELDS

    def check_field(name: Any, where: str, *, must_be: Optional[str] = None) -> None:
        if not isinstance(name, str) or not name:
            errors.append(f"{where}: field name required")
            return
        if _is_reserved(name):
            errors.append(f"{where}: {name!r} is reserved and cannot be used")
            return
        if name not in allowed_names:
            errors.append(f"{where}: field {name!r} is not declared by {key}")
            return
        if must_be:
            actual = allowed.get(name, {}).get("role")
            if actual != must_be:
                errors.append(
                    f"{where}: field {name!r} is a {actual}, expected {must_be}")

    # -- sections ----------------------------------------------------------
    sections = definition.get("sections")
    if not isinstance(sections, list) or not sections:
        errors.append("sections must be a non-empty list")
    elif len(sections) > MAX_SECTIONS:
        errors.append(f"too many sections (max {MAX_SECTIONS})")
    else:
        seen_ids: Set[str] = set()
        for i, sec in enumerate(sections):
            where = f"sections[{i}]"
            if not isinstance(sec, dict):
                errors.append(f"{where}: must be an object")
                continue
            sid = sec.get("id")
            if not isinstance(sid, str) or not sid:
                errors.append(f"{where}: id required")
            elif sid in seen_ids:
                errors.append(f"{where}: duplicate id {sid!r}")
            else:
                seen_ids.add(sid)

            stype = sec.get("type")
            if stype not in SECTION_TYPES:
                errors.append(
                    f"{where}: type {stype!r} is not a V1 component type "
                    f"({sorted(SECTION_TYPES)})")

            title = sec.get("title")
            if title is not None and not isinstance(title, str):
                errors.append(f"{where}: title must be a string")
            elif isinstance(title, str) and len(title) > 200:
                errors.append(f"{where}: title too long (max 200)")

            bindings = sec.get("bindings")
            if bindings is None:
                bindings = {}
            if not isinstance(bindings, dict):
                errors.append(f"{where}: bindings must be an object")
                bindings = {}

            agg = bindings.get("aggregation")
            if agg is not None and agg not in AGGREGATIONS:
                errors.append(
                    f"{where}: aggregation {agg!r} is not allowlisted")

            measure = bindings.get("measure")
            if measure is not None:
                check_field(measure, f"{where}.bindings.measure", must_be="measure")

            for dim in bindings.get("dimensions") or []:
                check_field(dim, f"{where}.bindings.dimensions")
            if bindings.get("time_axis") is not None:
                check_field(bindings["time_axis"], f"{where}.bindings.time_axis")
            if bindings.get("series") is not None:
                check_field(bindings["series"], f"{where}.bindings.series")

            # a chart needs something to plot
            if stype in {"bar", "line", "donut"}:
                if not (bindings.get("dimensions") or bindings.get("time_axis")):
                    errors.append(
                        f"{where}: type {stype!r} needs a dimension or time axis")

            sort = sec.get("sort")
            if sort is not None:
                if not isinstance(sort, dict):
                    errors.append(f"{where}: sort must be an object")
                else:
                    if sort.get("dir") not in (None, "asc", "desc"):
                        errors.append(
                            f"{where}.sort: dir must be 'asc' or 'desc'")

            cfg = sec.get("config")
            if cfg is not None and not isinstance(cfg, dict):
                errors.append(f"{where}: config must be an object")
            elif isinstance(cfg, dict):
                mr = cfg.get("max_rows")
                if mr is not None:
                    if not isinstance(mr, int) or isinstance(mr, bool):
                        errors.append(f"{where}.config.max_rows must be an integer")
                    elif mr < 1 or mr > HARD_MAX_ROWS:
                        errors.append(
                            f"{where}.config.max_rows out of range (1..{HARD_MAX_ROWS})")

    # -- saved filters -----------------------------------------------------
    filters = definition.get("filters") or []
    if not isinstance(filters, list):
        errors.append("filters must be a list")
        filters = []
    elif len(filters) > MAX_FILTERS:
        errors.append(f"too many filters (max {MAX_FILTERS})")
    else:
        for i, f in enumerate(filters):
            where = f"filters[{i}]"
            if not isinstance(f, dict):
                errors.append(f"{where}: must be an object")
                continue
            check_field(f.get("field"), f"{where}.field")
            op = f.get("op")
            if op not in FILTER_OPERATORS:
                errors.append(
                    f"{where}: operator {op!r} is not allowlisted "
                    f"({sorted(FILTER_OPERATORS)})")
            val = f.get("value")
            if op in {"in", "nin"}:
                if not isinstance(val, list) or not val:
                    errors.append(f"{where}: op {op!r} needs a non-empty list")
                elif len(val) > MAX_VALUES_PER_FILTER:
                    errors.append(
                        f"{where}: too many values (max {MAX_VALUES_PER_FILTER})")
                else:
                    for v in val:
                        if _is_reserved(v):
                            errors.append(f"{where}: reserved value {v!r}")
                            break
            elif op == "between":
                if not isinstance(val, (list, tuple)) or len(val) != 2:
                    errors.append(f"{where}: op 'between' needs exactly 2 values")
            else:
                if _is_reserved(val):
                    errors.append(f"{where}: reserved value {val!r}")

    # -- runtime parameters ------------------------------------------------
    params = definition.get("parameters") or []
    if not isinstance(params, list):
        errors.append("parameters must be a list")
    else:
        for i, p in enumerate(params):
            where = f"parameters[{i}]"
            if not isinstance(p, dict):
                errors.append(f"{where}: must be an object")
                continue
            if not isinstance(p.get("name"), str) or not p.get("name"):
                errors.append(f"{where}: name required")
            if p.get("type") not in {"string", "integer", "number", "boolean", "date"}:
                errors.append(f"{where}: unsupported type {p.get('type')!r}")

    # -- row cap -----------------------------------------------------------
    if not isinstance(max_rows, int) or isinstance(max_rows, bool):
        errors.append("max_rows must be an integer")
        max_rows = 200
    elif max_rows < 1 or max_rows > HARD_MAX_ROWS:
        errors.append(f"max_rows out of range (1..{HARD_MAX_ROWS})")
        max_rows = min(max(HARD_MAX_ROWS, 1), HARD_MAX_ROWS)

    if errors:
        return (errors, None)

    return ([], {
        "data_source_key": key,
        "spec": spec,
        "max_rows": max_rows,
        "sections": sections,
        "filters": filters,
    })
