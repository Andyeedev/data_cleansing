from unittest.mock import patch, MagicMock
from app.services.governance_service import GovernanceService


class TestGovernanceService:

    @patch('app.services.governance_service.GovernanceRepository')
    def test_get_audit_log(self, MockRepo):
        mock_repo = MockRepo.return_value
        mock_repo.get_audit_entries.return_value = [
            ("1", "CREATE", "migration_batch", "batch-1", "test@test.com", "2024-01-01", {}),
        ]
        service = GovernanceService()
        result = service.get_audit_log()
        assert result["total"] == 1
        assert result["entries"][0]["action"] == "CREATE"

    @patch('app.services.governance_service.GovernanceRepository')
    def test_get_approvals(self, MockRepo):
        mock_repo = MockRepo.return_value
        mock_repo.get_pending_approvals.return_value = [
            ("1", "migration_batch", "batch-1", "PENDING", "test@test.com", "2024-01-01"),
        ]
        service = GovernanceService()
        result = service.get_approvals()
        assert result["total"] == 1
        assert result["pending"][0]["status"] == "PENDING"

    @patch('app.services.governance_service.GovernanceRepository')
    def test_get_exceptions(self, MockRepo):
        mock_repo = MockRepo.return_value
        mock_repo.get_exception_requests.return_value = []
        service = GovernanceService()
        result = service.get_exceptions()
        assert result["total"] == 0

    @patch('app.services.governance_service.GovernanceRepository')
    def test_get_compliance_status(self, MockRepo):
        mock_repo = MockRepo.return_value
        mock_repo.db.execute.return_value = [(100, 80, 20)]
        service = GovernanceService()
        result = service.get_compliance_status()
        assert result["total_controls"] == 100
        assert result["passed_controls"] == 80
        assert result["failed_controls"] == 20
        assert result["score"] == 80.0
