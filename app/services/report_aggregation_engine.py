"""OC-REPORT-001 — aggregation engine.

Turns a validated definition into ONE parameterised, read-only SQL statement.

Security properties, in order of importance:

  1. NO STRING INTERPOLATION OF USER DATA. Every value becomes a bound
     parameter. Identifiers come from DataSourceResolver.field_expression(),
     which only ever returns a hard-coded alias-qualified column. Operators and
     aggregations come from frozen allowlists. There is no code path in which a
     caller-supplied string reaches the SQL text.
  2. TENANT SCOPE IS NEVER NEGOTIABLE. The tenant predicate is appended by the
     resolver and cannot be removed by a definition. A definition has no way to
     express a tenant, and no way to omit the scope.
  3. AGGREGATION HAPPENS IN SQL. Rows are not fetched and aggregated in Python,
     which is both correct at scale and what keeps the raw-SQL-in-a-handler
     pattern out of the report path.
  4. ROW CAP ALWAYS APPLIED. Even a 'table' section is capped, and the response
     states whether it was truncated, so a capped export can never silently
     misrepresent itself as complete.
"""
from typing import Any, Dict, List, Optional, Tuple

from app.services.report_datasource_resolver import (
    DataSourceResolver,
    DataSourceError,
    UnknownDataSource,
)
from app.services.report_definition_validator import (
    AGGREGATIONS,
    FILTER_OPERATORS,
    HARD_MAX_ROWS,
    validate_definition,
)

# Operator -> SQL template. Each entry is a fixed fragment with bound
# placeholders. No key accepts caller text.
_OP_SQL = {
    "eq":   "{expr} = %(v0)s",
    "ne":   "{expr} <> %(v0)s",
    "gt":   "{expr} > %(v0)s",
    "gte":  "{expr} >= %(v0)s",
    "lt":   "{expr} < %(v0)s",
    "lte":  "{expr} <= %(v0)s",
    "in":   "{expr} = ANY(%(v0)s)",
    "nin":  "NOT ({expr} = ANY(%(v0)s))",
    "between": "({expr} BETWEEN %(v0)s AND %(v1)s)",
    "like": "{expr} ILIKE %(v0)s",
}

# Aggregations that are read-only and safe on any declared measure type.
_AGG_SQL = {
    "count":          "count({expr})",
    "count_distinct": "count(DISTINCT {expr})",
    "sum":            "sum({expr})",
    "avg":            "avg({expr})",
    "min":            "min({expr})",
    "max":            "max({expr})",
}

# Sections that render raw rows rather than an aggregate.
_ROW_TYPES = frozenset({"table"})


class AggregationError(Exception):
    pass


