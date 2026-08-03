#!/usr/bin/env python3
"""
Test script for Phase 1.1 - Connection Adapter Framework
"""

from app.adapters import ConnectionAdapter, AdapterRegistry, ConnectionPoolManager
from app.config import PostgresConfig, SQLServerConfig, MySQLConfig
from app.adapters.models import TableInfo, ColumnInfo, ConnectionTestResult

def test_connection_adapter_interface():
    """Test that ConnectionAdapter abstract class is properly defined."""
    
    # Check that ConnectionAdapter exists and is abstract
    assert ConnectionAdapter.__name__ == "ConnectionAdapter"
    assert hasattr(ConnectionAdapter, 'connect')
    assert hasattr(ConnectionAdapter, 'execute')
    assert hasattr(ConnectionAdapter, 'fetch_all')
    assert hasattr(ConnectionAdapter, 'list_tables')
    assert hasattr(ConnectionAdapter, 'list_columns')
    assert hasattr(ConnectionAdapter, 'validate')
    assert hasattr(ConnectionAdapter, 'test_connection')
    assert hasattr(ConnectionAdapter, 'close')
    assert hasattr(ConnectionAdapter, 'get_capabilities')
    
    # Check that it's an abstract class
    import inspect
    assert inspect.isabstract(ConnectionAdapter)
    
    print("ConnectionAdapter abstract class verified")

def test_adapter_registry():
    """Test AdapterRegistry functionality."""

    # Check that AdapterRegistry exists
    assert AdapterRegistry.__name__ == "AdapterRegistry"

    # Test registry methods
    assert hasattr(AdapterRegistry, 'register')
    assert hasattr(AdapterRegistry, 'get')
    assert hasattr(AdapterRegistry, 'supported_types')
    assert hasattr(AdapterRegistry, 'is_supported')

    # Test that registry has adapters registered (PostgresAdapter imported)
    types = AdapterRegistry.supported_types()
    assert "postgres" in types

    print("AdapterRegistry verified")

def test_connection_pool_manager():
    """Test ConnectionPoolManager functionality."""
    
    # Check that ConnectionPoolManager exists
    assert ConnectionPoolManager.__name__ == "ConnectionPoolManager"
    
    # Test that pool manager can be instantiated
    pool_manager = ConnectionPoolManager()
    assert pool_manager is not None
    
    # Test initial state
    info = pool_manager.get_pools_info()
    assert info == {}
    
    # Test health check
    health = pool_manager.health_check()
    assert health == {}
    
    print("ConnectionPoolManager verified")

def test_config_classes():
    """Test adapter-specific configuration classes."""
    
    # Test PostgresConfig
    postgres_config = PostgresConfig()
    assert postgres_config.host == ""
    assert postgres_config.port == 5432
    assert postgres_config.database == ""
    assert postgres_config.schema == "public"
    assert postgres_config.ssl_mode == "prefer"
    
    # Test SQLServerConfig
    sqlserver_config = SQLServerConfig()
    assert sqlserver_config.host == ""
    assert sqlserver_config.port == 1433
    assert sqlserver_config.database == ""
    assert sqlserver_config.schema == "dbo"
    assert sqlserver_config.encrypt == True
    
    # Test MySQLConfig
    mysql_config = MySQLConfig()
    assert mysql_config.host == ""
    assert mysql_config.port == 3306
    assert mysql_config.database == ""
    assert mysql_config.charset == "utf8mb4"
    
    print("Adapter config classes verified")

def test_data_models():
    """Test data model dataclasses."""
    
    # Test TableInfo
    table_info = TableInfo(
        schema_name="public",
        table_name="users",
        table_type="BASE TABLE",
        row_count=100,
        column_count=10
    )
    assert table_info.schema_name == "public"
    assert table_info.table_name == "users"
    assert table_info.table_type == "BASE TABLE"
    assert table_info.row_count == 100
    assert table_info.column_count == 10
    
    # Test ColumnInfo
    column_info = ColumnInfo(
        column_name="id",
        data_type="integer",
        is_nullable=False,
        column_default="AUTO_INCREMENT",
        is_primary_key=True
    )
    assert column_info.column_name == "id"
    assert column_info.data_type == "integer"
    assert column_info.is_nullable == False
    assert column_info.column_default == "AUTO_INCREMENT"
    assert column_info.is_primary_key == True
    
    # Test ConnectionTestResult
    test_result = ConnectionTestResult(
        success=True,
        message="Connection successful",
        latency_ms=45,
        server_version="PostgreSQL 14.0",
        capabilities=["SELECT", "INSERT", "UPDATE"]
    )
    assert test_result.success == True
    assert test_result.message == "Connection successful"
    assert test_result.latency_ms == 45
    assert test_result.server_version == "PostgreSQL 14.0"
    assert test_result.capabilities == ["SELECT", "INSERT", "UPDATE"]
    
    print("Data models verified")

def run_all_tests():
    """Run all tests."""
    print("=" * 60)
    print("Phase 1.1 - Connection Adapter Framework Tests")
    print("=" * 60)

    test_connection_adapter_interface()
    test_adapter_registry()
    test_connection_pool_manager()
    test_config_classes()
    test_data_models()

    print("=" * 60)
    print("Phase 2 - All Adapters Migrated Tests")
    print("=" * 60)

    test_all_adapters_registered()

    print("=" * 60)
    print("All tests passed! [OK]")
    print("=" * 60)

def test_all_adapters_registered():
    """Test that all 7 adapters are registered."""
    expected_adapters = [
        "postgres",
        "sqlserver",
        "mysql",
        "oracle",
        "snowflake",
        "bigquery",
        "databricks",
    ]

    registered = AdapterRegistry.supported_types()

    for adapter_type in expected_adapters:
        assert adapter_type in registered, f"{adapter_type} not registered"

    print(f"All 7 adapters registered: {registered}")

if __name__ == "__main__":
    run_all_tests()
