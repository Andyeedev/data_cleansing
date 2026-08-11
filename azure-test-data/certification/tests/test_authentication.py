#!/usr/bin/env python3
"""
Phase 12: SQL Server Authentication Certification Tests
Tests all supported authentication methods against Azure SQL.
"""

import os
import pytest
from src.adapter import SQLServerCertificationAdapter


class TestSQLServerAuthentication:
    """Test suite for Azure SQL authentication methods."""

    @pytest.fixture
    def adapter(self):
        """Create adapter instance."""
        return SQLServerCertificationAdapter()

    @pytest.fixture
    def config(self):
        """Load configuration from environment."""
        return {
            "host": os.getenv("SQL_HOST", "sql-certification-test.database.windows.net"),
            "database": os.getenv("SQL_DATABASE", "certification_db"),
            "admin_user": os.getenv("SQL_ADMIN_USER", "certadmin"),
            "admin_password": os.getenv("SQL_ADMIN_PASSWORD"),
            "entra_user": os.getenv("SQL_ENTRA_USER"),
            "entra_password": os.getenv("SQL_ENTRA_PASSWORD"),
            "sp_client_id": os.getenv("SP_CLIENT_ID"),
            "sp_client_secret": os.getenv("SP_CLIENT_SECRET"),
            "mi_client_id": os.getenv("MI_CLIENT_ID"),
        }

    def test_sql_login(self, adapter, config):
        """Test SQL Login authentication."""
        if not config["admin_password"]:
            pytest.skip("Admin password not configured")

        result = adapter.connect_sql_login(
            host=config["host"],
            database=config["database"],
            username=config["admin_user"],
            password=config["admin_password"]
        )

        assert result.success, f"SQL Login failed: {result.message}"
        assert result.latency_ms < 5000, "Connection too slow"

        # Verify connection works
        assert adapter.test_connection()
        adapter.close()

    def test_entra_password(self, adapter, config):
        """Test Entra Password/User authentication."""
        if not config["entra_user"] or not config["entra_password"]:
            pytest.skip("Entra user credentials not configured")

        result = adapter.connect_entra_password(
            host=config["host"],
            database=config["database"],
            username=config["entra_user"],
            password=config["entra_password"]
        )

        assert result.success, f"Entra Password failed: {result.message}"
        adapter.close()

    def test_entra_service_principal(self, adapter, config):
        """Test Entra Service Principal authentication."""
        if not config["sp_client_id"] or not config["sp_client_secret"]:
            pytest.skip("Service Principal credentials not configured")

        result = adapter.connect_entra_service_principal(
            host=config["host"],
            database=config["database"],
            client_id=config["sp_client_id"],
            client_secret=config["sp_client_secret"]
        )

        assert result.success, f"Entra Service Principal failed: {result.message}"
        adapter.close()

    def test_managed_identity(self, adapter, config):
        """Test Managed Identity authentication."""
        if not config["mi_client_id"]:
            pytest.skip("Managed Identity not configured")

        result = adapter.connect_managed_identity(
            host=config["host"],
            database=config["database"],
            client_id=config["mi_client_id"]
        )

        assert result.success, f"Managed Identity failed: {result.message}"
        adapter.close()


class TestSQLServerFunctionality:
    """Test schema discovery and query execution."""

    @pytest.fixture
    def connected_adapter(self):
        """Create connected adapter."""
        adapter = SQLServerCertificationAdapter()
        config = {
            "host": os.getenv("SQL_HOST", "sql-certification-test.database.windows.net"),
            "database": os.getenv("SQL_DATABASE", "certification_db"),
            "admin_user": os.getenv("SQL_ADMIN_USER", "certadmin"),
            "admin_password": os.getenv("SQL_ADMIN_PASSWORD"),
        }
        if config["admin_password"]:
            adapter.connect_sql_login(
                host=config["host"],
                database=config["database"],
                username=config["admin_user"],
                password=config["admin_password"]
            )
            yield adapter
            adapter.close()
        else:
            pytest.skip("Admin password not configured")

    def test_list_tables(self, connected_adapter):
        """Test schema discovery - list tables."""
        tables = connected_adapter.list_tables()
        assert len(tables) >= 10, f"Expected 10+ tables, found {len(tables)}"

    def test_list_columns(self, connected_adapter):
        """Test column discovery."""
        columns = connected_adapter.list_columns("dbo", "customers")
        assert len(columns) >= 5, f"Expected 5+ columns, found {len(columns)}"

    def test_query_execution(self, connected_adapter):
        """Test basic query execution."""
        result = connected_adapter.execute_query("SELECT COUNT(*) as count FROM customers")
        assert result[0]["count"] == 5
