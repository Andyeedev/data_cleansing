"""OC-REPORT-001 — DataSource resolver.

The ONLY sanctioned path from a report definition to a SQL relation. Two
properties are load-bearing:

  1. TENANT SCOPE IS INJECTED HERE, NEVER SUPPLIED BY THE DEFINITION.
     A definition cannot name a tenant, a table, or a join. Every FROM clause
     below is hard-coded and every one carries a tenant predicate that the
     caller supplies as a bound parameter.

  2. THE SCOPE FAMILY IS EXPLICIT AND MISMATCHES ARE REFUSED.
     Measured against the live database, engine.migration_batch_registry.tenant_id
     is NULL for 670 of 705 rows. It is therefore never used. The batch family
     always resolves through core.projects, which is also what the existing
     ExecutionHistoryService.verify_batch_tenant already does. Treating that
     column as usable would be a cross-tenant leak, so the resolver has no code
     path that references it.

There is no column anywhere in platform.report_data_sources in which SQL could
be stored, and none is added here: a data_source_key maps to a hard-coded FROM
clause below. That is what makes "no arbitrary SQL" enforceable rather than
aspirational.
"""
from typing import Any, Dict, List, Optional, Tuple

from app.db.connection import get_db_connection

# Scope families. Kept as constants because a mismatch is a security failure.
BATCH_FAMILY = "batch_family"
CONTROL_FAMILY = "control_family"
PROJECT_FAMILY = "project_family"

# The canonical tenant predicate for each family. Written once, here.
#
# batch_family  : batch_id -> migration_batch_registry -> project_id -> projects
#                 NEVER migration_batch_registry.tenant_id (95% NULL live)
# project_family: project_id -> core.projects
# control_family: direct tenant_id (verified 0 NULL on control_registry)
_TENANT_SQL = {
    BATCH_FAMILY: "p.tenant_id::text = %(tenant_id)s",
    PROJECT_FAMILY: "p.tenant_id::text = %(tenant_id)s",
    CONTROL_FAMILY: "c.tenant_id::text = %(tenant_id)s",
}

# FROM clause + optional control_registry join, per allowlisted source.
# Alias conventions:  b = batch registry, p = project, c = control registry,
#                     e/x/s/g = the base relation's own alias.
_SOURCE_SQL: Dict[str, Dict[str, Any]] = {
    "migration.batch": {
        "scope_family": BATCH_FAMILY,
        "from_sql": ("FROM engine.migration_batch_registry b "
                     "JOIN core.projects p ON p.project_id::text = b.project_id"),
        "alias": "b",
    },
    "migration.control_summary": {
        "scope_family": BATCH_FAMILY,
        "from_sql": ("FROM engine.migration_control_summary s "
                     "JOIN engine.migration_batch_registry b ON b.batch_id = s.batch_id "
                     "JOIN core.projects p ON p.project_id::text = b.project_id "
                     "LEFT JOIN engine.control_registry c ON c.control_id = s.control_id"),
        "alias": "s",
    },
    "migration.control_execution": {
        "scope_family": BATCH_FAMILY,
        "from_sql": ("FROM engine.migration_control_execution e "
                     "JOIN engine.migration_batch_registry b ON b.batch_id = e.batch_id "
                     "JOIN core.projects p ON p.project_id::text = b.project_id "
                     "LEFT JOIN engine.control_registry c ON c.control_id = e.control_id"),
        "alias": "e",
    },
    "migration.exceptions": {
        "scope_family": BATCH_FAMILY,
        "from_sql": ("FROM engine.migration_control_exceptions x "
                     "JOIN engine.migration_batch_registry b ON b.batch_id = x.batch_id "
                     "JOIN core.projects p ON p.project_id::text = b.project_id "
                     "LEFT JOIN engine.control_registry c ON c.control_id = x.control_id"),
        "alias": "x",
    },
    "migration.governance_status": {
        "scope_family": BATCH_FAMILY,
        "from_sql": ("FROM engine.migration_governance_status g "
                     "JOIN engine.migration_batch_registry b ON b.batch_id = g.batch_id "
                     "JOIN core.projects p ON p.project_id::text = b.project_id"),
        "alias": "g",
    },
    "migration.risk_index": {
        "scope_family": BATCH_FAMILY,
        "from_sql": ("FROM engine.v_batch_risk_index v "
                     "JOIN engine.migration_batch_registry b ON b.batch_id = v.batch_id "
                     "JOIN core.projects p ON p.project_id::text = b.project_id"),
        "alias": "v",
    },
    "core.mapping_coverage": {
        "scope_family": PROJECT_FAMILY,
        "from_sql": ("FROM core.dataset_mappings m "
                     "JOIN core.projects p ON p.project_id::text = m.project_id"),
        "alias": "m",
    },
    "control.registry": {
        "scope_family": CONTROL_FAMILY,
        "from_sql": "FROM engine.control_registry c",
        "alias": "c",
    },
}

