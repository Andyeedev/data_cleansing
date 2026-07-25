import pytest
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient
from fastapi import FastAPI
from app.api.routes.discovery_routes import router
from app.api.core.auth.dependencies import get_current_user


app = FastAPI()
app.include_router(router)

client = TestClient(app)


def override_get_current_user():
    return {"user_id": "test-user", "role": "admin"}


app.dependency_overrides[get_current_user] = override_get_current_user


class TestDiscoveryRoutes:

    @patch('app.api.routes.discovery_routes.discovery_service')
    def test_get_datasets_by_batch_success(self, mock_service):
        mock_service.get_datasets_by_batch.return_value = [
            {
                'mapping_id': 'mapping-1',
                'project_id': 'proj-1',
                'source_system_id': 'sys-1',
                'target_system_id': 'sys-2',
                'source_schema': 'public',
                'source_table': 'accounts_source',
                'source_columns': None,
                'target_schema': 'public',
                'target_table': 'accounts_target',
                'target_columns': None,
                'is_active': True,
                'created_at': '2026-01-01'
            }
        ]

        response = client.get('/api/v1/discovery/batch-1/datasets')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert len(data['data']) == 1

    @patch('app.api.routes.discovery_routes.discovery_service')
    def test_get_datasets_by_batch_empty(self, mock_service):
        mock_service.get_datasets_by_batch.return_value = []

        response = client.get('/api/v1/discovery/batch-1/datasets')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert len(data['data']) == 0

    @patch('app.api.routes.discovery_routes.discovery_service')
    def test_get_dataset_by_id_success(self, mock_service):
        mock_service.get_dataset_by_id.return_value = {
            'mapping_id': 'mapping-1',
            'project_id': 'proj-1',
            'source_system_id': 'sys-1',
            'target_system_id': 'sys-2',
            'source_schema': 'public',
            'source_table': 'accounts_source',
            'source_columns': None,
            'target_schema': 'public',
            'target_table': 'accounts_target',
            'target_columns': None,
            'is_active': True,
            'created_at': '2026-01-01'
        }

        response = client.get('/api/v1/discovery/batch-1/datasets/mapping-1')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['mapping_id'] == 'mapping-1'

    @patch('app.api.routes.discovery_routes.discovery_service')
    def test_get_dataset_by_id_not_found(self, mock_service):
        mock_service.get_dataset_by_id.return_value = None

        response = client.get('/api/v1/discovery/batch-1/datasets/nonexistent')

        assert response.status_code == 404

    @patch('app.api.routes.discovery_routes.discovery_service')
    def test_trigger_discovery_success(self, mock_service):
        mock_service.trigger_discovery.return_value = {
            'message': 'Discovery triggered successfully',
            'project_id': 'proj-1',
            'status': 'completed'
        }

        response = client.post('/api/v1/discovery/current', json={'project_id': 'proj-1'})

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['status'] == 'completed'

    @patch('app.api.routes.discovery_routes.discovery_service')
    def test_get_discovery_status_success(self, mock_service):
        mock_service.get_discovery_status.return_value = {
            'batch_id': 'batch-1',
            'project_id': 'proj-1',
            'discovery_status': 'COMPLETED',
            'datasets_found': 10,
            'mappings_created': 5,
            'started_at': '2026-01-01',
            'completed_at': '2026-01-02'
        }

        response = client.get('/api/v1/discovery/batch-1/status')

        assert response.status_code == 200
        data = response.json()
        assert data['success'] is True
        assert data['data']['discovery_status'] == 'COMPLETED'

    @patch('app.api.routes.discovery_routes.discovery_service')
    def test_get_discovery_status_not_found(self, mock_service):
        mock_service.get_discovery_status.return_value = None

        response = client.get('/api/v1/discovery/nonexistent/status')

        assert response.status_code == 404
