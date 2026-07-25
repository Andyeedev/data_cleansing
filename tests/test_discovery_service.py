import pytest
from unittest.mock import Mock, patch, MagicMock
from app.services.discovery_service_api import DiscoveryService


class TestDiscoveryService:

    def setup_method(self):
        self.service = DiscoveryService()

    @patch('app.services.discovery_service_api.DiscoveryRepository')
    def test_get_datasets_by_batch_returns_list(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_mappings_by_batch.return_value = [
            ('mapping-1', 'proj-1', 'sys-1', 'sys-2', 'public', 'accounts_source', None, 'public', 'accounts_target', None, True, '2026-01-01')
        ]

        service = DiscoveryService()
        result = service.get_datasets_by_batch('batch-1')

        assert isinstance(result, list)
        assert len(result) == 1
        assert result[0]['mapping_id'] == 'mapping-1'

    @patch('app.services.discovery_service_api.DiscoveryRepository')
    def test_get_dataset_by_id_returns_dict(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_mapping_by_id.return_value = (
            'mapping-1', 'proj-1', 'sys-1', 'sys-2', 'public', 'accounts_source', None, 'public', 'accounts_target', None, True, '2026-01-01'
        )

        service = DiscoveryService()
        result = service.get_dataset_by_id('mapping-1')

        assert result is not None
        assert result['mapping_id'] == 'mapping-1'

    @patch('app.services.discovery_service_api.DiscoveryRepository')
    def test_get_dataset_by_id_returns_none_when_not_found(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_mapping_by_id.return_value = None

        service = DiscoveryService()
        result = service.get_dataset_by_id('nonexistent')

        assert result is None

    @patch('app.services.discovery_service_api.DiscoveryRepository')
    def test_get_discovery_status_returns_dict(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_discovery_status.return_value = (
            'batch-1', 'proj-1', 'COMPLETED', '2026-01-01', '2026-01-02', 5
        )
        mock_repo.count_datasets_by_project.return_value = 10

        service = DiscoveryService()
        result = service.get_discovery_status('batch-1')

        assert result is not None
        assert result['batch_id'] == 'batch-1'
        assert result['discovery_status'] == 'COMPLETED'
        assert result['mappings_created'] == 5

    @patch('app.services.discovery_service_api.DiscoveryRepository')
    def test_get_discovery_status_returns_none_when_not_found(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_discovery_status.return_value = None

        service = DiscoveryService()
        result = service.get_discovery_status('nonexistent')

        assert result is None

    @patch('app.services.discovery_service_api.DatasetDiscoveryService')
    @patch('app.services.discovery_service_api.get_db_connection')
    def test_trigger_discovery_calls_service(self, mock_db, mock_discovery_class):
        mock_db.return_value = Mock()
        mock_discovery = Mock()
        mock_discovery_class.return_value = mock_discovery

        service = DiscoveryService()
        result = service.trigger_discovery('proj-1')

        assert result['status'] == 'completed'
        assert result['project_id'] == 'proj-1'
        mock_discovery.discover.assert_called_once()
