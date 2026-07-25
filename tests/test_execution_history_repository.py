import pytest
from unittest.mock import Mock, patch
from app.repositories.execution_history_repository import ExecutionHistoryRepository


class TestExecutionHistoryRepository:

    @patch('app.repositories.execution_history_repository.get_db_connection')
    def test_get_execution_history_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.side_effect = [
            [('batch-1', 'proj-1', 'COMPLETED', 10, 8, 2, '2026-01-01', '2026-01-02')],
            [(1,)]
        ]

        repo = ExecutionHistoryRepository()
        rows, total = repo.get_execution_history(page=1, page_size=20)

        assert len(rows) == 1
        assert total == 1

    @patch('app.repositories.execution_history_repository.get_db_connection')
    def test_get_execution_detail_returns_row(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('batch-1', 'proj-1', 'COMPLETED', 10, 8, 2, '2026-01-01', '2026-01-02')
        ]

        repo = ExecutionHistoryRepository()
        result = repo.get_execution_detail('batch-1')

        assert result is not None
        assert result[0] == 'batch-1'

    @patch('app.repositories.execution_history_repository.get_db_connection')
    def test_get_execution_detail_returns_none_when_not_found(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = []

        repo = ExecutionHistoryRepository()
        result = repo.get_execution_detail('nonexistent')

        assert result is None

    @patch('app.repositories.execution_history_repository.get_db_connection')
    def test_get_control_summaries_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('C01', 'PASS', 10, 9, 1, 0)
        ]

        repo = ExecutionHistoryRepository()
        result = repo.get_control_summaries('batch-1')

        assert len(result) == 1
        assert result[0][0] == 'C01'

    @patch('app.repositories.execution_history_repository.get_db_connection')
    def test_get_control_executions_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            (1, 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', 'PASS', 0.0, 1.5, 'HIGH', '2026-01-01')
        ]

        repo = ExecutionHistoryRepository()
        result = repo.get_control_executions('batch-1')

        assert len(result) == 1
        assert result[0][3] == 'C01_ROWCOUNT'

    @patch('app.repositories.execution_history_repository.get_db_connection')
    def test_get_exceptions_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('exc-1', 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', '100', '99', 1.0, 'Count mismatch', 'MEDIUM', '2026-01-01')
        ]

        repo = ExecutionHistoryRepository()
        result = repo.get_exceptions('batch-1')

        assert len(result) == 1
        assert result[0][0] == 'exc-1'

    @patch('app.repositories.execution_history_repository.get_db_connection')
    def test_get_governance_returns_row(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('batch-1', 'proj-1', 'APPROVED', 'C01', 2, '2026-01-01')
        ]

        repo = ExecutionHistoryRepository()
        result = repo.get_governance('batch-1')

        assert result is not None
        assert result[2] == 'APPROVED'

    @patch('app.repositories.execution_history_repository.get_db_connection')
    def test_get_governance_returns_none_when_not_found(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = []

        repo = ExecutionHistoryRepository()
        result = repo.get_governance('nonexistent')

        assert result is None

    @patch('app.repositories.execution_history_repository.get_db_connection')
    def test_get_project_id_for_batch_returns_id(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('proj-1',)
        ]

        repo = ExecutionHistoryRepository()
        result = repo.get_project_id_for_batch('batch-1')

        assert result == 'proj-1'

    @patch('app.repositories.execution_history_repository.get_db_connection')
    def test_get_project_id_for_batch_returns_none_when_not_found(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = []

        repo = ExecutionHistoryRepository()
        result = repo.get_project_id_for_batch('nonexistent')

        assert result is None
