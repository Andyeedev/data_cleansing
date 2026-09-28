"""OC-REPORT-001 Phase 0.2 — entitlement vocabulary consistency.

The entitlement vocabulary drifted between `DEFAULT_ENTITLEMENTS` (canonical,
read at runtime) and `platform.plans.entitlements` (seeded by OC-COM-001a). The
drift is not cosmetic: `get_tenant_entitlements()` returns the *subscription's*
JSONB keys when a dict is present, so a seeded tenant receives the DB vocabulary
and never the canonical one — meaning `advanced_reporting` was absent on
Enterprise tenants. That is the same failure class as the OC-E2E-001 "migration"
outage.

These tests parse the reconciliation migration and assert the DB seed is exactly
the canonical vocabulary, so the two cannot diverge silently again.
"""
import json
import os
import re

import pytest

from app.middleware.entitlement_middleware import (
    DEFAULT_ENTITLEMENTS,
    REPORT_STUDIO_ENTITLEMENT,
    REPORTING_ENTITLEMENTS,
)

MIGRATIONS_DIR = os.path.join(
    "engineering", "MAP_V3", "02_Output", "00_MAP_V3_Control", "migrations")
MIGRATION = os.path.join(
    MIGRATIONS_DIR, "OC-REPORT-001_phase0_entitlement_reconciliation.sql")

ALL_CANONICAL_KEYS = set()
for _tier_keys in DEFAULT_ENTITLEMENTS.values():
    ALL_CANONICAL_KEYS |= _tier_keys


def _parse_seeded_entitlements():
    """Extract {tier: set(keys)} from the migration's UPDATE statements.

    Each block looks like:
        SET entitlements = '{ "k": true, ... }'::jsonb
        WHERE tier = 'enterprise';
    """
    source = open(MIGRATION, "r", encoding="utf-8").read()
    pattern = re.compile(
        r"SET\s+entitlements\s*=\s*'(?P<body>\{.*?\})'::jsonb\s*"
        r"WHERE\s+tier\s*=\s*'(?P<tier>[a-z_]+)'",
        re.DOTALL,
    )
    seeded = {}
    for match in pattern.finditer(source):
        body = match.group("body")
        tier = match.group("tier")
        # the migration embeds JSON with real newlines/indentation
        parsed = json.loads(body)
        assert all(v is True for v in parsed.values()), (
            f"{tier}: entitlement values must be true (get_tenant_entitlements "
            f"reads keys only; non-true values are misleading)"
        )
        seeded[tier] = set(parsed.keys())
    return seeded


@pytest.fixture(scope="module")
def seeded():
    return _parse_seeded_entitlements()


class TestMigrationShape:
    def test_migration_exists(self):
        assert os.path.exists(MIGRATION), "reconciliation migration is missing"

    def test_all_three_tiers_are_seeded(self, seeded):
        assert set(seeded) == {"professional", "enterprise", "enterprise_plus"}

    def test_migration_is_idempotent_and_guarded(self):
        source = open(MIGRATION, "r", encoding="utf-8").read()
        assert "BEGIN;" in source and "COMMIT;" in source
        # the post-condition guard must remain, it is the DB-side safety net
        assert "RAISE EXCEPTION" in source


class TestNoVocabularyDrift:
    """The core regression: DB seed must equal the canonical vocabulary exactly."""

    @pytest.mark.parametrize("tier", ["professional", "enterprise", "enterprise_plus"])
    def test_seeded_keys_equal_canonical_keys(self, seeded, tier):
        assert seeded[tier] == DEFAULT_ENTITLEMENTS[tier], (
            f"{tier}: platform.plans.entitlements has drifted from "
            f"DEFAULT_ENTITLEMENTS. "
            f"seeded-only={sorted(seeded[tier] - DEFAULT_ENTITLEMENTS[tier])} "
            f"canonical-only={sorted(DEFAULT_ENTITLEMENTS[tier] - seeded[tier])}"
        )

    @pytest.mark.parametrize("tier", ["professional", "enterprise", "enterprise_plus"])
    def test_no_non_canonical_keys(self, seeded, tier):
        unknown = seeded[tier] - ALL_CANONICAL_KEYS
        assert not unknown, (
            f"{tier}: seed contains keys absent from DEFAULT_ENTITLEMENTS: "
            f"{sorted(unknown)}"
        )

    def test_outage_key_never_returns(self, seeded):
        for tier, keys in seeded.items():
            assert "migration" not in keys, (
                f"{tier}: 'migration' caused the OC-E2E-001 outage and is not a "
                f"canonical entitlement key"
            )

    def test_advanced_reporting_present_on_enterprise(self, seeded):
        """The DB seed previously lacked this, so Enterprise tenants paid for
        advanced reporting but could not satisfy reports:export."""
        assert "advanced_reporting" in seeded["enterprise"]
        assert "advanced_reporting" in seeded["enterprise_plus"]


