import pytest
from unittest.mock import Mock, patch
from app.services.export_service import ExportService


class TestExportService:

    @patch('app.services.export_service.get_db_connection')
    def test_export_csv_returns_csv_string(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('C01_ROWCOUNT', 'accounts', 'PASS', 0.0, 1.5, 'HIGH', 'C01')
        ]

        service = ExportService()
        result = service.export_csv('batch-1')

        assert 'Rule ID' in result
        assert 'C01_ROWCOUNT' in result
        assert 'accounts' in result

    @patch('app.services.export_service.get_db_connection')
    def test_export_csv_handles_empty_data(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = []

        service = ExportService()
        result = service.export_csv('batch-1')

        assert 'Rule ID' in result
        assert 'C01_ROWCOUNT' not in result

    @patch('app.services.export_service.get_db_connection')
    def test_export_pdf_returns_bytes(self, mock_db):
        mock_conn = Mock()
        mock_db.return_value = mock_conn
        mock_conn.execute.return_value = [
            ('COMPLETED', 10, 8, 2)
        ]
        mock_conn.execute.return_value = [
            ('C01_ROWCOUNT', 'accounts', 'PASS', 0.0, 'C01')
        ]

        service = ExportService()
        result = service.export_pdf('batch-1')

        assert isinstance(result, bytes)
        assert len(result) > 0
