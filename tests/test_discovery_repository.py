import pytest
from unittest.mock import Mock, patch
from app.repositories.discovery_repository import DiscoveryRepository


class TestDiscoveryRepository:

    @patch('app.repositories.discovery_repository.get_db_connection')
    def test_get_mappings_by_batch_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('mapping-1', 'proj-1', 'sys-1', 'sys-2', 'public', 'accounts_source', None, 'public', 'accounts_target', None, True, '2026-01-01')
        ]

        repo = DiscoveryRepository()
        result = repo.get_mappings_by_batch('batch-1')

        assert len(result) == 1
        mock_conn.execute.assert_called_once()

    @patch('app.repositories.discovery_repository.get_db_connection')
    def test_get_mapping_by_id_returns_row(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('mapping-1', 'proj-1', 'sys-1', 'sys-2', 'public', 'accounts_source', None, 'public', 'accounts_target', None, True, '2026-01-01')
        ]

        repo = DiscoveryRepository()
        result = repo.get_mapping_by_id('mapping-1')

        assert result is not None
        assert result[0] == 'mapping-1'

    @patch('app.repositories.discovery_repository.get_db_connection')
    def test_get_mapping_by_id_returns_none_when_not_found(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = []

        repo = DiscoveryRepository()
        result = repo.get_mapping_by_id('nonexistent')

        assert result is None

    @patch('app.repositories.discovery_repository.get_db_connection')
    def test_get_mappings_by_project_returns_results(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('mapping-1', 'proj-1', 'sys-1', 'sys-2', 'public', 'accounts_source', None, 'public', 'accounts_target', None, True, '2026-01-01')
        ]

        repo = DiscoveryRepository()
        result = repo.get_mappings_by_project('proj-1')

        assert len(result) == 1

    @patch('app.repositories.discovery_repository.get_db_connection')
    def test_get_batch_info_returns_row(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('batch-1', 'proj-1', '2026-01-01', '2026-01-02', 'COMPLETED', 85.5)
        ]

        repo = DiscoveryRepository()
        result = repo.get_batch_info('batch-1')

        assert result is not None
        assert result[0] == 'batch-1'

    @patch('app.repositories.discovery_repository.get_db_connection')
    def test_get_discovery_status_returns_row(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('batch-1', 'proj-1', 'COMPLETED', '2026-01-01', '2026-01-02', 5)
        ]

        repo = DiscoveryRepository()
        result = repo.get_discovery_status('batch-1')

        assert result is not None
        assert result[5] == 5

    @patch('app.repositories.discovery_repository.get_db_connection')
    def test_count_datasets_by_project_returns_count(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [(10,)]

        repo = DiscoveryRepository()
        result = repo.count_datasets_by_project('proj-1')

        assert result == 10
