import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
from app.api.routes.execution_control_routes import router
from app.api.core.auth.dependencies import get_current_user


app = FastAPI()
app.include_router(router)

client = TestClient(app)


def override_get_current_user():
    return {"user_id": "test-user", "roles": ["Super Admin"]}


app.dependency_overrides[get_current_user] = override_get_current_user


class TestExecutionControlRoutes:

    @patch('app.api.routes.execution_control_routes.execution_control_service')
    def test_cancel_execution(self, mock_service):
        mock_service.cancel_execution.return_value = {
            "message": "Execution cancelled successfully",
            "batch_id": "batch-123",
            "status": "CANCELLED"
        }

        response = client.post("/api/v1/execution/batch-123/cancel")

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "CANCELLED"

    @patch('app.api.routes.execution_control_routes.execution_control_service')
    def test_cancel_execution_not_found(self, mock_service):
        mock_service.cancel_execution.return_value = None

        response = client.post("/api/v1/execution/batch-unknown/cancel")

        assert response.status_code == 404

    @patch('app.api.routes.execution_control_routes.execution_control_service')
    def test_pause_execution(self, mock_service):
        mock_service.pause_execution.return_value = {
            "message": "Execution paused successfully",
            "batch_id": "batch-123",
            "status": "PAUSED"
        }

        response = client.post("/api/v1/execution/batch-123/pause")

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "PAUSED"

    @patch('app.api.routes.execution_control_routes.execution_control_service')
    def test_resume_execution(self, mock_service):
        mock_service.resume_execution.return_value = {
            "message": "Execution resumed successfully",
            "batch_id": "batch-123",
            "status": "RUNNING"
        }

        response = client.post("/api/v1/execution/batch-123/resume")

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "RUNNING"

    @patch('app.api.routes.execution_control_routes.execution_control_service')
    def test_retry_execution(self, mock_service):
        mock_service.retry_execution.return_value = {
            "message": "Execution retry triggered",
            "batch_id": "batch-123",
            "status": "RUNNING"
        }

        response = client.post("/api/v1/execution/batch-123/retry")

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "RUNNING"

    @patch('app.api.routes.execution_control_routes.execution_control_service')
    def test_get_lifecycle(self, mock_service):
        mock_service.get_lifecycle.return_value = {
            "batch_id": "batch-123",
            "events": [
                {"event_type": "STARTED", "timestamp": "2026-01-01T00:00:00", "details": None},
                {"event_type": "COMPLETED", "timestamp": "2026-01-01T00:05:00", "details": None},
            ]
        }

        response = client.get("/api/v1/execution/batch-123/lifecycle")

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]["events"]) == 2

    @patch('app.api.routes.execution_control_routes.execution_control_service')
    def test_get_progress(self, mock_service):
        mock_service.get_progress.return_value = {
            "batch_id": "batch-123",
            "status": "RUNNING",
            "total_controls": 10,
            "completed_controls": 5,
            "failed_controls": 2,
            "progress": "5/10",
            "percentage": 50
        }

        response = client.get("/api/v1/execution/batch-123/progress")

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["percentage"] == 50

    @patch('app.api.routes.execution_control_routes.execution_control_service')
    def test_get_progress_not_found(self, mock_service):
        mock_service.get_progress.return_value = None

        response = client.get("/api/v1/execution/batch-unknown/progress")

        assert response.status_code == 404
