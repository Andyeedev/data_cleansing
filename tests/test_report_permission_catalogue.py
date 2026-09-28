"""OC-REPORT-001 Phase 0.3 — permission catalogue pinning.

Two jobs:

1. Pin the exact permission catalogue the repository seeds (44 base + 8 Stage A
   + reports.share = 53) and document the 5 legacy `reports`/`view` rows that
   exist only in the live database. The earlier "57 vs 54" figure in the plan was
   wrong on both numbers: the base seed has 44 rows, not 46, so the seeded total
   is 52 and the live delta is 5, not 3.

2. Assert the V1 rules: `reports.share` exists, `reports:view` was NOT added, and
   `reports:schedule` does NOT exist (scheduling is V2 — the permission must not
   be seeded ahead of the feature).

Also guards against the seed files drifting from each other, which is how the
invitation/Stage-A rows were previously miscounted.
"""
import os
import re

import pytest

MIGRATIONS_DIR = os.path.join(
    "engineering", "MAP_V3", "02_Output", "00_MAP_V3_Control", "migrations")
BASE_SEED = os.path.join(
    "MAP_V2", "03_Source", "database", "seed_platform_data.sql")
STAGE_A_SEED = os.path.join(MIGRATIONS_DIR, "OC-E2E-003_STAGE_A_rbac_seed.sql")
PERM_MIGRATION = os.path.join(
    MIGRATIONS_DIR, "OC-REPORT-001_phase0_permission_reconciliation.sql")

# resource='reports', action='view' rows that exist ONLY in the live database.
# Retained deliberately — see the migration header for the full classification.
LEGACY_REPORTS_VIEW_ROWS = {
    "reports.audit.view",
    "reports.governance.view",
    "reports.migration.view",
    "reports.operational.view",
    "reports.validation.view",
}

BASE_PERMISSION_COUNT = 44
STAGE_A_PERMISSION_COUNT = 8
LIVE_PERMISSION_COUNT_BEFORE = 57


def _base_seed_permissions():
    source = open(BASE_SEED, "r", encoding="utf-8").read()
    return set(re.findall(
        r"\(\s*'([a-z_]+\.[a-z_]+)'\s*,\s*'[a-z_]+'\s*,\s*'[a-z_]+'\s*,\s*TRUE\s*\)",
        source))


def _stage_a_permissions():
    source = open(STAGE_A_SEED, "r", encoding="utf-8").read()
    return set(re.findall(
        r"gen_random_uuid\(\),\s*'([a-z_]+\.[a-z_]+)'\s*,\s*'[a-z_]+'\s*,\s*'[a-z_]+'",
        source))


@pytest.fixture(scope="module")
def seeded():
    return _base_seed_permissions() | _stage_a_permissions()


class TestSeedArithmetic:
    """Pins the counts so the delta can never be misreported again."""

    def test_base_seed_count(self):
        assert len(_base_seed_permissions()) == BASE_PERMISSION_COUNT, (
            "base seed permission count changed — re-derive the live-vs-seed delta"
        )

    def test_stage_a_count(self):
        assert len(_stage_a_permissions()) == STAGE_A_PERMISSION_COUNT

    def test_no_overlap_between_seed_files(self, seeded):
        overlap = _base_seed_permissions() & _stage_a_permissions()
        assert not overlap, f"seed files overlap: {sorted(overlap)}"

    def test_seeded_total(self, seeded):
        assert len(seeded) == BASE_PERMISSION_COUNT + STAGE_A_PERMISSION_COUNT == 52

    def test_live_delta_is_five(self, seeded):
        """57 live - 52 seeded = the 5 legacy reports/* view rows."""
        assert LIVE_PERMISSION_COUNT_BEFORE - len(seeded) == len(
            LEGACY_REPORTS_VIEW_ROWS) == 5


class TestBaseSeedIntegrity:
    def test_base_seed_has_no_view_actions(self):
        """Proves the legacy *view rows are not repository-seeded."""
        assert not [n for n in _base_seed_permissions() if n.endswith(".view")]

    def test_base_seed_reports_resource_is_exactly_five(self):
        reports = {n for n in _base_seed_permissions() if n.startswith("reports.")}
        assert reports == {
            "reports.create", "reports.read", "reports.update",
            "reports.delete", "reports.export",
        }

    def test_legacy_rows_are_absent_from_all_seed_files(self, seeded):
        assert not (seeded & LEGACY_REPORTS_VIEW_ROWS), (
            "a reports/* view row appeared in a seed file — re-run the "
            "residue classification in the permission migration"
        )


class TestStageAIntegrity:
    def test_stage_a_adds_the_documented_set(self):
        assert _stage_a_permissions() == {
            "systems.list", "systems.test", "roles.assign",
            "invitations.read", "invitations.create", "invitations.update",
            "invitations.revoke", "invitations.resend",
        }

    def test_stage_a_does_not_touch_reports(self):
        assert not [n for n in _stage_a_permissions() if n.startswith("reports.")]


class TestPermissionMigration:
    def test_migration_exists(self):
        assert os.path.exists(PERM_MIGRATION)

    def test_adds_only_reports_share(self):
        source = open(PERM_MIGRATION, "r", encoding="utf-8").read()
        inserted = re.findall(
            r"gen_random_uuid\(\),\s*'([a-z_]+\.[a-z_]+)'", source)
        assert inserted == ["reports.share"], (
            f"only reports.share may be inserted, found {inserted}"
        )

    def test_does_not_seed_reports_schedule(self):
        """Only the INSERT statements matter. The migration legitimately
        *mentions* reports.schedule in a post-condition guard that asserts its
        absence, so the whole file cannot be string-matched."""
        source = open(PERM_MIGRATION, "r", encoding="utf-8").read()
        inserts = re.findall(
            r"INSERT\s+INTO\s+platform\.permissions.*?;",
            source, re.DOTALL | re.IGNORECASE)
        assert inserts, "expected a permissions INSERT"
        for stmt in inserts:
            assert "schedule" not in stmt, (
                "reports:schedule must not be seeded in V1 (scheduling is V2)"
            )
        # and it is positively asserted absent at the DB level
        assert "action='schedule'" in source

    def test_documents_the_residue_classification(self):
        source = open(PERM_MIGRATION, "r", encoding="utf-8").read()
        for row in LEGACY_REPORTS_VIEW_ROWS:
            assert row in source, f"migration must classify {row}"
        assert "RETAINED" in source

    def test_has_post_condition_guards(self):
        source = open(PERM_MIGRATION, "r", encoding="utf-8").read()
        assert source.count("RAISE EXCEPTION") >= 4
        assert "BEGIN;" in source and "COMMIT;" in source


class TestV1CapabilityRules:
    def test_reports_share_is_the_only_new_capability(self):
        source = open(PERM_MIGRATION, "r", encoding="utf-8").read()
        assert "reports.share" in source
        assert "reports:view" in source  # mentioned as prohibited, not added

    def test_share_granted_to_super_and_tenant_admin_only(self):
        source = open(PERM_MIGRATION, "r", encoding="utf-8").read()
        assert "r.name IN ('Super Admin', 'Tenant Admin')" in source
