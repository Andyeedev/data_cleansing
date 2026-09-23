import psycopg2
conn = psycopg2.connect(host='localhost',port=5432,dbname='migration_engine',user='postgres',password='dev123456')
cur = conn.cursor()

# Test the exact logic from metadata_intelligence_service.py
test_types = ["decimal", "decimal(18,2)", "decimal identity", "numeric", "float", "real", "double precision", "int", "nvarchar", "bigint"]

for dtype in test_types:
    dtype_lower = dtype.lower() if dtype else ""
    if dtype_lower in ["numeric", "decimal", "double precision", "float", "real"]:
        print(f'"{dtype}" -> NUMERIC_METRIC ✓')
    else:
        print(f'"{dtype}" -> NO MATCH ✗')

conn.close()