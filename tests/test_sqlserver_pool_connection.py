"""
Tests for SQL Server connection string construction in the connection pool.

These verify that connections to Azure SQL / SQL Server:
  - request encryption (Encrypt=yes), which Azure SQL Database requires, and
  - set a finite login timeout so a blocked/dropped TCP connection fails fast
    with a visible error instead of hanging (which previously surfaced as a
    blank "Test Connection" result in the UI).
"""
import sys

import pytest


class _FakeConn:
    def __init__(self, conn_str, autocommit=False, timeout=None):
        self.conn_str = conn_str
        self.autocommit = autocommit
        self.timeout = timeout

    def cursor(self):  # pragma: no cover - not exercised by pool acquisition
        raise NotImplementedError

    def close(self):
        pass


class _FakePyodbc:
    def __init__(self):
        self.calls = []

    def connect(self, conn_str, autocommit=False, timeout=None):
        conn = _FakeConn(conn_str, autocommit, timeout)
        self.calls.append(conn)
        return conn


@pytest.fixture
def fake_pyodbc(monkeypatch):
    fake = _FakePyodbc()
    monkeypatch.setitem(sys.modules, "pyodbc", fake)
    return fake


def test_sqlserver_connection_string_includes_encrypt_and_timeout(fake_pyodbc):
    from app.config import SQLServerConfig
    from app.adapters.pool import ConnectionPoolManager

    cfg = SQLServerConfig(
        host="sql-certification-test.database.windows.net",
        port=1433,
        database="certification_db",
        username="testuser",
        password="testpass",
    )

    mgr = ConnectionPoolManager()
    mgr.get_connection(system_id="cert-system", config=cfg, db_type="sqlserver")

    assert fake_pyodbc.calls, "pyodbc.connect was never called"
    conn_str = fake_pyodbc.calls[0].conn_str
    assert "Encrypt=yes" in conn_str, f"Encrypt=yes missing from: {conn_str}"
    assert "TrustServerCertificate=yes" in conn_str, (
        f"TrustServerCertificate=yes missing from: {conn_str}"
    )
    assert "SERVER=sql-certification-test.database.windows.net,1433" in conn_str, (
        f"SERVER not built correctly: {conn_str}"
    )
    assert fake_pyodbc.calls[0].timeout == 30, (
        f"expected login timeout 30, got {fake_pyodbc.calls[0].timeout}"
    )
