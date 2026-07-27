import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
from app.api.routes.rule_execution_routes import router
from app.api.core.auth.dependencies import get_current_user


app = FastAPI()
app.include_router(router)

client = TestClient(app)


def override_get_current_user():
    return {"user_id": "test-user", "roles": ["Super Admin"]}


app.dependency_overrides[get_current_user] = override_get_current_user


class TestRuleExecutionRoutes:

    @patch('app.api.routes.rule_execution_routes.rule_execution_service')
    def test_get_batch_rules_success(self, mock_service):
        mock_service.get_rules_by_batch.return_value = [
            {
                'id': 1,
                'batch_id': 'batch-1',
                'control_id': 'C01',
                'rule_id': 'C01_ROWCOUNT',
                'entity_name': 'accounts',
                'execution_status': 'PASS',
                'delta_value': 0.0,
                'execution_time_seconds': 1.5,
                'severity_level': 'HIGH',
                'created_at': '2026-01-01'
            }
        ]

        response = client.get('/api/v1/execution/batch-1/rules')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert len(data['data']) == 1
        assert data['data'][0]['rule_id'] == 'C01_ROWCOUNT'

    @patch('app.api.routes.rule_execution_routes.rule_execution_service')
    def test_get_batch_rules_empty(self, mock_service):
        mock_service.get_rules_by_batch.return_value = []

        response = client.get('/api/v1/execution/batch-1/rules')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert len(data['data']) == 0

    @patch('app.api.routes.rule_execution_routes.rule_execution_service')
    def test_get_rule_detail_success(self, mock_service):
        mock_service.get_rule_detail.return_value = {
            'id': 1,
            'batch_id': 'batch-1',
            'control_id': 'C01',
            'rule_id': 'C01_ROWCOUNT',
            'entity_name': 'accounts',
            'execution_status': 'PASS',
            'delta_value': 0.0,
            'execution_time_seconds': 1.5,
            'severity_level': 'HIGH',
            'mapping_id': 'mapping-1',
            'created_at': '2026-01-01'
        }

        response = client.get('/api/v1/execution/batch-1/rules/C01_ROWCOUNT')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['rule_id'] == 'C01_ROWCOUNT'

    @patch('app.api.routes.rule_execution_routes.rule_execution_service')
    def test_get_rule_detail_not_found(self, mock_service):
        mock_service.get_rule_detail.return_value = None

        response = client.get('/api/v1/execution/batch-1/rules/nonexistent')

        assert response.status_code == 404

    @patch('app.api.routes.rule_execution_routes.rule_execution_service')
    def test_get_control_rules_success(self, mock_service):
        mock_service.get_rules_by_control.return_value = [
            {
                'id': 1,
                'batch_id': 'batch-1',
                'control_id': 'C01',
                'rule_id': 'C01_ROWCOUNT',
                'entity_name': 'accounts',
                'execution_status': 'PASS',
                'delta_value': 0.0,
                'execution_time_seconds': 1.5,
                'severity_level': 'HIGH',
                'created_at': '2026-01-01'
            }
        ]

        response = client.get('/api/v1/execution/batch-1/control/C01/rules')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert len(data['data']) == 1

    @patch('app.api.routes.rule_execution_routes.rule_execution_service')
    def test_get_execution_results_success(self, mock_service):
        mock_service.get_execution_results.return_value = {
            'batch_id': 'batch-1',
            'total_rules': 15,
            'passed_rules': 12,
            'failed_rules': 3,
            'error_rules': 0,
            'overall_status': 'COMPLETED',
            'controls': [
                {
                    'control_id': 'C01',
                    'overall_status': 'PASS',
                    'total_rules': 10,
                    'passed_rules': 9,
                    'failed_rules': 1,
                    'error_rules': 0
                }
            ]
        }

        response = client.get('/api/v1/execution/batch-1/results')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['total_rules'] == 15
        assert data['data']['overall_status'] == 'COMPLETED'
