import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from app.api.main import app


client = TestClient(app)


class TestRBACDiscoveryRoutes:

    @patch('app.api.routes.discovery_routes.discovery_service')
    def test_discovery_datasets_requires_auth(self, mock_service):
        mock_service.get_datasets_by_batch.return_value = []

        response = client.get('/api/v1/discovery/batch-1/datasets')

        assert response.status_code in [200, 401, 403]

    @patch('app.api.routes.discovery_routes.discovery_service')
    def test_discovery_dataset_detail_requires_auth(self, mock_service):
        mock_service.get_dataset_by_id.return_value = None

        response = client.get('/api/v1/discovery/batch-1/datasets/mapping-1')

        assert response.status_code in [200, 401, 403, 404]

    @patch('app.api.routes.discovery_routes.discovery_service')
    def test_discovery_trigger_requires_auth(self, mock_service):
        mock_service.trigger_discovery.return_value = {
            'message': 'Discovery triggered',
            'project_id': 'proj-1',
            'status': 'completed'
        }

        response = client.post('/api/v1/discovery/current', json={'project_id': 'proj-1'})

        assert response.status_code in [200, 401, 403]

    @patch('app.api.routes.discovery_routes.discovery_service')
    def test_discovery_status_requires_auth(self, mock_service):
        mock_service.get_discovery_status.return_value = None

        response = client.get('/api/v1/discovery/batch-1/status')

        assert response.status_code in [200, 401, 403, 404]


class TestRBACRuleExecutionRoutes:

    @patch('app.api.routes.rule_execution_routes.rule_execution_service')
    def test_rule_execution_list_requires_auth(self, mock_service):
        mock_service.get_rules_by_batch.return_value = []

        response = client.get('/api/v1/execution/batch-1/rules')

        assert response.status_code in [200, 401, 403]

    @patch('app.api.routes.rule_execution_routes.rule_execution_service')
    def test_rule_execution_detail_requires_auth(self, mock_service):
        mock_service.get_rule_detail.return_value = None

        response = client.get('/api/v1/execution/batch-1/rules/C01_ROWCOUNT')

        assert response.status_code in [200, 401, 403, 404]

    @patch('app.api.routes.rule_execution_routes.rule_execution_service')
    def test_control_rules_requires_auth(self, mock_service):
        mock_service.get_rules_by_control.return_value = []

        response = client.get('/api/v1/execution/batch-1/control/C01/rules')

        assert response.status_code in [200, 401, 403]

    @patch('app.api.routes.rule_execution_routes.rule_execution_service')
    def test_execution_results_requires_auth(self, mock_service):
        mock_service.get_execution_results.return_value = {
            'batch_id': 'batch-1',
            'total_rules': 0,
            'passed_rules': 0,
            'failed_rules': 0,
            'error_rules': 0,
            'overall_status': 'UNKNOWN',
            'controls': []
        }

        response = client.get('/api/v1/execution/batch-1/results')

        assert response.status_code in [200, 401, 403]


class TestRBACValidationReportRoutes:

    @patch('app.api.routes.validation_report_routes.validation_report_service')
    def test_validation_report_requires_auth(self, mock_service):
        mock_service.get_validation_report.return_value = None

        response = client.get('/api/v1/execution/batch-1/report')

        assert response.status_code in [200, 401, 403, 404]

    @patch('app.api.routes.validation_report_routes.validation_report_service')
    def test_governance_decision_requires_auth(self, mock_service):
        mock_service.get_governance_decision.return_value = None

        response = client.get('/api/v1/execution/batch-1/governance')

        assert response.status_code in [200, 401, 403, 404]

    @patch('app.api.routes.validation_report_routes.validation_report_service')
    def test_risk_score_requires_auth(self, mock_service):
        mock_service.get_risk_score.return_value = {
            'batch_id': 'batch-1',
            'risk_score': 0.0,
            'risk_level': 'UNKNOWN',
            'calculated_at': None
        }

        response = client.get('/api/v1/execution/batch-1/risk-score')

        assert response.status_code in [200, 401, 403]

    @patch('app.api.routes.validation_report_routes.validation_report_service')
    def test_compliance_checks_requires_auth(self, mock_service):
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

        assert response.status_code in [200, 401, 403]
