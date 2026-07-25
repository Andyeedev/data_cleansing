import pytest
from unittest.mock import Mock, patch, MagicMock
from app.services.execution_control_service import ExecutionControlService


class TestExecutionControlService:

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_cancel_execution_success(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_status.return_value = ('batch-123', 'RUNNING')

        service = ExecutionControlService()
        result = service.cancel_execution('batch-123')

        assert result is not None
        assert result['batch_id'] == 'batch-123'
        assert result['status'] == 'CANCELLED'
        mock_repo.update_batch_status.assert_called_once_with('batch-123', 'CANCELLED')

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_cancel_execution_not_found(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_status.return_value = None

        service = ExecutionControlService()
        result = service.cancel_execution('batch-unknown')

        assert result is None

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_cancel_execution_invalid_status(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_status.return_value = ('batch-123', 'COMPLETED')

        service = ExecutionControlService()
        result = service.cancel_execution('batch-123')

        assert result is not None
        assert 'error' in result

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_pause_execution_success(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_status.return_value = ('batch-123', 'RUNNING')

        service = ExecutionControlService()
        result = service.pause_execution('batch-123')

        assert result is not None
        assert result['batch_id'] == 'batch-123'
        assert result['status'] == 'PAUSED'
        mock_repo.update_batch_status.assert_called_once_with('batch-123', 'PAUSED')

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_pause_execution_invalid_status(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_status.return_value = ('batch-123', 'PENDING')

        service = ExecutionControlService()
        result = service.pause_execution('batch-123')

        assert result is not None
        assert 'error' in result

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_resume_execution_success(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_status.return_value = ('batch-123', 'PAUSED')

        service = ExecutionControlService()
        result = service.resume_execution('batch-123')

        assert result is not None
        assert result['batch_id'] == 'batch-123'
        assert result['status'] == 'RUNNING'
        mock_repo.update_batch_status.assert_called_once_with('batch-123', 'RUNNING')

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_resume_execution_invalid_status(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_status.return_value = ('batch-123', 'RUNNING')

        service = ExecutionControlService()
        result = service.resume_execution('batch-123')

        assert result is not None
        assert 'error' in result

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_retry_execution_success(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_status.return_value = ('batch-123', 'FAILED')

        service = ExecutionControlService()
        result = service.retry_execution('batch-123')

        assert result is not None
        assert result['batch_id'] == 'batch-123'
        assert result['status'] == 'RUNNING'
        mock_repo.update_batch_status.assert_called_once_with('batch-123', 'RUNNING')

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_retry_execution_invalid_status(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_batch_status.return_value = ('batch-123', 'RUNNING')

        service = ExecutionControlService()
        result = service.retry_execution('batch-123')

        assert result is not None
        assert 'error' in result

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_get_lifecycle(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_lifecycle_events.return_value = [
            (1, 'batch-123', 'STARTED', '2026-01-01T00:00:00', None),
            (2, 'batch-123', 'COMPLETED', '2026-01-01T00:05:00', None),
        ]

        service = ExecutionControlService()
        result = service.get_lifecycle('batch-123')

        assert result is not None
        assert result['batch_id'] == 'batch-123'
        assert len(result['events']) == 2

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_get_progress(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_progress.return_value = ('batch-123', 'RUNNING', 10, 5, 2)

        service = ExecutionControlService()
        result = service.get_progress('batch-123')

        assert result is not None
        assert result['batch_id'] == 'batch-123'
        assert result['total_controls'] == 10
        assert result['completed_controls'] == 5
        assert result['failed_controls'] == 2
        assert result['percentage'] == 50

    @patch('app.services.execution_control_service.ExecutionControlRepository')
    def test_get_progress_not_found(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_progress.return_value = None

        service = ExecutionControlService()
        result = service.get_progress('batch-unknown')

        assert result is None
