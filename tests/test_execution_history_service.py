import pytest
from unittest.mock import Mock, patch
from app.services.execution_history_service import ExecutionHistoryService


class TestExecutionHistoryService:

    def setup_method(self):
        self.service = ExecutionHistoryService()

    @patch('app.services.execution_history_service.ExecutionHistoryRepository')
    def test_get_execution_history_returns_paginated(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_execution_history.return_value = (
            [('batch-1', 'proj-1', 'COMPLETED', 10, 8, 2, '2026-01-01', '2026-01-02')],
            1
        )

        service = ExecutionHistoryService()
        result = service.get_execution_history(page=1, page_size=20)

        assert result['page'] == 1
        assert result['page_size'] == 20
        assert result['total'] == 1
        assert len(result['items']) == 1
        assert result['items'][0]['batch_id'] == 'batch-1'

    @patch('app.services.execution_history_service.ExecutionHistoryRepository')
    def test_get_execution_detail_returns_dict(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_execution_detail.return_value = (
            'batch-1', 'proj-1', 'COMPLETED', 10, 8, 2, '2026-01-01', '2026-01-02'
        )
        mock_repo.get_control_summaries.return_value = [
            ('C01', 'PASS', 10, 9, 1, 0)
        ]

        service = ExecutionHistoryService()
        result = service.get_execution_detail('batch-1')

        assert result is not None
        assert result['batch_id'] == 'batch-1'
        assert result['project_id'] == 'proj-1'
        assert len(result['control_summaries']) == 1

    @patch('app.services.execution_history_service.ExecutionHistoryRepository')
    def test_get_execution_detail_returns_none_when_not_found(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_execution_detail.return_value = None

        service = ExecutionHistoryService()
        result = service.get_execution_detail('nonexistent')

        assert result is None

    @patch('app.services.execution_history_service.ExecutionHistoryRepository')
    def test_get_audit_trail_returns_dict(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_control_executions.return_value = [
            (1, 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', 'PASS', 0.0, 1.5, 'HIGH', '2026-01-01')
        ]
        mock_repo.get_exceptions.return_value = [
            ('exc-1', 'batch-1', 'C01', 'C01_ROWCOUNT', 'accounts', '100', '99', 1.0, 'Count mismatch', 'MEDIUM', '2026-01-01')
        ]
        mock_repo.get_governance.return_value = (
            'batch-1', 'proj-1', 'APPROVED', 'C01', 2, '2026-01-01'
        )

        service = ExecutionHistoryService()
        result = service.get_audit_trail('batch-1')

        assert result['batch_id'] == 'batch-1'
        assert len(result['control_executions']) == 1
        assert len(result['exceptions']) == 1
        assert result['governance'] is not None
        assert result['governance']['migration_status'] == 'APPROVED'

    @patch('app.services.execution_history_service.ExecutionHistoryRepository')
    def test_get_audit_trail_handles_empty_data(self, mock_repo_class):
        mock_repo = Mock()
        mock_repo_class.return_value = mock_repo
        mock_repo.get_control_executions.return_value = []
        mock_repo.get_exceptions.return_value = []
        mock_repo.get_governance.return_value = None

        service = ExecutionHistoryService()
        result = service.get_audit_trail('batch-1')

        assert result['batch_id'] == 'batch-1'
        assert len(result['control_executions']) == 0
        assert len(result['exceptions']) == 0
        assert result['governance'] is None
