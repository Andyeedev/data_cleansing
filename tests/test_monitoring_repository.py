from unittest.mock import patch, MagicMock
from app.repositories.monitoring_repository import MonitoringRepository


class TestMonitoringRepository:

    @patch('app.repositories.monitoring_repository.get_db_connection')
    def test_get_execution_stats(self, mock_db):
        mock_conn = MagicMock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [(10, 2, 7, 1)]
        repo = MonitoringRepository()
        result = repo.get_execution_stats()
        assert result == (10, 2, 7, 1)

    @patch('app.repositories.monitoring_repository.get_db_connection')
    def test_get_queue_items(self, mock_db):
        mock_conn = MagicMock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ("batch-1", "proj-1", "RUNNING", "2024-01-01"),
            ("batch-2", "proj-2", "PENDING", "2024-01-01"),
        ]
        repo = MonitoringRepository()
        result = repo.get_queue_items()
        assert len(result) == 2
        assert result[0][0] == "batch-1"

    @patch('app.repositories.monitoring_repository.get_db_connection')
    def test_get_recent_executions(self, mock_db):
        mock_conn = MagicMock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ("batch-1", "proj-1", "COMPLETED", 10, 10, 0, "2024-01-01", "2024-01-01"),
        ]
        repo = MonitoringRepository()
        result = repo.get_recent_executions()
        assert len(result) == 1
