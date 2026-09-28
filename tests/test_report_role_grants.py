"""OC-REPORT-001 Phase 0.4 — report role grant matrix.

Pins the exact reports-resource grant matrix so it cannot drift silently, and
asserts the properties that matter for security:

  * Viewer and Team Member are strictly read-only. Team Member is the seeded
    DEFAULT role (is_default = TRUE), which makes it the highest-reach grant in
    the product, so read-only must be a hard ceiling.
  * `reports:delete` is granted to exactly Migration Lead and Data Analyst
    (decision D) and to nobody else among the non-admin roles. Super Admin and
    Tenant Admin already hold it from the base seed.
  * The delete grant is documented as a NECESSARY but NOT SUFFICIENT condition:
    the ownership contract that must be enforced in the report-definition
    service is asserted to be recorded, so it cannot be silently dropped.
  * No role gains a permission outside the `reports` resource from this work.
  * The five legacy `reports`/* view residue rows are named explicitly and
    asserted to be retained, not silently extended.
"""
import os
import re

import pytest

MIGRATIONS_DIR = os.path.join(
    "engineering", "MAP_V3", "02_Output", "00_MAP_V3_Control", "migrations")
ROLE_MIGRATION = os.path.join(MIGRATIONS_DIR, "OC-REPORT-001_phase0_role_grants.sql")

# The approved matrix, mirrored from the migration. Kept literal so a change to
# the SQL is a deliberate, visible edit here too.
EXPECTED_MATRIX = {
    "Migration Lead": {"read", "create", "update", "delete", "export"},
    "Data Analyst":   {"read", "create", "update", "delete", "export", "share"},
    "Team Member":    {"read"},
    "Viewer":         {"read"},
}

# Non-admin roles that must hold reports:delete (decision D).
DELETE_GRANT_ROLES = {"Migration Lead", "Data Analyst"}

# Pre-existing database state that this migration must neither add to nor delete.
LEGACY_RESIDUE = {
    "reports.audit.view",
    "reports.governance.view",
    "reports.migration.view",
    "reports.operational.view",
    "reports.validation.view",
}

READ_ONLY_ROLES = {"Viewer", "Team Member"}
NON_ADMIN_ROLES = set(EXPECTED_MATRIX)


@pytest.fixture(scope="module")
def migration_sql():
    return open(ROLE_MIGRATION, "r", encoding="utf-8").read()


def _granted_tuples(sql):
    """Extract (role, resource, action) from the VALUES list."""
    body = sql[sql.index("JOIN (VALUES"):sql.index(") AS g(role_name")]
    return set(re.findall(
        r"\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*\)", body))


class TestMigrationScope:
    def test_migration_exists(self):
        assert os.path.exists(ROLE_MIGRATION)

    def test_touches_reports_resource_only(self, migration_sql):
        """No silent scope expansion: this migration must not grant anything
        outside the reports resource."""
        resources = {r for _, r, _ in _granted_tuples(migration_sql)}
        assert resources == {"reports"}, (
            f"expected only the reports resource, found {resources}"
        )

    def test_no_schedule_permission_granted(self, migration_sql):
        actions = {a for _, _, a in _granted_tuples(migration_sql)}
        assert "schedule" not in actions

    def test_has_post_condition_guards(self, migration_sql):
        assert migration_sql.count("RAISE EXCEPTION") >= 5
        assert "BEGIN;" in migration_sql and "COMMIT;" in migration_sql


class TestMatrixContents:
    def test_granted_tuples_match_expected_matrix(self, migration_sql):
        actual = {(role, action) for role, resource, action
                  in _granted_tuples(migration_sql)}
        expected = {(role, action)
                    for role, actions in EXPECTED_MATRIX.items()
                    for action in actions}
        assert actual == expected, (
            f"missing={sorted(expected - actual)} extra={sorted(actual - expected)}"
        )

    def test_migration_documents_every_reconciled_role(self, migration_sql):
        for role in ("Migration Lead", "Data Analyst", "Team Member", "Viewer"):
            assert role in migration_sql


class TestDeleteGrantDecisionD:
    """reports:delete was deliberately withheld, then approved for exactly two
    roles. Both halves are asserted so it cannot drift either way."""

    def test_delete_granted_to_exactly_two_roles(self, migration_sql):
        delete_roles = {
            role for role, _, action in _granted_tuples(migration_sql)
            if action == "delete"
        }
        assert delete_roles == DELETE_GRANT_ROLES, (
            f"reports:delete must be granted to exactly {sorted(DELETE_GRANT_ROLES)}, "
            f"found {sorted(delete_roles)}"
        )

    def test_delete_withheld_from_read_only_roles(self, migration_sql):
        delete_roles = {
            role for role, _, action in _granted_tuples(migration_sql)
            if action == "delete"
        }
        assert not (delete_roles & READ_ONLY_ROLES), (
            "Viewer and Team Member must never receive reports:delete"
        )

    def test_sql_guard_refuses_delete_for_read_only_roles(self, migration_sql):
        assert "reports:delete must never be granted to Viewer or Team Member" \
            in migration_sql

    def test_sql_guard_requires_delete_for_both_approved_roles(self, migration_sql):
        assert "Migration Lead must hold reports:delete (approved)" in migration_sql
        assert "Data Analyst must hold reports:delete (approved)" in migration_sql

    def test_ownership_contract_is_recorded(self, migration_sql):
        """The permission is necessary but NOT sufficient. The service-layer
        ownership enforcement must be stated in the migration, because the grant
        becomes a privilege-escalation path if the service authorises a delete
        on the permission alone."""
        for phrase in (
            "OWNERSHIP / OBJECT ACCESS",
            "TENANT SCOPE",
            "ENTITLEMENT AND DATASOURCE AUTHORISATION",
            "necessary, not a sufficient",
        ):
            assert phrase in migration_sql, (
                f"ownership contract must document '{phrase}'"
            )

    def test_delete_any_restricted_to_admins(self, migration_sql):
        assert "delete-any capability" in migration_sql
        assert "Super Admin and Tenant Admin" in migration_sql


class TestSecurityProperties:
    def test_read_only_ceiling_is_asserted_in_sql(self):
        """The SQL guard must enforce the ceiling, not just the Python mirror."""
        sql = open(ROLE_MIGRATION, "r", encoding="utf-8").read()
        assert "'Viewer','Team Member'" in sql
        assert "must hold reports:read only" in sql

    def test_residue_rows_named_explicitly_not_wildcarded(self, migration_sql):
        """The exclusion must be by exact permission name so a sixth residue row
        would still be caught."""
        for row in LEGACY_RESIDUE:
            assert f"('{row}')" in migration_sql, (
                f"{row} must be listed explicitly in the legacy_residue CTE"
            )
        assert "legacy_residue(permission_name) AS (VALUES" in migration_sql

    def test_entitlement_bridge_unchanged(self):
        """reports.export must remain bridged to advanced_reporting so RBAC and
        entitlement stay independent layers."""
        from app.api.core.auth.rbac import PERMISSION_ENTITLEMENT
        assert PERMISSION_ENTITLEMENT["reports.export"] == "advanced_reporting"

    def test_grant_time_entitlement_guard_still_present(self):
        """role_service must still refuse to grant a permission whose
        entitlement the granter lacks."""
        source = open("app/services/role_service.py", "r", encoding="utf-8").read()
        assert "check_entitlement" in source
        assert "PERMISSION_ENTITLEMENT" in source

