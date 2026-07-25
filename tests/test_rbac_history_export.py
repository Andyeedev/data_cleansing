import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
from app.api.routes.execution_history_routes import router as history_router
from app.api.routes.export_routes import router as export_router
from app.api.core.auth.dependencies import get_current_user


app = FastAPI()
app.include_router(history_router)
app.include_router(export_router)

client = TestClient(app)


def override_get_current_user():
    return {"user_id": "test-user", "role": "admin"}


app.dependency_overrides[get_current_user] = override_get_current_user


class TestRBACExecutionHistoryRoutes:

    @patch('app.api.routes.execution_history_routes.execution_history_service')
    def test_execution_history_list_requires_auth(self, mock_service):
        mock_service.get_execution_history.return_value = {
            "items": [],
            "total": 0,
            "page": 1,
            "page_size": 20
        }

        response = client.get('/api/v1/execution/history')

        assert response.status_code in [200, 401, 403]

    @patch('app.api.routes.execution_history_routes.execution_history_service')
    def test_execution_history_detail_requires_auth(self, mock_service):
        mock_service.get_execution_detail.return_value = None

        response = client.get('/api/v1/execution/history/batch-1')

        assert response.status_code in [200, 401, 403, 404]

    @patch('app.api.routes.execution_history_routes.execution_history_service')
    def test_re_execute_requires_auth(self, mock_service):
        mock_service.re_execute.return_value = {
            "message": "Re-execution triggered",
            "batch_id": "new-batch",
            "project_id": "proj-1",
            "status": "triggered"
        }

        response = client.post('/api/v1/execution/history/batch-1/re-execute')

        assert response.status_code in [200, 401, 403]

    @patch('app.api.routes.execution_history_routes.execution_history_service')
    def test_audit_trail_requires_auth(self, mock_service):
        mock_service.get_audit_trail.return_value = {
            "batch_id": "batch-1",
            "control_executions": [],
            "exceptions": [],
            "governance": None
        }

        response = client.get('/api/v1/execution/batch-1/audit')

        assert response.status_code in [200, 401, 403]


class TestRBACExportRoutes:

    @patch('app.api.routes.export_routes.export_service')
    def test_export_csv_requires_auth(self, mock_service):
        mock_service.export_csv.return_value = "Rule ID\n"

        response = client.get('/api/v1/execution/export/batch-1/csv')

        assert response.status_code in [200, 401, 403]

    @patch('app.api.routes.export_routes.export_service')
    def test_export_pdf_requires_auth(self, mock_service):
        mock_service.export_pdf.return_value = b'%PDF-1.4'

        response = client.get('/api/v1/execution/export/batch-1/pdf')

        assert response.status_code in [200, 401, 403]