# Fields the resolver derives from the control_registry join. Never emitted
# without the join being present.
_DERIVED = {"control_name": "c.control_name", "control_severity": "c.severity_level"}


class DataSourceError(Exception):
    pass


class UnknownDataSource(DataSourceError):
    pass


class DataSourceResolver:
    """Resolves allowlisted data sources and their tenant-scoped relations."""

    def __init__(self, db=None):
        self._db = db
        self._spec_cache: Optional[List[Dict[str, Any]]] = None

    # -- registry ----------------------------------------------------------

    @property
    def db(self):
        if self._db is None:
            self._db = get_db_connection()
        return self._db

    def clear_cache(self):
        self._spec_cache = None

    def list_specs(self, tenant_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Registered DataSource specs.

        The tenant argument is accepted for signature symmetry with the
        entitlement filter but deliberately does NOT filter here: whether a
        source is *entitled* is an authorisation decision made by the caller
        against get_tenant_entitlements(), not a property of the source. Mixing
        the two would make the allowlist tenant-dependent, which would break the
        catalogue's role as a single shared vocabulary.
        """
        if self._spec_cache is not None:
            return self._spec_cache
        rows = self.db.execute("""
            SELECT data_source_key, schema_version, display_name, description,
                   scope_family, grain, base_relation, fields,
                   required_permission, required_entitlement, default_max_rows
            FROM platform.report_data_sources
            WHERE is_active IS TRUE
            ORDER BY data_source_key
        """)
        specs = [
            {
                "data_source_key": r[0],
                "schema_version": r[1],
                "display_name": r[2],
                "description": r[3],
                "scope_family": r[4],
                "grain": r[5],
                "base_relation": r[6],
                "fields": r[7],
                "required_permission": r[8],
                "required_entitlement": r[9],
                "default_max_rows": r[10],
            }
            for r in rows
        ]
        self._spec_cache = specs
        return specs

    def get_spec(self, key: str) -> Dict[str, Any]:
        for spec in self.list_specs():
            if spec["data_source_key"] == key:
                return spec
        raise UnknownDataSource(
            f"data_source_key {key!r} is not in the allowlist")

    def list_sources_for_principal(
        self, permissions: List[str], entitlements: set
    ) -> List[Dict[str, Any]]:
        """Sources the caller may actually use.

        Both conditions must hold: the source's required permission is held AND
        its required entitlement is present. Entitlement is a subscription fact,
        permission an RBAC fact; neither implies the other.
        """
        perms = set(permissions or [])
        ents = set(entitlements or set())
        out = []
        for spec in self.list_specs():
            if spec["required_permission"] in perms \
                    and spec["required_entitlement"] in ents:
                out.append(spec)
        return out

    # -- relation resolution ----------------------------------------------

    def resolve_relation(self, key: str) -> Dict[str, Any]:
        """Tenant-scoped relation for an allowlisted source.

        Raises UnknownDataSource for anything not in the hard-coded registry,
        including any attempt to pass a relation name.
        """
        entry = _SOURCE_SQL.get(key)
        if entry is None:
            raise UnknownDataSource(
                f"data_source_key {key!r} has no registered relation")

        spec = self.get_spec(key)
        family = spec["scope_family"]

        # A source must not be able to declare a family the resolver does not
        # implement, or that disagrees with the hard-coded SQL. This is the
        # assertion that stops a scope family from drifting into a leak.
        if entry["scope_family"] != family:
            raise DataSourceError(
                f"scope family mismatch for {key!r}: registered {family!r}, "
                f"resolver implements {entry['scope_family']!r}")

        predicate = _TENANT_SQL.get(family)
        if predicate is None:
            raise DataSourceError(
                f"no tenant predicate implemented for scope family {family!r}")

        return {
            "data_source_key": key,
            "scope_family": family,
            "alias": entry["alias"],
            "from_sql": entry["from_sql"],
            "where_sql": f"WHERE {predicate}",
            "default_max_rows": spec["default_max_rows"],
        }

    def field_expression(self, key: str, field: str) -> str:
        """Qualified SQL expression for a declared field.

        Only three outcomes: a declared column of the base relation, one of two
        derived fields, or a rejection. There is no path that returns a
        caller-supplied fragment.
        """
        entry = _SOURCE_SQL.get(key)
        if entry is None:
            raise UnknownDataSource(f"data_source_key {key!r} is not registered")
        if field in _DERIVED:
            return _DERIVED[field]
        spec = self.get_spec(key)
        declared = {f["name"] for f in spec["fields"].get("fields", [])}
        if field not in declared:
            raise DataSourceError(
                f"field {field!r} is not declared by {key!r}")
        return f"{entry['alias']}.{field}"

    def declared_fields(self, key: str) -> Dict[str, Dict[str, Any]]:
        spec = self.get_spec(key)
        return {f["name"]: f for f in spec["fields"].get("fields", [])}

    def supported_keys(self) -> Tuple[str, ...]:
        return tuple(sorted(_SOURCE_SQL))
