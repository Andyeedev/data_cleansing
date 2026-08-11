import pytest
from app.services.rule_discovery_service import RuleDiscoveryService


class TestRuleDiscoveryService:

    def setup_method(self):
        self.service = RuleDiscoveryService()

    def test_get_discovery_mappings(self):
        data = self.service.get_discovery_mappings("test-project-1")
        assert isinstance(data, dict)
        assert data["project_id"] == "test-project-1"
        assert "mappings" in data

    def test_get_discovery_status(self):
        status = self.service.get_discovery_status("test-project-1")
        assert isinstance(status, dict)
        assert status["project_id"] == "test-project-1"
        assert "total_mappings" in status
        assert "rules_discovered" in status

    def test_get_discovered_rules(self):
        data = self.service.get_discovered_rules("test-project-1")
        assert isinstance(data, dict)
        assert data["project_id"] == "test-project-1"
        assert "rules" in data
        assert "count" in data