class TestReportStudioEntitlement:
    def test_report_studio_is_canonical(self):
        assert REPORT_STUDIO_ENTITLEMENT in ALL_CANONICAL_KEYS

    def test_report_studio_on_enterprise_and_enterprise_plus(self):
        assert REPORT_STUDIO_ENTITLEMENT in DEFAULT_ENTITLEMENTS["enterprise"]
        assert REPORT_STUDIO_ENTITLEMENT in DEFAULT_ENTITLEMENTS["enterprise_plus"]

    def test_report_studio_not_on_professional(self):
        assert REPORT_STUDIO_ENTITLEMENT not in DEFAULT_ENTITLEMENTS["professional"]

    def test_report_studio_is_seeded_to_match(self, seeded):
        assert REPORT_STUDIO_ENTITLEMENT in seeded["enterprise"]
        assert REPORT_STUDIO_ENTITLEMENT in seeded["enterprise_plus"]
        assert REPORT_STUDIO_ENTITLEMENT not in seeded["professional"]


class TestReportingEntitlementVocabulary:
    """The brief's five capability groups must map onto EXISTING keys, plus the
    single approved new one. No further reporting keys may be invented."""

    def test_reporting_keys_are_all_canonical(self):
        for key in REPORTING_ENTITLEMENTS:
            assert key in ALL_CANONICAL_KEYS, f"{key} is not a canonical key"

    def test_existing_reporting_keys_preserved(self):
        for key in ("basic_reporting", "advanced_reporting",
                    "enterprise_reporting", "ai_insights"):
            assert key in ALL_CANONICAL_KEYS, (
                f"{key} is required by the plan and must be preserved"
            )

    def test_exactly_one_new_reporting_key_added(self):
        """Baseline reporting vocabulary before OC-REPORT-001."""
        baseline = {"basic_reporting", "advanced_reporting",
                    "enterprise_reporting", "ai_insights"}
        assert REPORTING_ENTITLEMENTS - baseline == {"report_studio"}

    def test_permission_entitlement_bridge_is_canonical(self):
        from app.api.core.auth.rbac import PERMISSION_ENTITLEMENT
        for permission, key in PERMISSION_ENTITLEMENT.items():
            assert key in ALL_CANONICAL_KEYS, (
                f"{permission} maps to non-canonical entitlement '{key}'"
            )


class TestTierMembershipPreserved:
    """The migration must add only report_studio, never silently widen or narrow
    any pre-existing tier."""

    def test_enterprise_delta_is_report_studio_only(self):
        from app.middleware import entitlement_middleware as em
        # captured pre-migration baseline from the v1 vocabulary
        baseline_enterprise = {
            "discovery", "mapping", "validation", "advanced_reporting",
            "multi_project", "api_access", "audit_trail", "governance",
            "priority_support", "pre_migration_assurance",
            "post_migration_assurance", "pre_post_migration_assurance",
            "advanced_governance", "reconciliation",
        }
        current = DEFAULT_ENTITLEMENTS["enterprise"]
        assert current - baseline_enterprise == {"report_studio"}
        assert baseline_enterprise - current == set()

    def test_enterprise_plus_delta_is_report_studio_only(self):
        baseline = {
            "discovery", "mapping", "validation", "advanced_reporting",
            "enterprise_reporting", "multi_project", "api_access",
            "audit_trail", "governance", "advanced_governance",
            "enterprise_governance", "ai_insights", "custom_integrations",
            "dedicated_support", "multi_region", "sla",
            "pre_migration_assurance", "post_migration_assurance",
            "pre_post_migration_assurance", "reconciliation",
        }
        current = DEFAULT_ENTITLEMENTS["enterprise_plus"]
        assert current - baseline == {"report_studio"}
        assert baseline - current == set()

    def test_professional_unchanged(self):
        baseline = {
            "discovery", "mapping", "validation", "basic_reporting",
            "single_project", "email_support", "post_migration_assurance",
            "core_governance", "multi_project", "api_access", "priority_support",
        }
        assert DEFAULT_ENTITLEMENTS["professional"] == baseline
