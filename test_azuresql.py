import sys
import pyodbc

print("=" * 60)
print("Testing Azure SQL Connection (Cert Tenant)")
print("=" * 60)

# Cert tenant Azure SQL configuration
server = "sql-certification-test.database.windows.net"
port = 1433
database = "certification_db"
username = "postgres"
password = "dev123456"

print(f"\nServer: {server},{port}")
print(f"Database: {database}")
print(f"Username: {username}")

# Test 1: Basic ODBC connection
print("\n1. Testing pyodbc connection...")
try:
    conn_str = (
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={server},{port};"
        f"DATABASE={database};"
        f"UID={username};"
        f"PWD={password};"
        f"TrustServerCertificate=yes;"
    )
    print(f"   Connection string: {conn_str[:80]}...")
    conn = pyodbc.connect(conn_str, autocommit=True)
    print("   ✅ Connected successfully!")
    
    # Test simple query
    cur = conn.cursor()
    cur.execute("SELECT @@VERSION")
    version = cur.fetchone()
    print(f"   SQL Server version: {version[0]}")
    
    cur.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_type = 'BASE TABLE'")
    table_count = cur.fetchone()[0]
    print(f"   User tables count: {table_count}")
    
    cur.close()
    conn.close()
except ImportError:
    print("   ❌ pyodbc not installed")
except Exception as e:
    print(f"   ❌ Failed: {e}")

# Test 2: Try with different driver names
print("\n2. Trying alternative ODBC drivers...")
for driver in ["ODBC Driver 17 for SQL Server", "ODBC Driver 18 for SQL Server", "ODBC Driver 13 for SQL Server"]:
    try:
        conn_str = (
            f"DRIVER{{{driver}}};"
            f"SERVER={server},{port};"
            f"DATABASE={database};"
            f"UID={username};"
            f"PWD={password};"
            f"TrustServerCertificate=yes;"
        )
        conn = pyodbc.connect(conn_str, autocommit=True)
        print(f"   ✅ Success with driver: {driver}")
        conn.close()
        break
    except Exception as e:
        print(f"   ❌ Driver '{driver}': {str(e)[:50]}")

print("\n" + "=" * 60)
print("Azure SQL test complete")
print("=" * 60)