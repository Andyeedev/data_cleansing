import pytest
from unittest.mock import Mock, patch, MagicMock
from app.repositories.execution_control_repository import ExecutionControlRepository


class TestExecutionControlRepository:

    @patch('app.repositories.execution_control_repository.get_db_connection')
    def test_get_batch_status(self, mock_get_db):
        mock_db = Mock()
        mock_get_db.return_value = mock_db
        mock_db.execute.return_value = [('batch-123', 'RUNNING')]

        repo = ExecutionControlRepository()
        result = repo.get_batch_status('batch-123')

        assert result is not None
        assert result[0] == 'batch-123'
        assert result[1] == 'RUNNING'

    @patch('app.repositories.execution_control_repository.get_db_connection')
    def test_get_batch_status_not_found(self, mock_get_db):
        mock_db = Mock()
        mock_get_db.return_value = mock_db
        mock_db.execute.return_value = []

        repo = ExecutionControlRepository()
        result = repo.get_batch_status('batch-unknown')

        assert result is None

    @patch('app.repositories.execution_control_repository.get_db_connection')
    def test_update_batch_status(self, mock_get_db):
        mock_db = Mock()
        mock_get_db.return_value = mock_db
        mock_db.execute.return_value = []

        repo = ExecutionControlRepository()
        repo.update_batch_status('batch-123', 'CANCELLED')

        mock_db.execute.assert_called_once()

    @patch('app.repositories.execution_control_repository.get_db_connection')
    def test_get_lifecycle_events(self, mock_get_db):
        mock_db = Mock()
        mock_get_db.return_value = mock_db
        mock_db.execute.return_value = [
            (1, 'batch-123', 'STARTED', '2026-01-01T00:00:00', None),
            (2, 'batch-123', 'COMPLETED', '2026-01-01T00:05:00', None),
        ]

        repo = ExecutionControlRepository()
        result = repo.get_lifecycle_events('batch-123')

        assert len(result) == 2
        assert result[0][2] == 'STARTED'
        assert result[1][2] == 'COMPLETED'

    @patch('app.repositories.execution_control_repository.get_db_connection')
    def test_insert_lifecycle_event(self, mock_get_db):
        mock_db = Mock()
        mock_get_db.return_value = mock_db
        mock_db.execute.return_value = []

        repo = ExecutionControlRepository()
        repo.insert_lifecycle_event('batch-123', 'CANCELLED')

        mock_db.execute.assert_called_once()

    @patch('app.repositories.execution_control_repository.get_db_connection')
    def test_get_progress(self, mock_get_db):
        mock_db = Mock()
        mock_get_db.return_value = mock_db
        mock_db.execute.return_value = [('batch-123', 'RUNNING', 10, 5, 2)]

        repo = ExecutionControlRepository()
        result = repo.get_progress('batch-123')

        assert result is not None
        assert result[2] == 10
        assert result[3] == 5
        assert result[4] == 2

    @patch('app.repositories.execution_control_repository.get_db_connection')
    def test_get_progress_not_found(self, mock_get_db):
        mock_db = Mock()
        mock_get_db.return_value = mock_db
        mock_db.execute.return_value = []

        repo = ExecutionControlRepository()
        result = repo.get_progress('batch-unknown')

        assert result is None
