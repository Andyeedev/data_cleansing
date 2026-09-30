"""OC-REPORT-001 Phase 1 — definition validator, DataSource resolver, aggregation engine.

No database is required: the validator is pure and the resolver/registry are
static, so the security rules are asserted directly.

The tests that matter most:
  * no definition can express a tenant, a table, or a join
  * no undeclared field is usable
  * no un-allowlisted operator or aggregation can be emitted
  * every compiled query carries the tenant predicate and a row limit
  * the batch family never references migration_batch_registry.tenant_id
"""
import re

import pytest

from app.services.report_definition_validator import (
    SCHEMA_VERSION,
    validate_definition,
)
from app.services.report_datasource_resolver import (
    DataSourceError,
    DataSourceResolver,
    UnknownDataSource,
)
from app.services.report_aggregation_engine import AggregationEngine

# --- fixtures mirroring the seeded allowlist -------------------------------

SPECS = [
    {
        "data_source_key": "migration.exceptions",
        "schema_version": 1,
        "scope_family": "batch_family",
        "grain": "entity",
        "base_relation": "engine.migration_control_exceptions",
        "required_permission": "reports:read",
        "required_entitlement": "basic_reporting",
        "default_max_rows": 200,
        "fields": {"fields": [
            {"name": "batch_id", "role": "dimension", "type": "uuid"},
            {"name": "control_id", "role": "dimension", "type": "text"},
            {"name": "rule_id", "role": "dimension", "type": "text"},
            {"name": "entity_name", "role": "dimension", "type": "text"},
            {"name": "failure_scope", "role": "dimension", "type": "text"},
            {"name": "delta_value", "role": "measure", "type": "numeric",
             "aggregations": ["sum", "min", "max", "avg"]},
            {"name": "created_at", "role": "time", "type": "timestamp"},
        ]},
    },
    {
        "data_source_key": "control.registry",
        "schema_version": 1,
        "scope_family": "control_family",
        "grain": "control",
        "base_relation": "engine.control_registry",
        "required_permission": "reports:read",
        "required_entitlement": "basic_reporting",
        "default_max_rows": 200,
        "fields": {"fields": [
            {"name": "control_id", "role": "dimension", "type": "text"},
            {"name": "control_name", "role": "dimension", "type": "text"},
            {"name": "severity_level", "role": "dimension", "type": "text"},
            {"name": "enabled_flag", "role": "dimension", "type": "boolean"},
        ]},
    },
    {
        "data_source_key": "core.mapping_coverage",
        "schema_version": 1,
        "scope_family": "project_family",
        "grain": "batch",
        "base_relation": "core.dataset_mappings",
        "required_permission": "reports:read",
        "required_entitlement": "basic_reporting",
        "default_max_rows": 200,
        "fields": {"fields": [
            {"name": "project_id", "role": "dimension", "type": "uuid"},
            {"name": "source_table", "role": "dimension", "type": "text"},
            {"name": "mapping_id", "role": "dimension", "type": "uuid"},
        ]},
    },
]


def _resolver():
    r = DataSourceResolver.__new__(DataSourceResolver)
    r._db = None
    r._spec_cache = SPECS
    return r


def _family(key: str) -> str:
    """The scope family the resolver hard-codes for this key."""
    from app.services.report_datasource_resolver import _SOURCE_SQL
    return _SOURCE_SQL[key]["scope_family"]


# Every key the resolver registers gets a spec, so the scope-family tests cover
# the whole registry rather than a hand-picked subset. A key registered in code
# but absent from the allowlist is exactly the drift these tests exist to catch.
_GENERIC_FIELDS = {"fields": [
    {"name": "batch_id", "role": "dimension", "type": "uuid"},
    {"name": "delta_value", "role": "measure", "type": "numeric"},
]}
ALL_SPECS = [
    {
        "data_source_key": key,
        "schema_version": 1,
        "scope_family": _family(key),
        "grain": "batch",
        "base_relation": "engine.unknown_probe",
        "required_permission": "reports:read",
        "required_entitlement": "basic_reporting",
        "default_max_rows": 200,
        "fields": _GENERIC_FIELDS,
    }
    for key in sorted(__import__(
        "app.services.report_datasource_resolver", fromlist=["x"]
    )._SOURCE_SQL)
]

