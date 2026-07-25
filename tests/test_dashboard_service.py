from unittest.mock import patch, MagicMock
from app.services.dashboard_service import DashboardService


class TestDashboardService:

    @patch('app.services.dashboard_service.DashboardRepository')
    def test_get_portfolio_summary(self, MockRepo):
        mock_repo = MockRepo.return_value
        mock_repo.get_system_count.return_value = 5
        mock_repo.get_batch_stats.return_value = (10, 2)
        mock_repo.get_total_controls.return_value = 50
        service = DashboardService()
        result = service.get_portfolio_summary()
        assert result["total_systems"] == 5
        assert result["total_batches"] == 10
        assert result["total_controls"] == 50
        assert result["active_batches"] == 2

    @patch('app.services.dashboard_service.DashboardRepository')
    def test_get_kpis(self, MockRepo):
        mock_repo = MockRepo.return_value
        mock_repo.get_batch_stats.return_value = (10, 2)
        mock_repo.get_system_count.return_value = 5
        service = DashboardService()
        result = service.get_kpis()
        assert len(result["kpis"]) == 3
        assert result["kpis"][0]["label"] == "Total Batches"

    @patch('app.services.dashboard_service.DashboardRepository')
    def test_get_activity(self, MockRepo):
        mock_repo = MockRepo.return_value
        mock_repo.get_recent_activity.return_value = [
            ("1", "CREATE", "migration_batch", "batch-1", "test@test.com", "2024-01-01"),
        ]
        service = DashboardService()
        result = service.get_activity()
        assert result["total"] == 1
        assert result["entries"][0]["action"] == "CREATE"
