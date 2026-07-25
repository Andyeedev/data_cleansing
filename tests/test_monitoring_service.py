from unittest.mock import patch, MagicMock
from app.services.monitoring_service import MonitoringService


class TestMonitoringService:

    @patch('app.services.monitoring_service.MonitoringRepository')
    def test_get_system_health(self, MockRepo):
        service = MonitoringService()
        with patch('app.db.connection.get_db_connection') as mock_db:
            mock_db.return_value.execute.return_value = [1]
            result = service.get_system_health()
            assert result["database"] is True
            assert result["api"] is True

    @patch('app.services.monitoring_service.MonitoringRepository')
    def test_get_performance_metrics(self, MockRepo):
        mock_repo = MockRepo.return_value
        mock_repo.get_execution_stats.return_value = (10, 2, 7, 1)
        service = MonitoringService()
        result = service.get_performance_metrics()
        assert result["total_executions"] == 10
        assert result["active_executions"] == 2
        assert result["completed_executions"] == 7
        assert result["failed_executions"] == 1

    @patch('app.services.monitoring_service.MonitoringRepository')
    def test_get_queue_status(self, MockRepo):
        mock_repo = MockRepo.return_value
        mock_repo.get_queue_items.return_value = [
            ("batch-1", "proj-1", "RUNNING", "2024-01-01"),
            ("batch-2", "proj-2", "PENDING", "2024-01-01"),
        ]
        service = MonitoringService()
        result = service.get_queue_status()
        assert result["total_items"] == 2
        assert result["running"] == 1
        assert result["pending"] == 1

    def test_get_alerts_returns_empty(self):
        service = MonitoringService()
        result = service.get_alerts()
        assert result["total"] == 0
        assert result["alerts"] == []

    def test_get_operational_logs_returns_empty(self):
        service = MonitoringService()
        result = service.get_operational_logs()
        assert result["total"] == 0
        assert result["logs"] == []