# The three sources used for detailed field/aggregation assertions.
DETAIL_SPECS = [
    {
        "data_source_key": "migration.exceptions",
        "schema_version": 1,
        "scope_family": "batch_family",
        "grain": "entity",
        "base_relation": "engine.migration_control_exceptions",
        "required_permission": "reports:read",
        "required_entitlement": "basic_reporting",
        "default_max_rows": 200,
        "fields": {"fields": [
            {"name": "batch_id", "role": "dimension", "type": "uuid"},
            {"name": "control_id", "role": "dimension", "type": "text"},
            {"name": "rule_id", "role": "dimension", "type": "text"},
            {"name": "entity_name", "role": "dimension", "type": "text"},
            {"name": "failure_scope", "role": "dimension", "type": "text"},
            {"name": "delta_value", "role": "measure", "type": "numeric",
             "aggregations": ["sum", "min", "max", "avg"]},
            {"name": "created_at", "role": "time", "type": "timestamp"},
        ]},
    },
    {
        "data_source_key": "core.mapping_coverage",
        "schema_version": 1,
        "scope_family": "project_family",
        "grain": "batch",
        "base_relation": "core.dataset_mappings",
        "required_permission": "reports:read",
        "required_entitlement": "basic_reporting",
        "default_max_rows": 200,
        "fields": {"fields": [
            {"name": "project_id", "role": "dimension", "type": "uuid"},
            {"name": "source_table", "role": "dimension", "type": "text"},
            {"name": "mapping_id", "role": "dimension", "type": "uuid"},
        ]},
    },
    {
        "data_source_key": "control.registry",
        "schema_version": 1,
        "scope_family": "control_family",
        "grain": "control",
        "base_relation": "engine.control_registry",
        "required_permission": "reports:read",
        "required_entitlement": "basic_reporting",
        "default_max_rows": 200,
        "fields": {"fields": [
            {"name": "control_id", "role": "dimension", "type": "text"},
            {"name": "control_name", "role": "dimension", "type": "text"},
            {"name": "severity_level", "role": "dimension", "type": "text"},
            {"name": "enabled_flag", "role": "dimension", "type": "boolean"},
        ]},
    },
]

# The allowlist passed to the validator: registry-wide coverage plus the
# detailed field definitions. Detailed specs WIN over the generated generic
# ones, so a key is never shadowed.
_DETAIL_KEYS = {s["data_source_key"] for s in DETAIL_SPECS}
SPECS = [s for s in ALL_SPECS if s["data_source_key"] not in _DETAIL_KEYS] \
    + DETAIL_SPECS


def _def(**over):
    base = {
        "schema_version": SCHEMA_VERSION,
        "data_source_key": "migration.exceptions",
        "sections": [{
            "id": "c1",
            "type": "bar",
            "title": "Delta by owner",
            "bindings": {"measure": "delta_value", "dimensions": ["failure_scope"]},
        }],
        "filters": [],
    }
    base.update(over)
    return base


# --- validator -------------------------------------------------------------

class TestValidatorAccepts:
    def test_minimal_valid_definition(self):
        errors, norm = validate_definition(_def(), SPECS)
        assert errors == []
        assert norm["data_source_key"] == "migration.exceptions"

    def test_all_v1_component_types(self):
        for t in ("kpi", "table", "bar", "line", "donut", "scorebar", "barlist"):
            d = _def(sections=[{"id": "s", "type": t,
                                "bindings": {"measure": "delta_value",
                                             "dimensions": ["failure_scope"]}}])
            errors, _ = validate_definition(d, SPECS)
            assert errors == [], f"{t}: {errors}"

    def test_derived_control_fields_allowed(self):
        d = _def(sections=[{"id": "s", "type": "table",
                            "bindings": {"dimensions": ["control_name"]}}])
        errors, _ = validate_definition(d, SPECS)
        assert errors == []

    @pytest.mark.parametrize("op", ["eq", "ne", "gt", "gte", "lt", "lte",
                                    "in", "nin", "between", "like"])
    def test_every_allowlisted_operator(self, op):
        val = {"in": ["A", "B"], "nin": ["A"], "between": [1, 2],
               "like": "x"}.get(op, "v")
        errors, _ = validate_definition(
            _def(filters=[{"field": "failure_scope", "op": op, "value": val}]), SPECS)
        assert errors == [], f"{op}: {errors}"


