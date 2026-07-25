import pytest
from unittest.mock import Mock, patch
from app.repositories.validation_report_repository import ValidationReportRepository


class TestValidationReportRepository:

    @patch('app.repositories.validation_report_repository.get_db_connection')
    def test_get_batch_info_returns_row(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('batch-1', 'proj-1', 'COMPLETED', 85.5, '2026-01-01', '2026-01-02')
        ]

        repo = ValidationReportRepository()
        result = repo.get_batch_info('batch-1')

        assert result is not None
        assert result[0] == 'batch-1'

    @patch('app.repositories.validation_report_repository.get_db_connection')
    def test_get_batch_info_returns_none_when_not_found(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = []

        repo = ValidationReportRepository()
        result = repo.get_batch_info('nonexistent')

        assert result is None

    @patch('app.repositories.validation_report_repository.get_db_connection')
    def test_get_control_summaries_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('C01', 'PASS', 10, 9, 1, 0)
        ]

        repo = ValidationReportRepository()
        result = repo.get_control_summaries('batch-1')

        assert len(result) == 1
        assert result[0][0] == 'C01'

    @patch('app.repositories.validation_report_repository.get_db_connection')
    def test_get_governance_decision_returns_row(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('batch-1', 'proj-1', 'APPROVED', 'C01', 2, '2026-01-01')
        ]

        repo = ValidationReportRepository()
        result = repo.get_governance_decision('batch-1')

        assert result is not None
        assert result[2] == 'APPROVED'

    @patch('app.repositories.validation_report_repository.get_db_connection')
    def test_get_governance_decision_returns_none_when_not_found(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = []

        repo = ValidationReportRepository()
        result = repo.get_governance_decision('nonexistent')

        assert result is None

    @patch('app.repositories.validation_report_repository.get_db_connection')
    def test_get_risk_score_returns_row(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('batch-1', 75.0, 'MEDIUM', '2026-01-01')
        ]

        repo = ValidationReportRepository()
        result = repo.get_risk_score('batch-1')

        assert result is not None
        assert result[1] == 75.0

    @patch('app.repositories.validation_report_repository.get_db_connection')
    def test_get_risk_score_returns_none_when_not_found(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = []

        repo = ValidationReportRepository()
        result = repo.get_risk_score('nonexistent')

        assert result is None

    @patch('app.repositories.validation_report_repository.get_db_connection')
    def test_get_exceptions_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('exc-1', 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', '100', '99', 1.0, 'Count mismatch', 'MEDIUM', '2026-01-01')
        ]

        repo = ValidationReportRepository()
        result = repo.get_exceptions('batch-1')

        assert len(result) == 1
        assert result[0][0] == 'exc-1'

    @patch('app.repositories.validation_report_repository.get_db_connection')
    def test_get_batch_score_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('PASS', 'HIGH')
        ]

        repo = ValidationReportRepository()
        result = repo.get_batch_score('batch-1')

        assert len(result) == 1
        assert result[0][0] == 'PASS'
