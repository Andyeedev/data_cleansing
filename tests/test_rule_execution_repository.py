import pytest
from unittest.mock import Mock, patch
from app.repositories.rule_execution_repository import RuleExecutionRepository


class TestRuleExecutionRepository:

    @patch('app.repositories.rule_execution_repository.get_db_connection')
    def test_get_rules_by_batch_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            (1, 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', 'PASS', 0.0, 1.5, 'HIGH', '2026-01-01')
        ]

        repo = RuleExecutionRepository()
        result = repo.get_rules_by_batch('batch-1')

        assert len(result) == 1
        mock_conn.execute.assert_called_once()

    @patch('app.repositories.rule_execution_repository.get_db_connection')
    def test_get_rule_by_id_returns_row(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            (1, 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', 'PASS', 0.0, 1.5, 'HIGH', 'mapping-1', '2026-01-01')
        ]

        repo = RuleExecutionRepository()
        result = repo.get_rule_by_id('batch-1', 'C01_ROWCOUNT')

        assert result is not None
        assert result[3] == 'C01_ROWCOUNT'

    @patch('app.repositories.rule_execution_repository.get_db_connection')
    def test_get_rule_by_id_returns_none_when_not_found(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = []

        repo = RuleExecutionRepository()
        result = repo.get_rule_by_id('batch-1', 'nonexistent')

        assert result is None

    @patch('app.repositories.rule_execution_repository.get_db_connection')
    def test_get_rules_by_control_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            (1, 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', 'PASS', 0.0, 1.5, 'HIGH', '2026-01-01')
        ]

        repo = RuleExecutionRepository()
        result = repo.get_rules_by_control('batch-1', 'C01')

        assert len(result) == 1

    @patch('app.repositories.rule_execution_repository.get_db_connection')
    def test_get_execution_summary_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('batch-1', 'C01', 'PASS', 10, 9, 1, 0)
        ]

        repo = RuleExecutionRepository()
        result = repo.get_execution_summary('batch-1')

        assert len(result) == 1
        assert result[0][2] == 'PASS'

    @patch('app.repositories.rule_execution_repository.get_db_connection')
    def test_get_batch_status_returns_row(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('batch-1', 'proj-1', 'COMPLETED', 85.5, '2026-01-01', '2026-01-02')
        ]

        repo = RuleExecutionRepository()
        result = repo.get_batch_status('batch-1')

        assert result is not None
        assert result[0] == 'batch-1'

    @patch('app.repositories.rule_execution_repository.get_db_connection')
    def test_get_batch_status_returns_none_when_not_found(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = []

        repo = RuleExecutionRepository()
        result = repo.get_batch_status('nonexistent')

        assert result is None