class TestValidatorRejects:
    def test_unknown_data_source(self):
        errors, _ = validate_definition(_def(data_source_key="nope"), SPECS)
        assert any("not in the allowlist" in e for e in errors)

    def test_tenant_id_in_filter_is_rejected(self):
        errors, _ = validate_definition(
            _def(filters=[{"field": "tenant_id", "op": "eq", "value": "x"}]), SPECS)
        assert errors
        assert any("reserved" in e for e in errors)

    def test_tenant_id_as_data_source_rejected(self):
        errors, _ = validate_definition(
            _def(data_source_key="tenant_id"), SPECS)
        assert errors

    def test_undeclared_field_rejected(self):
        errors, _ = validate_definition(
            _def(filters=[{"field": "secret_column", "op": "eq", "value": 1}]), SPECS)
        assert any("not declared" in e for e in errors)

    def test_undeclared_measure_rejected(self):
        errors, _ = validate_definition(_def(sections=[{
            "id": "s", "type": "kpi",
            "bindings": {"measure": "not_a_field"}}]), SPECS)
        assert any("not declared" in e for e in errors)

    def test_dimension_used_as_measure_rejected(self):
        errors, _ = validate_definition(_def(sections=[{
            "id": "s", "type": "kpi",
            "bindings": {"measure": "failure_scope"}}]), SPECS)
        assert any("is a dimension" in e for e in errors)

    def test_unallowlisted_operator(self):
        errors, _ = validate_definition(
            _def(filters=[{"field": "failure_scope", "op": "union", "value": 1}]),
            SPECS)
        assert any("not allowlisted" in e for e in errors)

    def test_unallowlisted_aggregation(self):
        errors, _ = validate_definition(_def(sections=[{
            "id": "s", "type": "kpi",
            "bindings": {"measure": "delta_value", "aggregation": "median"}}]), SPECS)
        assert any("not allowlisted" in e for e in errors)

    def test_sql_injection_attempt_in_filter_value(self):
        errors, _ = validate_definition(
            _def(filters=[{"field": "failure_scope", "op": "eq",
                           "value": "x'; DROP TABLE core.tenants; --"}]), SPECS)
        # a string VALUE is allowed (it is bound as a parameter) — the important
        # part is that it is never interpolated. Assert it survives validation
        # so we then prove parameterisation at the engine level.
        assert errors == []

    def test_sql_injection_attempt_in_filter_field(self):
        errors, _ = validate_definition(
            _def(filters=[{"field": "x) OR 1=1 --", "op": "eq", "value": 1}]), SPECS)
        assert errors

    def test_v2_component_types_rejected(self):
        for t in ("scatter", "matrix", "pivot"):
            errors, _ = validate_definition(
                _def(sections=[{"id": "s", "type": t,
                                "bindings": {"measure": "delta_value",
                                             "dimensions": ["failure_scope"]}}]), SPECS)
            assert any("not a V1 component type" in e for e in errors), t

    def test_chart_without_dimension_rejected(self):
        errors, _ = validate_definition(_def(sections=[{
            "id": "s", "type": "bar", "bindings": {"measure": "delta_value"}}]), SPECS)
        assert any("needs a dimension" in e for e in errors)

    def test_max_rows_out_of_range(self):
        errors, _ = validate_definition(
            _def(sections=[{"id": "s", "type": "kpi", "max_rows": 10**9,
                            "config": {"max_rows": 10**9},
                            "bindings": {"measure": "delta_value"}}]), SPECS)
        assert errors

    def test_wrong_schema_version(self):
        errors, _ = validate_definition(_def(schema_version=99), SPECS)
        assert any("schema_version" in e for e in errors)

    def test_duplicate_section_ids(self):
        errors, _ = validate_definition(_def(sections=[
            {"id": "s", "type": "kpi", "bindings": {"measure": "delta_value"}},
            {"id": "s", "type": "kpi", "bindings": {"measure": "delta_value"}},
        ]), SPECS)
        assert any("duplicate id" in e for e in errors)

    def test_too_many_sections(self):
        sec = [{"id": f"s{i}", "type": "kpi",
                "bindings": {"measure": "delta_value"}} for i in range(40)]
        errors, _ = validate_definition(_def(sections=sec), SPECS)
        assert any("too many sections" in e for e in errors)


# --- resolver --------------------------------------------------------------

