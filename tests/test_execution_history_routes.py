import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
from app.api.routes.execution_history_routes import router
from app.api.core.auth.dependencies import get_current_user


app = FastAPI()
app.include_router(router)

client = TestClient(app)


def override_get_current_user():
    return {"user_id": "test-user", "role": "admin"}


app.dependency_overrides[get_current_user] = override_get_current_user


class TestExecutionHistoryRoutes:

    @patch('app.api.routes.execution_history_routes.execution_history_service')
    def test_get_execution_history_success(self, mock_service):
        mock_service.get_execution_history.return_value = {
            "items": [
                {
                    "batch_id": "batch-1",
                    "project_id": "proj-1",
                    "batch_status": "COMPLETED",
                    "total_controls": 10,
                    "completed_controls": 8,
                    "failed_controls": 2,
                    "batch_start_time": "2026-01-01",
                    "batch_end_time": "2026-01-02"
                }
            ],
            "total": 1,
            "page": 1,
            "page_size": 20
        }

        response = client.get('/api/v1/execution/history')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert len(data['data']['items']) == 1

    @patch('app.api.routes.execution_history_routes.execution_history_service')
    def test_get_execution_history_empty(self, mock_service):
        mock_service.get_execution_history.return_value = {
            "items": [],
            "total": 0,
            "page": 1,
            "page_size": 20
        }

        response = client.get('/api/v1/execution/history')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert len(data['data']['items']) == 0

    @patch('app.api.routes.execution_history_routes.execution_history_service')
    def test_get_execution_detail_success(self, mock_service):
        mock_service.get_execution_detail.return_value = {
            "batch_id": "batch-1",
            "project_id": "proj-1",
            "batch_status": "COMPLETED",
            "total_controls": 10,
            "completed_controls": 8,
            "failed_controls": 2,
            "batch_start_time": "2026-01-01",
            "batch_end_time": "2026-01-02",
            "control_summaries": [
                {
                    "control_id": "C01",
                    "overall_status": "PASS",
                    "total_rules": 10,
                    "passed_rules": 9,
                    "failed_rules": 1,
                    "error_rules": 0
                }
            ]
        }

        response = client.get('/api/v1/execution/history/batch-1')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['batch_id'] == 'batch-1'

    @patch('app.api.routes.execution_history_routes.execution_history_service')
    def test_get_execution_detail_not_found(self, mock_service):
        mock_service.get_execution_detail.return_value = None

        response = client.get('/api/v1/execution/history/nonexistent')

        assert response.status_code == 404

    @patch('app.api.routes.execution_history_routes.execution_history_service')
    def test_re_execute_batch_success(self, mock_service):
        mock_service.re_execute.return_value = {
            "message": "Re-execution triggered successfully",
            "batch_id": "new-batch-1",
            "project_id": "proj-1",
            "status": "triggered"
        }

        response = client.post('/api/v1/execution/history/batch-1/re-execute')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['status'] == 'triggered'

    @patch('app.api.routes.execution_history_routes.execution_history_service')
    def test_re_execute_batch_not_found(self, mock_service):
        mock_service.re_execute.return_value = None

        response = client.post('/api/v1/execution/history/nonexistent/re-execute')

        assert response.status_code == 404

    @patch('app.api.routes.execution_history_routes.execution_history_service')
    def test_get_audit_trail_success(self, mock_service):
        mock_service.get_audit_trail.return_value = {
            "batch_id": "batch-1",
            "control_executions": [
                {
                    "id": 1,
                    "batch_id": "batch-1",
                    "control_id": "C01",
                    "rule_id": "C01_ROWCOUNT",
                    "entity_name": "accounts",
                    "execution_status": "PASS",
                    "delta_value": 0.0,
                    "execution_time_seconds": 1.5,
                    "severity_level": "HIGH",
                    "created_at": "2026-01-01"
                }
            ],
            "exceptions": [],
            "governance": {
                "batch_id": "batch-1",
                "project_id": "proj-1",
                "migration_status": "APPROVED",
                "blocking_controls": "C01",
                "total_failed_rules": 2,
                "decision_time": "2026-01-01"
            }
        }

        response = client.get('/api/v1/execution/batch-1/audit')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert len(data['data']['control_executions']) == 1
        assert data['data']['governance'] is not None
