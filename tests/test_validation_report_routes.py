import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
from app.api.routes.validation_report_routes import router
from app.api.core.auth.dependencies import get_current_user


app = FastAPI()
app.include_router(router)

client = TestClient(app)


def override_get_current_user():
    return {"user_id": "test-user", "roles": ["Super Admin"]}


app.dependency_overrides[get_current_user] = override_get_current_user


class TestValidationReportRoutes:

    @patch('app.api.routes.validation_report_routes.validation_report_service')
    def test_get_validation_report_success(self, mock_service):
        mock_service.get_validation_report.return_value = {
            'batch_id': 'batch-1',
            'project_id': 'proj-1',
            'overall_status': 'COMPLETED',
            'overall_score': 85.5,
            'total_controls': 15,
            'completed_controls': 12,
            'failed_controls': 3,
            'control_summaries': [
                {
                    'control_id': 'C01',
                    'overall_status': 'PASS',
                    'total_rules': 10,
                    'passed_rules': 9,
                    'failed_rules': 1,
                    'error_rules': 0
                }
            ],
            'started_at': '2026-01-01',
            'completed_at': '2026-01-02'
        }

        response = client.get('/api/v1/execution/batch-1/report')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['batch_id'] == 'batch-1'
        assert data['data']['overall_score'] == 85.5

    @patch('app.api.routes.validation_report_routes.validation_report_service')
    def test_get_validation_report_not_found(self, mock_service):
        mock_service.get_validation_report.return_value = None

        response = client.get('/api/v1/execution/nonexistent/report')

        assert response.status_code == 404

    @patch('app.api.routes.validation_report_routes.validation_report_service')
    def test_get_governance_decision_success(self, mock_service):
        mock_service.get_governance_decision.return_value = {
            'batch_id': 'batch-1',
            'project_id': 'proj-1',
            'migration_status': 'APPROVED',
            'blocking_controls': 'C01',
            'total_failed_rules': 2,
            'decision_time': '2026-01-01'
        }

        response = client.get('/api/v1/execution/batch-1/governance')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['migration_status'] == 'APPROVED'

    @patch('app.api.routes.validation_report_routes.validation_report_service')
    def test_get_governance_decision_not_found(self, mock_service):
        mock_service.get_governance_decision.return_value = None

        response = client.get('/api/v1/execution/nonexistent/governance')

        assert response.status_code == 404

    @patch('app.api.routes.validation_report_routes.validation_report_service')
    def test_get_risk_score_success(self, mock_service):
        mock_service.get_risk_score.return_value = {
            'batch_id': 'batch-1',
            'risk_score': 75.0,
            'risk_level': 'MEDIUM',
            'calculated_at': '2026-01-01'
        }

        response = client.get('/api/v1/execution/batch-1/risk-score')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['risk_score'] == 75.0
        assert data['data']['risk_level'] == 'MEDIUM'

    @patch('app.api.routes.validation_report_routes.validation_report_service')
    def test_get_compliance_checks_success(self, mock_service):
        mock_service.get_compliance_checks.return_value = {
            'batch_id': 'batch-1',
            'total_exceptions': 2,
            'critical_exceptions': 0,
            'high_exceptions': 1,
            'medium_exceptions': 1,
            'low_exceptions': 0,
            'exceptions': [
                {
                    'exception_id': 'exc-1',
                    'batch_id': 'batch-1',
                    'control_id': 'C01',
                    'rule_id': 'C01_ROWCOUNT',
                    'entity_name': 'accounts',
                    'source_value': '100',
                    'target_value': '99',
                    'delta_value': 1.0,
                    'cause': 'Count mismatch',
                    'failure_scope': 'MEDIUM',
                    'created_at': '2026-01-01'
                }
            ]
        }

        response = client.get('/api/v1/execution/batch-1/compliance')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['total_exceptions'] == 2
        assert len(data['data']['exceptions']) == 1

    @patch('app.api.routes.validation_report_routes.validation_report_service')
    def test_get_compliance_checks_empty(self, mock_service):
        mock_service.get_compliance_checks.return_value = {
            'batch_id': 'batch-1',
            'total_exceptions': 0,
            'critical_exceptions': 0,
            'high_exceptions': 0,
            'medium_exceptions': 0,
            'low_exceptions': 0,
            'exceptions': []
        }

        response = client.get('/api/v1/execution/batch-1/compliance')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['total_exceptions'] == 0