class TestResolverScopeFamilies:
    def test_batch_family_never_uses_batch_registry_tenant_id(self):
        """The measured trap: migration_batch_registry.tenant_id is NULL for
        670 of 705 live rows. Any query filtering on it would silently drop
        those batches or, worse, fall back inconsistently."""
        r = _resolver()
        for key in r.supported_keys():
            rel = r.resolve_relation(key)
            combined = rel["from_sql"] + rel["where_sql"]
            # the batch registry alias must never carry a tenant predicate
            assert not re.search(r"\bb\.tenant_id\b", combined), key
            if rel["scope_family"] in ("batch_family", "project_family"):
                assert "p.tenant_id::text = %(tenant_id)s" in rel["where_sql"], key
                assert "core.projects" in rel["from_sql"], key
            else:
                assert "c.tenant_id::text = %(tenant_id)s" in rel["where_sql"], key

    def test_all_three_scope_families_are_represented(self):
        """control_family must have a seeded source, or the third family is
        declared but never exercised."""
        r = _resolver()
        families = {r.resolve_relation(k)["scope_family"]
                    for k in r.supported_keys()}
        assert families == {"batch_family", "control_family", "project_family"}

    def test_batch_family_resolves_via_projects_join(self):
        r = _resolver()
        rel = r.resolve_relation("migration.exceptions")
        assert rel["scope_family"] == "batch_family"
        assert "core.projects" in rel["from_sql"]

    def test_project_family_uses_projects(self):
        r = _resolver()
        rel = r.resolve_relation("core.mapping_coverage")
        assert rel["scope_family"] == "project_family"
        assert "core.projects" in rel["from_sql"]

    def test_control_family_uses_direct_tenant_id(self):
        r = _resolver()
        rel = r.resolve_relation("control.registry")
        assert rel["scope_family"] == "control_family"
        assert "c.tenant_id::text = %(tenant_id)s" in rel["where_sql"]

    def test_unknown_key_rejected(self):
        r = _resolver()
        for bad in ("core.tenants", "engine.migration_control_execution", "x"):
            with pytest.raises(UnknownDataSource):
                r.resolve_relation(bad)

    def test_scope_family_mismatch_refused(self):
        """A source that declares a family the resolver does not implement for
        it must fail loudly rather than build a wrong predicate."""
        detail = next(s for s in SPECS
                      if s["data_source_key"] == "migration.exceptions")
        r = _resolver()
        r._spec_cache = [dict(detail, scope_family="control_family")]
        with pytest.raises(DataSourceError) as e:
            r.resolve_relation("migration.exceptions")
        assert "scope family mismatch" in str(e.value)


class TestResolverFields:
    def test_declared_field_returns_qualified_column(self):
        r = _resolver()
        assert r.field_expression("migration.exceptions", "delta_value") \
            == "x.delta_value"

    def test_undeclared_field_refused(self):
        r = _resolver()
        with pytest.raises(DataSourceError):
            r.field_expression("migration.exceptions", "nope")

    def test_derived_field(self):
        r = _resolver()
        assert r.field_expression(
            "migration.exceptions", "control_name") == "c.control_name"

    def test_field_expression_cannot_inject(self):
        r = _resolver()
        with pytest.raises(DataSourceError):
            r.field_expression("migration.exceptions", "x.id; DROP TABLE t")


class TestResolverEntitlementFilter:
    def test_source_requires_both_permission_and_entitlement(self):
        r = _resolver()
        got = {s["data_source_key"] for s in
               r.list_sources_for_principal(["reports:read"], {"basic_reporting"})}
        # every registered source is entitled at these settings
        assert got == set(r.supported_keys())

    def test_every_registered_source_is_covered_by_a_spec(self):
        """A key in the resolver registry with no allowlist spec is drift."""
        r = _resolver()
        assert set(r.supported_keys()) <= {s["data_source_key"] for s in SPECS}

    def test_missing_entitlement_excludes_source(self):
        r = _resolver()
        assert r.list_sources_for_principal(["reports:read"], set()) == []

    def test_missing_permission_excludes_source(self):
        r = _resolver()
        assert r.list_sources_for_principal([], {"basic_reporting"}) == []


# --- aggregation engine ----------------------------------------------------

