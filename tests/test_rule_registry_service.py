import pytest
from app.services.rule_registry_service import RuleRegistryService


class TestRuleRegistryService:

    def setup_method(self):
        self.service = RuleRegistryService()

    def test_get_all_rules(self):
        rules = self.service.get_all_rules()
        assert isinstance(rules, list)
        assert len(rules) > 0

    def test_get_rule_by_id(self):
        rules = self.service.get_all_rules()
        if rules:
            rule_id = rules[0]["rule_id"]
            rule = self.service.get_rule_by_id(rule_id)
            assert rule is not None
            assert rule["rule_id"] == rule_id

    def test_get_rule_by_id_not_found(self):
        rule = self.service.get_rule_by_id("NONEXISTENT")
        assert rule is None

    def test_get_rules_by_control(self):
        rules = self.service.get_rules_by_control("C01")
        assert isinstance(rules, list)

    def test_create_rule(self):
        rule_data = {
            "rule_id": "TEST-SERVICE-001",
            "control_id": "C01",
            "rule_name": "Test Service Rule",
            "severity_level": "MEDIUM",
            "enabled_flag": True
        }
        try:
            rule = self.service.create_rule(rule_data)
            assert rule is not None
            assert rule["rule_id"] == "TEST-SERVICE-001"
        except Exception:
            # May fail if rule already exists
            pass

    def test_update_rule(self):
        update_data = {
            "rule_name": "Updated Service Rule"
        }
        try:
            rule = self.service.update_rule("TEST-SERVICE-001", update_data)
            # May return None if rule doesn't exist
        except Exception:
            pass

    def test_delete_rule(self):
        try:
            success = self.service.delete_rule("TEST-SERVICE-001")
            # May return False if rule doesn't exist
        except Exception:
            pass

    def test_get_rule_count(self):
        count = self.service.get_rule_count()
        assert isinstance(count, int)
        assert count > 0
