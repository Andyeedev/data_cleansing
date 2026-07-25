import pytest
from unittest.mock import Mock, patch
from app.services.validation_report_service import ValidationReportService


class TestValidationReportService:

    def setup_method(self):
        self.service = ValidationReportService()

    @patch('app.services.validation_report_service.ScoringEngine')
    @patch('app.services.validation_report_service.get_db_connection')
    @patch('app.services.validation_report_service.ValidationReportRepository')
    def test_get_validation_report_returns_report(self, mock_repo_class, mock_db, mock_scoring_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_info.return_value = ('batch-1', 'proj-1', 'COMPLETED', 85.5, '2026-01-01', '2026-01-02')
        mock_repo.get_control_summaries.return_value = [
            ('C01', 'PASS', 10, 9, 1, 0)
        ]

        mock_scoring = Mock()
        mock_scoring_class.return_value = mock_scoring
        mock_scoring.calculate_overall.return_value = 85.5

        service = ValidationReportService()
        result = service.get_validation_report('batch-1')

        assert result is not None
        assert result['batch_id'] == 'batch-1'
        assert result['overall_status'] == 'COMPLETED'
        assert result['overall_score'] == 85.5
        assert len(result['control_summaries']) == 1

    @patch('app.services.validation_report_service.ValidationReportRepository')
    def test_get_validation_report_returns_none_when_not_found(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_info.return_value = None

        service = ValidationReportService()
        result = service.get_validation_report('nonexistent')

        assert result is None

    @patch('app.services.validation_report_service.ValidationReportRepository')
    def test_get_governance_decision_returns_dict(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_governance_decision.return_value = (
            'batch-1', 'proj-1', 'APPROVED', 'C01', 2, '2026-01-01'
        )

        service = ValidationReportService()
        result = service.get_governance_decision('batch-1')

        assert result is not None
        assert result['batch_id'] == 'batch-1'
        assert result['migration_status'] == 'APPROVED'

    @patch('app.services.validation_report_service.ValidationReportRepository')
    def test_get_governance_decision_returns_none_when_not_found(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_governance_decision.return_value = None

        service = ValidationReportService()
        result = service.get_governance_decision('nonexistent')

        assert result is None

    @patch('app.services.validation_report_service.ScoringEngine')
    @patch('app.services.validation_report_service.get_db_connection')
    @patch('app.services.validation_report_service.ValidationReportRepository')
    def test_get_risk_score_returns_from_db(self, mock_repo_class, mock_db, mock_scoring_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_risk_score.return_value = ('batch-1', 75.0, 'MEDIUM', '2026-01-01')

        service = ValidationReportService()
        result = service.get_risk_score('batch-1')

        assert result is not None
        assert result['risk_score'] == 75.0
        assert result['risk_level'] == 'MEDIUM'

    @patch('app.services.validation_report_service.ScoringEngine')
    @patch('app.services.validation_report_service.get_db_connection')
    @patch('app.services.validation_report_service.ValidationReportRepository')
    def test_get_risk_score_calculates_when_not_in_db(self, mock_repo_class, mock_db, mock_scoring_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_risk_score.return_value = None

        mock_scoring = Mock()
        mock_scoring_class.return_value = mock_scoring
        mock_scoring.calculate_overall.return_value = 45.0

        service = ValidationReportService()
        result = service.get_risk_score('batch-1')

        assert result is not None
        assert result['risk_score'] == 45.0
        assert result['risk_level'] == 'HIGH'

    @patch('app.services.validation_report_service.ValidationReportRepository')
    def test_get_compliance_checks_returns_exceptions(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_exceptions.return_value = [
            ('exc-1', 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', '100', '99', 1.0, 'Count mismatch', 'MEDIUM', '2026-01-01'),
            ('exc-2', 'batch-1', 'C02', 'C02_BALANCE', 'balances', '1000', '950', 50.0, 'Balance mismatch', 'HIGH', '2026-01-01')
        ]

        service = ValidationReportService()
        result = service.get_compliance_checks('batch-1')

        assert result['batch_id'] == 'batch-1'
        assert result['total_exceptions'] == 2
        assert result['high_exceptions'] == 1
        assert result['medium_exceptions'] == 1
        assert len(result['exceptions']) == 2

    @patch('app.services.validation_report_service.ValidationReportRepository')
    def test_get_compliance_checks_returns_empty_when_no_exceptions(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_exceptions.return_value = []

        service = ValidationReportService()
        result = service.get_compliance_checks('batch-1')

        assert result['total_exceptions'] == 0
        assert len(result['exceptions']) == 0
