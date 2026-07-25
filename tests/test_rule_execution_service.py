import pytest
from unittest.mock import Mock, patch
from app.services.rule_execution_service import RuleExecutionService


class TestRuleExecutionService:

    def setup_method(self):
        self.service = RuleExecutionService()

    @patch('app.services.rule_execution_service.RuleExecutionRepository')
    def test_get_rules_by_batch_returns_list(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_rules_by_batch.return_value = [
            (1, 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', 'PASS', 0.0, 1.5, 'HIGH', '2026-01-01')
        ]

        service = RuleExecutionService()
        result = service.get_rules_by_batch('batch-1')

        assert isinstance(result, list)
        assert len(result) == 1
        assert result[0]['rule_id'] == 'C01_ROWCOUNT'
        assert result[0]['execution_status'] == 'PASS'

    @patch('app.services.rule_execution_service.RuleExecutionRepository')
    def test_get_rule_detail_returns_dict(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_rule_by_id.return_value = (
            1, 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', 'PASS', 0.0, 1.5, 'HIGH', 'mapping-1', '2026-01-01'
        )

        service = RuleExecutionService()
        result = service.get_rule_detail('batch-1', 'C01_ROWCOUNT')

        assert result is not None
        assert result['rule_id'] == 'C01_ROWCOUNT'
        assert result['mapping_id'] == 'mapping-1'

    @patch('app.services.rule_execution_service.RuleExecutionRepository')
    def test_get_rule_detail_returns_none_when_not_found(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_rule_by_id.return_value = None

        service = RuleExecutionService()
        result = service.get_rule_detail('batch-1', 'nonexistent')

        assert result is None

    @patch('app.services.rule_execution_service.RuleExecutionRepository')
    def test_get_rules_by_control_returns_list(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_rules_by_control.return_value = [
            (1, 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', 'PASS', 0.0, 1.5, 'HIGH', '2026-01-01')
        ]

        service = RuleExecutionService()
        result = service.get_rules_by_control('batch-1', 'C01')

        assert isinstance(result, list)
        assert len(result) == 1

    @patch('app.services.rule_execution_service.RuleExecutionRepository')
    def test_get_execution_results_returns_summary(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_status.return_value = ('batch-1', 'proj-1', 'COMPLETED', 85.5, '2026-01-01', '2026-01-02')
        mock_repo.get_execution_summary.return_value = [
            ('batch-1', 'C01', 'PASS', 10, 9, 1, 0),
            ('batch-1', 'C02', 'FAIL', 5, 3, 2, 0)
        ]
        mock_repo.get_rules_by_batch.return_value = []

        service = RuleExecutionService()
        result = service.get_execution_results('batch-1')

        assert result['batch_id'] == 'batch-1'
        assert result['total_rules'] == 15
        assert result['passed_rules'] == 12
        assert result['failed_rules'] == 3
        assert result['overall_status'] == 'COMPLETED'
        assert len(result['controls']) == 2

    @patch('app.services.rule_execution_service.RuleExecutionRepository')
    def test_get_execution_results_handles_none_values(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_status.return_value = None
        mock_repo.get_execution_summary.return_value = []
        mock_repo.get_rules_by_batch.return_value = []

        service = RuleExecutionService()
        result = service.get_execution_results('batch-1')

        assert result['batch_id'] == 'batch-1'
        assert result['total_rules'] == 0
        assert result['overall_status'] == 'UNKNOWN'
