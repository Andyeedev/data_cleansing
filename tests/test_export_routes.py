import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
from app.api.routes.export_routes import router
from app.api.core.auth.dependencies import get_current_user


app = FastAPI()
app.include_router(router)

client = TestClient(app)


def override_get_current_user():
    return {"user_id": "test-user", "role": "admin"}


app.dependency_overrides[get_current_user] = override_get_current_user


class TestExportRoutes:

    @patch('app.api.routes.export_routes.export_service')
    def test_export_csv_success(self, mock_service):
        mock_service.export_csv.return_value = "Rule ID,Entity Name,Status\nC01_ROWCOUNT,accounts,PASS\n"

        response = client.get('/api/v1/execution/export/batch-1/csv')

        assert response.status_code == 200
        assert response.headers['content-type'] == 'text/csv; charset=utf-8'
        assert 'attachment' in response.headers.get('content-disposition', '')
        assert 'C01_ROWCOUNT' in response.text

    @patch('app.api.routes.export_routes.export_service')
    def test_export_csv_empty_data(self, mock_service):
        mock_service.export_csv.return_value = "Rule ID,Entity Name,Status\n"

        response = client.get('/api/v1/execution/export/batch-1/csv')

        assert response.status_code == 200
        assert 'Rule ID' in response.text

    @patch('app.api.routes.export_routes.export_service')
    def test_export_pdf_success(self, mock_service):
        mock_service.export_pdf.return_value = b'%PDF-1.4 fake pdf content'

        response = client.get('/api/v1/execution/export/batch-1/pdf')

        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/pdf'
        assert 'attachment' in response.headers.get('content-disposition', '')

    @patch('app.api.routes.export_routes.export_service')
    def test_export_csv_handles_error(self, mock_service):
        mock_service.export_csv.side_effect = Exception("Database error")

        response = client.get('/api/v1/execution/export/batch-1/csv')

        assert response.status_code == 500

    @patch('app.api.routes.export_routes.export_service')
    def test_export_pdf_handles_error(self, mock_service):
        mock_service.export_pdf.side_effect = Exception("Database error")

        response = client.get('/api/v1/execution/export/batch-1/pdf')

        assert response.status_code == 500
