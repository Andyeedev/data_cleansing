import psycopg2
conn = psycopg2.connect(dbname="migration_engine", user="postgres", host="localhost", password="dev123456")
cur = conn.cursor()

print("=" * 70)
print("Schema Configuration Source Investigation")
print("=" * 70)

# Check cert tenant source system
print("\n1. Cert Tenant Source System (SQL-Cert-Source)")
cur.execute("""
    SELECT system_id, system_name, system_role, connection_config
    FROM core.system_registry
    WHERE project_id = 'cd738f5f-2be0-4ca1-9762-32c0444c311c'
    AND system_role = 'SOURCE'
""")
row = cur.fetchone()
print(f"   system_id: {row[0]}")
print(f"   system_name: {row[1]}")
print(f"   system_role: {row[2]}")
print(f"   connection_config: {row[3]}")
if row[3]:
    import json
    config = json.loads(row[3]) if isinstance(row[3], str) else row[3]
    print(f"   -> host: {config.get('host', 'N/A')}")
    print(f"   -> port: {config.get('port', 'N/A')}")
    print(f"   -> database: {config.get('database', 'N/A')}")
    print(f"   -> schema (if present): {config.get('schema', 'NOT SET - uses default')}")  # SQLServerConfig default is 'dbo'
    print(f"   -> encrypt: {config.get('encrypt', 'NOT SET')}")  # SQLServerConfig default is True
    print(f"   -> trust_server_certificate: {config.get('trust_server_certificate', 'NOT SET')}")  # SQLServerConfig default is False

# Check default tenant source system
print("\n2. Default Tenant Source System (SourceDB)")
cur.execute("""
    SELECT system_id, system_name, system_role, connection_config
    FROM core.system_registry
    WHERE project_id = 'ae40b96c-20da-4972-bb29-bff3c2451ae0'
    AND system_role = 'SOURCE'
""")
row = cur.fetchone()
print(f"   system_id: {row[0]}")
print(f"   system_name: {row[1]}")
print(f"   system_role: {row[2]}")
print(f"   connection_config: {row[3]}")
if row[3]:
    import json
    config = json.loads(row[3]) if isinstance(row[3], str) else row[3]
    print(f"   -> host: {config.get('host', 'N/A')}")
    print(f"   -> port: {config.get('port', 'N/A')}")
    print(f"   -> database: {config.get('database', 'N/A')}")
    print(f"   -> schema (if present): {config.get('schema', 'NOT SET - uses default')}")
    print(f"   -> encrypt: {config.get('encrypt', 'NOT SET')}")
    print(f"   -> trust_server_certificate: {config.get('trust_server_certificate', 'NOT SET')}")

# Check SQLServerConfig defaults
print("\n3. SQLServerConfig Default Values (from app/config/__init__.py)")
from app.config import SQLServerConfig
cfg = SQLServerConfig()
print(f"   host: {cfg.host}")
print(f"   port: {cfg.port}")
print(f"   database: {cfg.database}")
print(f"   schema: {cfg.schema}")  # Default is "dbo"
print(f"   encrypt: {cfg.encrypt}")  # Default is True
print(f"   trust_server_certificate: {cfg.trust_server_certificate}")  # Default is False

# Check how _build_adapter_config reads schema
print("\n4. _build_adapter_config Schema Reading (from app/services/system_service.py:189)")
print("   config.get('schema', True)  <- Note: default value is True (boolean!), not 'dbo'")
print("   This is likely a BUG - should be schema='dbo', not True")

# Check reports page / frontend where schema might be displayed
print("\n4. Frontend Schema Display")
print("   The ReportsPage and Rule tabs get schema info from API responses")
print("   API returns connection_config which includes schema field")
print("   If schema not in JSONB, SQLServerConfig.default('dbo') is used")
print("   If cert tenant JSONB has no 'schema', it defaults to 'dbo'")
print("   If default tenant JSONB has no 'schema', it also defaults to 'dbo'")
print("   BUT user says default shows 'public' - so somewhere schema IS set differently")

# Let's check if there's a 'schema' key difference
print("\n5. Comparing schema between tenants")
cur.execute("""
    SELECT project_id, system_name, connection_config
    FROM core.system_registry
    WHERE system_role = 'SOURCE'
    ORDER BY project_id, system_name
""")
rows = cur.fetchall()
for r in rows:
    import json
    config = json.loads(r[3]) if isinstance(r[3], str) else r[3]
    schema_val = config.get('schema', 'NOT SET')
    print(f"   Project {r[0]}: {r[1]} -> schema='{schema_val}'")

cur.close()
conn.close()
print("\n" + "=" * 70)