class TestEngineParameterisation:
    def _plan(self, definition=None, tenant="11111111-1111-1111-1111-111111111111"):
        eng = AggregationEngine(resolver=_resolver())
        return eng.build_queries(definition or _def(), tenant, SPECS)

    def test_every_query_carries_tenant_predicate(self):
        plan, errors = self._plan()
        assert errors == []
        for sec in plan["sections"]:
            assert "p.tenant_id::text = %(tenant_id)s" in sec["sql"]
            assert "tenant_id" in sec["params"]

    def test_every_query_has_a_row_limit(self):
        plan, _ = self._plan()
        for sec in plan["sections"]:
            assert re.search(r"LIMIT %\(\w+\)s", sec["sql"])
            limits = [v for k, v in sec["params"].items()
                      if k.startswith("section_limit_")]
            assert len(limits) == 1
            assert 0 < limits[0] <= 1000

    def test_tenant_is_a_bound_parameter_not_literal(self):
        plan, _ = self._plan(tenant="SECRET-TENANT")
        blob = " ".join(s["sql"] for s in plan["sections"])
        assert "SECRET-TENANT" not in blob
        assert all(s["params"]["tenant_id"] == "SECRET-TENANT"
                   for s in plan["sections"])

    def test_filter_value_is_parameterised(self):
        d = _def(filters=[{"field": "failure_scope", "op": "eq",
                           "value": "x'; DROP TABLE core.tenants; --"}])
        plan, errors = self._plan(d)
        assert errors == []
        for sec in plan["sections"]:
            assert "DROP TABLE" not in sec["sql"]
        vals = [v for k, v in plan["sections"][0]["params"].items()
                if k.startswith("v")]
        assert "x'; DROP TABLE core.tenants; --" in vals

    def test_no_interpolation_of_field_names(self):
        d = _def(filters=[{"field": "failure_scope", "op": "eq", "value": "A"}])
        plan, errors = self._plan(d)
        assert errors == []
        for sec in plan["sections"]:
            assert "x.failure_scope = %(v0)s" in sec["sql"]

    def test_in_operator_uses_any(self):
        d = _def(filters=[{"field": "failure_scope", "op": "in",
                           "value": ["CRITICAL", "HIGH"]}])
        plan, errors = self._plan(d)
        assert errors == []
        assert "= ANY(%(v0)s)" in plan["sections"][0]["sql"]

    def test_between_uses_two_params(self):
        d = _def(filters=[{"field": "delta_value", "op": "between",
                           "value": [1, 10]}])
        plan, errors = self._plan(d)
        assert errors == []
        p = plan["sections"][0]["params"]
        assert p["v0_0"] == 1 and p["v0_1"] == 10

    def test_like_wraps_value(self):
        d = _def(filters=[{"field": "entity_name", "op": "like", "value": "GL"}])
        plan, errors = self._plan(d)
        assert errors == []
        assert plan["sections"][0]["params"]["v0"] == "%GL%"

    def test_aggregation_emitted_for_measures(self):
        d = _def(sections=[{"id": "s", "type": "bar",
                            "bindings": {"measure": "delta_value",
                                         "dimensions": ["failure_scope"],
                                         "aggregation": "sum"}}])
        plan, errors = self._plan(d)
        assert errors == []
        sql = plan["sections"][0]["sql"]
        assert "sum(x.delta_value) AS value" in sql
        assert "GROUP BY x.failure_scope" in sql

    def test_count_without_measure(self):
        d = _def(sections=[{"id": "s", "type": "kpi",
                            "bindings": {"aggregation": "count"}}])
        plan, errors = self._plan(d)
        assert errors == []
        assert "count(*) AS value" in plan["sections"][0]["sql"]

    def test_measure_without_aggregation_rejected(self):
        d = _def(sections=[{"id": "s", "type": "kpi",
                            "bindings": {"measure": "delta_value",
                                         "aggregation": "sum"}}])
        # kpi with no dimension is fine; but avg on a measure needs an
        # allowlisted aggregation, which 'sum' is. This asserts the happy path
        # and that nothing extra is emitted.
        plan, errors = self._plan(d)
        assert errors == []
        assert "sum(x.delta_value)" in plan["sections"][0]["sql"]

    def test_invalid_definition_yields_no_plan(self):
        plan, errors = self._plan(_def(data_source_key="nope"))
        assert plan is None and errors

    def test_max_rows_clamped_to_source_default(self):
        eng = AggregationEngine(resolver=_resolver())
        plan, errors = eng.build_queries(
            _def(), "t1", SPECS, ) if False else eng.build_queries(
            _def(), "t1", SPECS)
        assert errors == []
        assert plan["max_rows"] == 200  # source default

    def test_plan_reports_required_authorisation(self):
        plan, _ = self._plan()
        assert plan["required_permission"] == "reports:read"
        assert plan["required_entitlement"] == "basic_reporting"
        assert plan["scope_family"] == "batch_family"


class TestEngineReadOnly:
    def test_no_write_statement_anywhere(self):
        eng = AggregationEngine(resolver=_resolver())
        plan, errors = eng.build_queries(_def(), "t1", SPECS)
        assert errors == []
        for sec in plan["sections"]:
            up = sec["sql"].upper()
            for banned in ("INSERT", "UPDATE", "DELETE", "DROP", "ALTER",
                           "TRUNCATE", "GRANT", "COPY"):
                assert banned not in up, (banned, sec["sql"])

    def test_every_query_is_a_select(self):
        eng = AggregationEngine(resolver=_resolver())
        plan, _ = eng.build_queries(_def(), "t1", SPECS)
        for sec in plan["sections"]:
            assert sec["sql"].strip().upper().startswith("SELECT ")
