"""
Base connection configuration for all adapters

This module provides the abstract base configuration class for all database adapters.
"""

from abc import ABC
from dataclasses import dataclass, field
from typing import Any, Dict, Optional
@dataclass
class BaseConnectionConfig(ABC):
    """Base config shared by all adapters."""
    username: Optional[str] = None
    password: Optional[str] = None
    timeout: int = 10
    extra: Dict[str, Any] = field(default_factory=dict)
    
@dataclass
class ConnectionConfig(BaseConnectionConfig):
    """Generic connection configuration.

    This is used for API layer and JSONB storage in the database.
    Actual adapter-specific configs inherit from BaseConnectionConfig.
    """
    pass
@dataclass
class PostgresConfig(BaseConnectionConfig):
    host: str = ""
    port: int = 5432
    database: str = ""
    schema: str = "public"
    ssl_mode: str = "prefer"
    ssl_cert: Optional[str] = None
    ssl_key: Optional[str] = None
    ssl_root_cert: Optional[str] = None
    application_name: str = "map_platform"
    command_timeout: int = 60
@dataclass
class SQLServerConfig(BaseConnectionConfig):
    host: str = ""
    port: int = 1433
    database: str = ""
    schema: str = "dbo"
    encrypt: bool = True
    trust_server_certificate: bool = False
    connection_timeout: int = 10
    command_timeout: int = 60
@dataclass
class MySQLConfig(BaseConnectionConfig):
    host: str = ""
    port: int = 3306
    database: str = ""
    charset: str = "utf8mb4"
    ssl_ca: Optional[str] = None
    ssl_cert: Optional[str] = None
    ssl_key: Optional[str] = None
@dataclass
class OracleConfig(BaseConnectionConfig):
    host: str = ""
    port: int = 1521
    service_name: str = ""
    schema: str = ""
    ssl: bool = False
@dataclass
class SnowflakeConfig(BaseConnectionConfig):
    account: str = ""
    warehouse: str = ""
    database: str = ""
    schema: str = ""
    role: Optional[str] = None
    authenticator: str = "snowflake"
    private_key: Optional[str] = None  # PEM contents for SNOWFLAKE_JWT (stored encrypted as password, path outside Terraform)
    private_key_path: Optional[str] = None
@dataclass
class BigQueryConfig(BaseConnectionConfig):
    project_id: str = ""
    dataset: str = ""
    location: str = "US"
    credentials_file: Optional[str] = None
@dataclass
class DatabricksConfig(BaseConnectionConfig):
    host: str = ""
    http_path: str = ""
    catalog: str = ""
    schema: str = ""