class AggregationEngine:
    def __init__(self, resolver: Optional[DataSourceResolver] = None):
        self.resolver = resolver or DataSourceResolver()

    # -- filter compilation -------------------------------------------------

    def _compile_filters(
        self,
        key: str,
        filters: List[Dict[str, Any]],
    ) -> Tuple[List[str], Dict[str, Any]]:
        """Compile saved filters into SQL fragments and bound parameters.

        Note this operates on the SAVED filters only. Runtime (user) filters are
        intersected with these in report_query_service; they are never applied
        as a replacement, which is what stops a runtime filter widening scope.
        """
        frags: List[str] = []
        params: Dict[str, Any] = {}
        for i, f in enumerate(filters):
            op = f.get("op")
            if op not in FILTER_OPERATORS:
                raise AggregationError(f"operator {op!r} is not allowlisted")
            try:
                expr = self.resolver.field_expression(key, f["field"])
            except (DataSourceError, KeyError) as exc:
                raise AggregationError(str(exc)) from exc

            value = f.get("value")
            if op in {"in", "nin"}:
                params[f"v{i}"] = list(value)
            elif op == "between":
                params[f"v{i}_0"] = value[0]
                params[f"v{i}_1"] = value[1]
                # placeholders use positional suffixes; normalise to v0/v1
                frag = _OP_SQL[op].replace(
                    "%(v0)s", f"%(v{i}_0)s").replace("%(v1)s", f"%(v{i}_1)s")
                frags.append(frag.format(expr=expr))
                continue
            elif op == "like":
                params[f"v{i}"] = f"%{value}%"
            else:
                params[f"v{i}"] = value

            frags.append(_OP_SQL[op].replace("%(v0)s", f"%(v{i})s")
                          .replace("%(v1)s", f"%(v{i})s")
                          .format(expr=expr))
        return frags, params

    # -- section compilation ------------------------------------------------

    def _compile_section(
        self,
        key: str,
        section: Dict[str, Any],
        from_sql: str,
        filters_sql: List[str],
        index: int,
    ) -> Tuple[str, Dict[str, Any], bool, List[str]]:
        """Return (sql, params, is_row_query, columns) for one section.

        from_sql is the resolver's hard-coded, tenant-scoped relation. It is
        REQUIRED and interpolated here, so no code path can emit a statement
        without a FROM: an earlier version built only the SELECT/WHERE/GROUP BY
        halves and never attached the relation, producing SQL that referenced the
        `p` alias with no table at all.
        """
        stype = section.get("type")
        bindings = section.get("bindings") or {}
        params: Dict[str, Any] = {}

        # filters_sql arrives as a LIST of fragments; join it once.
        where = "".join(filters_sql)

        if stype in _ROW_TYPES:
            dim = bindings.get("dimensions") or []
            if not dim:
                raise AggregationError(
                    f"section {section.get('id')!r}: table needs a dimension")
            measure = bindings.get("measure")
            out_cols = list(dim) + ([measure] if measure else [])
            cols = [self.resolver.field_expression(key, d) for d in out_cols]
            sel = ", ".join(f"{c} AS {n}" for c, n in zip(cols, out_cols))
            order = ""
            sort = section.get("sort") or {}
            if sort.get("field") in out_cols:
                s_expr = self.resolver.field_expression(key, sort["field"])
                direction = "DESC" if sort.get("dir") == "desc" else "ASC"
                order = f" ORDER BY {s_expr} {direction}"
            sql = f"SELECT {sel} {from_sql} {where}{order}"
            return sql, params, True, out_cols

        # aggregate shapes
        measure = bindings.get("measure")
        agg = bindings.get("aggregation") or "count"
        if agg not in AGGREGATIONS:
            raise AggregationError(f"aggregation {agg!r} is not allowlisted")

        if measure is None:
            if agg != "count":
                raise AggregationError(
                    "count is the only aggregation that takes no measure")
            value_sql = "count(*)"
        else:
            value_sql = _AGG_SQL[agg].format(
                expr=self.resolver.field_expression(key, measure))

        dims = list(bindings.get("dimensions") or [])
        if bindings.get("time_axis"):
            dims.append(bindings["time_axis"])

        if not dims:
            sql = f"SELECT {value_sql} AS value {from_sql} {where}"
            return sql, params, False, ["value"]

        dim_sql = ", ".join(
            self.resolver.field_expression(key, d) for d in dims)
        sel = f"{dim_sql}, {value_sql} AS value"
        sql = f"SELECT {sel} {from_sql} {where} GROUP BY {dim_sql}"
        return sql, params, False, list(dims) + ["value"]

        dim_sql = ", ".join(
            self.resolver.field_expression(key, d) for d in dims)
        sel = f"{dim_sql}, {value_sql} AS value"
        sql = f"SELECT {sel} {from_sql} {where} GROUP BY {dim_sql}"
        return sql, params, False

    # -- public API ---------------------------------------------------------

    def build_queries(
        self,
        definition: Dict[str, Any],
        tenant_id: str,
        data_sources: Optional[List[Dict[str, Any]]] = None,
    ) -> Tuple[Optional[Dict[str, Any]], List[str]]:
        """Validate then compile. Returns (plan, errors).

        plan is None when the definition is invalid. plan holds one SQL statement
        per section plus shared parameters, with the tenant predicate already
        applied and a row cap already present.
        """
        specs = data_sources if data_sources is not None \
            else self.resolver.list_specs()

        errors, norm = validate_definition(definition, specs)
        if errors:
            return (None, errors)

        key = norm["data_source_key"]
        spec = norm["spec"]

        if key not in self.resolver.supported_keys():
            return (None, [f"data_source_key {key!r} has no registered relation"])

        relation = self.resolver.resolve_relation(key)

        # tenant predicate is appended here and cannot be omitted
        base_where = [relation["where_sql"]]
        filter_sql, filter_params = self._compile_filters(key, norm["filters"])
        where_sql = relation["where_sql"] + "".join(
            f" AND ({frag})" for frag in filter_sql)

        shared: Dict[str, Any] = {
            "tenant_id": str(tenant_id),
            **filter_params,
        }

        cap = min(
            norm["max_rows"],
            spec.get("default_max_rows") or norm["max_rows"],
            HARD_MAX_ROWS,
        )

        sections: List[Dict[str, Any]] = []
        for i, sec in enumerate(norm["sections"]):
            try:
                sql, params, is_rows, columns = self._compile_section(
                    key, sec, relation["from_sql"], [where_sql], i)
            except (AggregationError, DataSourceError, UnknownDataSource) as exc:
                return (None, [f"sections[{i}]: {exc}"])
            row_cap = cap
            cfg = sec.get("config") or {}
            if isinstance(cfg.get("max_rows"), int) and not isinstance(
                    cfg.get("max_rows"), bool):
                row_cap = min(row_cap, cfg["max_rows"])
            sections.append({
                "id": sec.get("id"),
                "type": sec.get("type"),
                "title": sec.get("title"),
                "is_row_query": is_rows,
                "columns": columns,
                "sql": f"{sql} LIMIT %(section_limit_{i})s",
                "params": {**shared, **params, f"section_limit_{i}": row_cap},
            })

        return ({
            "data_source_key": key,
            "schema_version": spec.get("schema_version"),
            "scope_family": relation["scope_family"],
            "required_permission": spec.get("required_permission"),
            "required_entitlement": spec.get("required_entitlement"),
            "max_rows": cap,
            "sections": sections,
        }, [])

    def execute(
        self,
        definition: Dict[str, Any],
        tenant_id: str,
        data_sources: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Validate, compile and run every section.

        Rows are read with a LIMIT of row_cap + 1 so truncation is DETECTED
        rather than assumed, and reported honestly in meta.truncated.
        """
        plan, errors = self.build_queries(definition, tenant_id, data_sources)
        if errors:
            return {"errors": errors, "components": [], "meta": {"ok": False}}

        out_components = []
        truncated_any = False
        total_rows = 0

        for sec in plan["sections"]:
            params = dict(sec["params"])
            # +1 to detect truncation
            cap_key = next(k for k in params if k.startswith("section_limit_"))
            probe_cap = params[cap_key]
            params[cap_key] = probe_cap + 1
            rows = self.resolver.db.execute(sec["sql"], params)
            if len(rows) > probe_cap:
                rows = rows[:probe_cap]
                truncated_any = True
            total_rows += len(rows)
            out_components.append({
                "id": sec["id"],
                "type": sec["type"],
                "title": sec["title"],
                "is_row_query": sec["is_row_query"],
                "columns": sec.get("columns") or [],
                "rows": [list(r) for r in rows],
                "row_count": len(rows),
            })

        return {
            "errors": [],
            "meta": {
                "ok": True,
                "data_source_key": plan["data_source_key"],
                "schema_version": plan["schema_version"],
                "scope_family": plan["scope_family"],
                "max_rows": plan["max_rows"],
                "row_count": total_rows,
                "truncated": truncated_any,
            },
            "components": out_components,
        }
